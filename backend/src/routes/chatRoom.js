import express from 'express';
import {
  getChatRooms,
  createChatRoom,
  getChatRoom,
  joinChatRoom,
  leaveChatRoom
} from '../controllers/chatRoomController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// 모든 채팅방 라우트에 인증 미들웨어 적용
router.use(authenticateToken);

// 채팅방 목록 조회
router.get('/', getChatRooms);

// 채팅방 생성
router.post('/', createChatRoom);

// 채팅방 상세 정보 조회
router.get('/:id', getChatRoom);

// 채팅방 참가
router.post('/:id/join', joinChatRoom);

// 채팅방 나가기
router.post('/:id/leave', leaveChatRoom);

export default router; 