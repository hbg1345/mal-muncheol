// backend/src/index.js
import express   from 'express';
import cors      from 'cors';
import dotenv    from 'dotenv';
import connectDB from './config/db.js';
import authRouter from './routes/auth.js';
import chatRoomRouter from './routes/chatRoom.js';
import cookieParser from 'cookie-parser';

dotenv.config();

// 1) MongoDB 연결
connectDB(process.env.MONGODB_URI);

const app = express();

// 2) 미들웨어 설정
app.use(cors());
app.use(express.json());  // JSON 바디 파싱
app.use(cookieParser());

// 3) 헬스체크(기본) 라우트
app.get('/', (req, res) => {
  res.send('🟢 Server is up and running');
});

// 4) 인증 관련 라우트 연결
app.use('/api/auth', authRouter);

// 5) 채팅방 관련 라우트 연결
app.use('/api/chatrooms', chatRoomRouter);

// 6) 포트 설정 및 서버 시작
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
