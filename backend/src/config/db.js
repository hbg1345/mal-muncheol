// src/config/db.js
import mongoose from 'mongoose';

/**
 * MongoDB에 연결해 주는 함수
 * @param {string} uri - process.env.MONGODB_URI (예: mongodb://localhost:27017/myapp)
 */
const connectDB = async (uri) => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
