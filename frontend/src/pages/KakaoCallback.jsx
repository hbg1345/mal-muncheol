
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const KakaoCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');

    if (code) {
      console.log('카카오 인가 코드:', code);
      // TODO: 이 코드를 백엔드 서버로 전송하여 로그인 처리를 요청합니다.
      // 예시: fetch('YOUR_BACKEND_LOGIN_API_ENDPOINT', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ code: code }),
      // })
      // .then(response => response.json())
      // .then(data => {
      //   console.log('백엔드 응답:', data);
      //   // 백엔드에서 받은 토큰 등을 저장하고 메인 페이지로 리다이렉트
      //   navigate('/');
      // })
      // .catch(error => {
      //   console.error('백엔드 통신 오류:', error);
      //   // 오류 처리
      //   navigate('/login');
      // });

      // 임시로 코드 확인 후 홈으로 리다이렉트 (실제 구현 시 위 주석 해제)
      alert(`카카오 인가 코드: ${code}\n백엔드로 전송 예정`);
      navigate('/'); // 예시: 로그인 성공 후 메인 페이지로 이동

    } else {
      console.error('카카오 인가 코드를 받지 못했습니다.');
      navigate('/login'); // 예시: 코드 없으면 로그인 페이지로 다시 이동
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
