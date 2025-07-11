import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 컴포넌트 마운트 시 로그인 상태 확인
    // 백엔드에서 httpOnly 쿠키를 사용하므로, 클라이언트에서 직접 쿠키를 읽을 수 없습니다.
    // 따라서, 백엔드에 로그인 상태를 확인하는 API를 호출해야 합니다.
    const checkLoginStatus = async () => {
      try {
        const response = await fetch('/api/auth/status', { credentials: 'include' }); // 백엔드에 로그인 상태 확인 요청
        if (response.ok) {
          const data = await response.json();
          setIsLoggedIn(true);
          setUser(data.user); // 백엔드에서 사용자 정보를 함께 전달한다고 가정
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (error) {
        console.error('로그인 상태 확인 중 오류 발생:', error);
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    checkLoginStatus();
  }, []);

  const login = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    navigate('/'); // 로그인 성공 후 메인 페이지로 이동
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' }); // 백엔드에 로그아웃 요청 (쿠키 삭제)
      setIsLoggedIn(false);
      setUser(null);
      navigate('/login'); // 로그아웃 후 로그인 페이지로 이동
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
