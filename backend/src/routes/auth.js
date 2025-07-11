import express from 'express';
import { kakaoLogin } from '../controllers/authController.js';

const router = express.Router();

// router.post('/register', register); // Note: These routes were causing errors and have been commented out.
// router.post('/login',    login);

// GET /api/auth/kakao
router.get('/kakao/callback', (req, res) => {
  // 1) Get code from query parameter
  const { code } = req.query;
  if (!code) {
    return res.status(400).json({ message: 'Authorization code is required' });
  }
  // 2) Handle token exchange and profile retrieval in the controller
  kakaoLogin(code, res);
});


export default router;
