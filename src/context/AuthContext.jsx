import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      authService.setToken(token);
      // fetch user profile when token present
      (async () => {
        const me = await authService.me();
        if (!me || me.error) {
          // token invalid, clear
          setToken(null);
          setUser(null);
        } else {
          setUser(me.user || me);
        }
      })();
    } else {
      localStorage.removeItem('token');
      authService.setToken(null);
    }
  }, [token]);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    if (res?.token) {
      setToken(res.token);
      setUser(res.user);
      navigate('/dashboard');
    }
    return res;
  };

  const register = async (payload) => {
    const res = await authService.register(payload);
    if (res?.token) {
      setToken(res.token);
      setUser(res.user);
      navigate('/dashboard');
    }
    return res;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, setUser, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
