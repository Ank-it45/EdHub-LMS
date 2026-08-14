import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('edhub_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const response = await api.get('/auth/me');
        if (response.data.success) {
          setUser(response.data.data);
        }
      } catch (error) {
        console.error('Session validation failed:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [token]);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.success) {
      const { user: userData, token: jwtToken } = response.data.data;
      localStorage.setItem('edhub_token', jwtToken);
      setToken(jwtToken);
      setUser(userData);
      return userData;
    }
    throw new Error(response.data.message || 'Login failed');
  };

  const register = async (name, email, password, role = 'STUDENT', bio = '') => {
    const response = await api.post('/auth/register', { name, email, password, role, bio });
    if (response.data.success) {
      const { user: userData, token: jwtToken } = response.data.data;
      localStorage.setItem('edhub_token', jwtToken);
      setToken(jwtToken);
      setUser(userData);
      return userData;
    }
    throw new Error(response.data.message || 'Registration failed');
  };

  const logout = () => {
    localStorage.removeItem('edhub_token');
    localStorage.removeItem('edhub_user');
    setToken(null);
    setUser(null);
  };

  const registerAsInstructor = async (bio = '') => {
    const response = await api.post('/auth/register-instructor', { bio });
    if (response.data.success) {
      const userData = response.data.data.user;
      setUser(userData);
      return userData;
    }
    throw new Error(response.data.message || 'Instructor registration failed');
  };

  const updateProfile = async (userData) => {
    if (!user) return;
    const response = await api.patch(`/users/${user.id}`, userData);
    if (response.data.success) {
      setUser((prev) => ({ ...prev, ...response.data.data }));
      return response.data.data;
    }
    throw new Error(response.data.message || 'Profile update failed');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        registerAsInstructor,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
