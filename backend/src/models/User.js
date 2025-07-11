import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  kakaoId: { type: String, unique: true, index: true },
  email:   String,
  // 필요시 username, profileImage 등 추가
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// 3) default export
export default User;