
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
      // 백엔드에 인가 코드를 보내 로그인 처리를 요청합니다.
      fetch(`http://localhost:4000/api/auth/kakao/callback?code=${code}`)
        .then(response => {
          if (!response.ok) {
            // 서버에서 에러 응답이 온 경우 (e.g., 4xx, 5xx)
            throw new Error('Backend server responded with an error.');
          }
          // 백엔드가 성공적으로 리다이렉트하면, 브라우저는 그 주소로 이동합니다.
          // 별도의 JSON 응답을 기대하는 경우, .then(res => res.json()) 등을 사용합니다.
          // 현재 백엔드는 쿠키를 설정하고 프론트엔드 URL로 리다이렉트하므로,
          // 이 fetch 요청 후 브라우저가 자동으로 메인 페이지로 이동하게 됩니다.
          // 성공적으로 리다이렉트 되었는지 확인하기 위해 현재 페이지를 유지하지 않고,
          // 백엔드의 리다이렉션을 기다립니다.
          console.log('Backend process initiated. Waiting for redirect...');
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
