import mongoose from 'mongoose';

const chatRoomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  jurors: { type: Number, default: 0 },
  isTeamMode: { type: Boolean, default: false }, // 팀전/개인전
  isItemMode: { type: Boolean, default: false }, // 아이템전
  isRankMode: { type: Boolean, default: false }, // 개인/랭크전
  isActive: { type: Boolean, default: true },
  maxParticipants: { type: Number, default: 10 },
}, { timestamps: true });

const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema);

export default ChatRoom; 