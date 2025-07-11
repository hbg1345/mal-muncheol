import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login',    login);

// POST /api/auth/kakao
router.get('/kakao', (req, res) => {
  // 1) 프론트에서 전달받은 code 쿼리 파라미터
  const { code } = req.query;
  // 2) 토큰 교환·프로필 조회 로직은 아래 컨트롤러에서 처리
  kakaoLogin(code, res);
});


export default router;
