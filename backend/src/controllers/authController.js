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
    const email = kakao_account.email || `${id}@kakao.com`;

    // 3) DB에 사용자 upsert (있으면 조회, 없으면 생성)
    let user = await User.findOne({ kakaoId: id });
    if (!user) {
      user = await User.create({
        kakaoId:  id,
        email:    email,
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
    return res.redirect(process.env.FRONTEND_URL);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Kakao login failed' });
  }
};
