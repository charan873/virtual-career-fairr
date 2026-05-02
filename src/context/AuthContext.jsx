import React, { createContext, useState, useEffect } from 'react';
import {
  login as authLogin,
  logout as authLogout,
  register as authRegister,
  getCurrentUser,
  saveUser,
} from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (email, password, role) => {
    const userData = await authLogin({ email, password, role });
    saveUser(userData);
    setUser(userData);
    return userData;
  };

  const logout = async () => {
    authLogout();
    setUser(null);
  };

  const register = async (name, email, password, role) => {
    const userData = await authRegister({ name, email, password, role });
    saveUser(userData);
    setUser(userData);
    return userData;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};