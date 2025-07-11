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
    const { id, kakao_account } = profileRes.data;
    // 이메일은 선택 동의 항목이므로, 없는 경우를 대비하여 처리합니다.
    const email = kakao_account?.email || `${id}@kakao.com`;

    // 3) DB에 사용자 upsert (있으면 조회, 없으면 생성)
    let user = await User.findOne({ kakaoId: id });
    if (!user) {
      user = await User.create({
        kakaoId:  id,
        // 필요시 추가 필드
      });
    }

    // 4) JWT 발급
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // 5) 토큰 전달 (쿠키·JSON 중 선택)
    res.cookie('token', token, { httpOnly: true });
    return res.redirect('http://localhost:5173/');
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Kakao login failed' });
  }
};

export const checkAuthStatus = async (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.set('Surrogate-Control', 'no-store');
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ isLoggedIn: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password'); // 비밀번호 필드는 제외
    if (!user) {
      return res.status(401).json({ isLoggedIn: false });
    }
    return res.status(200).json({ isLoggedIn: true, user: { id: user._id, kakaoId: user.kakaoId } }); // 필요한 사용자 정보만 전달
  } catch (err) {
    console.error('JWT verification failed:', err);
    return res.status(401).json({ isLoggedIn: false });
  }
};

export const logout = (req, res) => {
  res.clearCookie('token');
  return res.status(200).json({ message: 'Logged out successfully' });
};
