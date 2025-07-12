import axios from 'axios';
import User  from '../models/User.js';
import jwt   from 'jsonwebtoken';

export const kakaoLogin = async (code, res) => {
  try {
    // 1) 토큰 발급 요청
    const tokenRes = await axios.post(
      'https://kauth.kakao.com/oauth/token',
      null,
      {
        params: {
          grant_type:    'authorization_code',
          client_id:     process.env.KAKAO_REST_API_KEY,
          redirect_uri:  process.env.KAKAO_REDIRECT_URI,
          code,
        },
      }
    );
    const { access_token } = tokenRes.data;

    // 2) 사용자 정보 요청
    const profileRes = await axios.get(
      'https://kapi.kakao.com/v2/user/me',
      { headers: { Authorization: `Bearer ${access_token}` } }
    );
    const { id } = profileRes.data;

    // 3) DB에 사용자 upsert (있으면 조회, 없으면 생성)
    let user = await User.findOne({ kakaoId: id });
    if (!user) {
      user = await User.create({
        kakaoId: id,
      });
    }

    // 4) JWT 발급
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // 5) 토큰 전달 (쿠키·JSON 중 선택)
    res.cookie('token', token, { httpOnly: true });
    
    // 프론트엔드에서 localStorage에 저장할 수 있도록 토큰도 함께 전달
    return res.redirect(`http://localhost:5173/?token=${token}`);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Kakao login failed' });
  }
};

export const checkAuthStatus = async (req, res) => {
  try {
    // Authorization 헤더에서 토큰 확인
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ isLoggedIn: false, message: '토큰이 없습니다.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ isLoggedIn: false, message: '사용자를 찾을 수 없습니다.' });
    }

    return res.status(200).json({ 
      isLoggedIn: true, 
      user: { id: user._id, kakaoId: user.kakaoId } 
    });
  } catch (error) {
    console.error('Auth status check error:', error);
    return res.status(401).json({ isLoggedIn: false, message: '토큰 검증 실패' });
  }
};

export const logout = (req, res) => {
  res.clearCookie('token');
  return res.status(200).json({ message: 'Logged out successfully' });
};
