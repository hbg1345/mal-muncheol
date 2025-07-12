import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // URL에서 토큰 파라미터 확인
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('token');
    
    if (token) {
      console.log('Token found in URL, saving to localStorage');
      // 토큰을 localStorage에 저장
      localStorage.setItem('token', token);
      // URL에서 토큰 파라미터 제거
      navigate('/', { replace: true });
    }

    // 컴포넌트 마운트 시 로그인 상태 확인
    const checkLoginStatus = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        console.log('Checking login status, token exists:', !!token);
        
        if (!token) {
          setIsLoggedIn(false);
          setUser(null);
          return;
        }

        const response = await fetch('http://localhost:4000/api/auth/status', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Auth status response:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Auth data:', data);
          setIsLoggedIn(true);
          setUser(data.user);
        } else {
          console.log('Auth failed, removing token');
          // 토큰이 유효하지 않으면 localStorage에서 제거
          localStorage.removeItem('token');
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (error) {
        console.error('로그인 상태 확인 중 오류 발생:', error);
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, [navigate, location.search]);

  const login = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    navigate('/'); // 로그인 성공 후 메인 페이지로 이동
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch('http://localhost:4000/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      setUser(null);
      navigate('/login'); // 로그아웃 후 로그인 페이지로 이동
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      setUser(null);
      navigate('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
