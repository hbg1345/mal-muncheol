
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import KakaoCallback from '../pages/KakaoCallback';
import MainPage from '../pages/MainPage';
import { useAuth } from '../context/AuthContext';

function App() {
  const { isLoggedIn, loading } = useAuth();

  // 로딩 중일 때는 로딩 화면 표시
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={isLoggedIn ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/oauth/callback/kakao" element={<KakaoCallback />} />
      {/* 로그인 상태에 따라 메인 페이지 접근을 제어합니다. */}
      <Route
        path="/"
        element={isLoggedIn ? <MainPage /> : <Navigate to="/login" replace />}
      />
      {/* 다른 라우트들을 여기에 추가할 수 있습니다. */}
    </Routes>
  );
}

export default App;
