import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  kakaoId: { type: String, unique: true, index: true },
  // 이메일은 카카오에서 제공하지 않으므로 제거
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// 3) default export
export default User;