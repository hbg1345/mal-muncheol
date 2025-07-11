
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import KakaoCallback from '../pages/KakaoCallback';
import { useAuth } from '../context/AuthContext';

function App() {
  const { isLoggedIn } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isLoggedIn ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/oauth/callback/kakao" element={<KakaoCallback />} />
      {/* 로그인 상태에 따라 메인 페이지 접근을 제어합니다. */}
      <Route
        path="/"
        element={isLoggedIn ? <div>메인 페이지 (로그인 후 이동)</div> : <Navigate to="/login" replace />}
      />
      {/* 다른 라우트들을 여기에 추가할 수 있습니다. */}
    </Routes>
  );
}

export default App;
