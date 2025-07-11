const userSchema = new mongoose.Schema({
  kakaoId: { type: String, unique: true, index: true },
  email:   String,
  // 필요시 username, profileImage 등 추가
}, { timestamps: true });
