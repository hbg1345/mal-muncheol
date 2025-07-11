
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import KakaoCallback from '../pages/KakaoCallback';

function App() {
  // TODO: 실제 로그인 상태는 백엔드로부터 받은 토큰 유무 등으로 판단해야 합니다.
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 임시로 false 설정

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/oauth/callback/kakao" element={<KakaoCallback />} />
        {/* 로그인 상태에 따라 메인 페이지 접근을 제어합니다. */}
        <Route
          path="/"
          element={isLoggedIn ? <div>메인 페이지 (로그인 후 이동)</div> : <Navigate to="/login" replace />}
        />
        {/* 다른 라우트들을 여기에 추가할 수 있습니다. */}
      </Routes>
    </Router>
  );
}

export default App;
