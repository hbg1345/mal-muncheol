
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const KakaoCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');

    if (code) {
      console.log('카카오 인가 코드:', code);
      // 백엔드에 인가 코드를 보내 로그인 처리를 요청합니다.
      fetch(`/api/auth/kakao/callback?code=${code}`)
        .then(response => {
          if (!response.ok) {
            // 서버에서 에러 응답이 온 경우 (e.g., 4xx, 5xx)
            throw new Error('Backend server responded with an error.');
          }
          return response.json(); // JSON 응답 파싱
        })
        .then(data => {
          console.log('Login successful:', data);
          login(data.user); // AuthContext의 login 함수 호출 (사용자 정보가 있다면 data.user 전달)
        })
        .catch(error => {
          console.error('백엔드 통신 오류:', error);
          alert('로그인에 실패했습니다. 문제가 지속되면 관리자에게 문의하세요.');
          navigate('/login'); // 오류 발생 시 로그인 페이지로 이동
        });
    } else {
      console.error('카카오 인가 코드를 받지 못했습니다.');
      alert('카카오 인증에 실패했습니다. 다시 시도해 주세요.');
      navigate('/login'); // 코드 없으면 로그인 페이지로 다시 이동
    }
  }, [location, navigate]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f0f2f5'
    }}>
      <p>카카오 로그인 처리 중...</p>
    </div>
  );
};

export default KakaoCallback;
