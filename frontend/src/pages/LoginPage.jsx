
import React from 'react';

const LoginPage = () => {
  const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
  const KAKAO_REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;
  const handleKakaoLogin = () => {
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;
    window.location.href = kakaoAuthUrl;
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f0f2f5'
    }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>로그인</h1>
      <button
        onClick={handleKakaoLogin}
        style={{
          backgroundColor: '#FEE500',
          color: '#3C1E1E',
          border: 'none',
          padding: '15px 30px',
          borderRadius: '5px',
          fontSize: '18px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}
      >
        <img
          src="https://developers.kakao.com/assets/img/about/logos/kakaologin/kakao_account_login_btn_medium_narrow.png"
          alt="Kakao Login"
          style={{ width: '20px', height: '20px' }}
        />
        카카오로 로그인
      </button>
    </div>
  );
};

export default LoginPage;
