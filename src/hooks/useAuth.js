import { useState, useEffect } from 'react';
import {
  login as authLogin,
  logout as authLogout,
  register as authRegister,
  getCurrentUser,
  saveUser,
} from '../services/authService';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (email, password, role) => {
    setLoading(true);
    setError(null);

    try {
      const userData = await authLogin({ email, password, role });
      saveUser(userData);
      setUser(userData);
      return userData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, role) => {
    setLoading(true);
    setError(null);

    try {
      const userData = await authRegister({ name, email, password, role });
      saveUser(userData);
      setUser(userData);
      return userData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);

    try {
      authLogout();
      setUser(null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, error, login, register, logout };
};

export default useAuth;