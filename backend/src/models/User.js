import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  // 여기에 나중에 username, email, password 필드 추가
}, { timestamps: true });

export default mongoose.model('User', userSchema);
