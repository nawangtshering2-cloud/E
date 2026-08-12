import { createContext, useContext, useMemo, useState } from 'react';
import { mockUsers } from '../data/mockData';

const AuthContext = createContext(null);
const STORAGE_KEY = 'ewms_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem(STORAGE_KEY);
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const [error, setError] = useState('');

  const login = (email, password) => {
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const matchedUser = mockUsers.find(
      (candidate) =>
        candidate.email.toLowerCase() === normalizedEmail &&
        candidate.password === String(password || '')
    );

    if (!matchedUser) {
      const message = 'Invalid email or password. Please try the demo credentials below.';
      setError(message);
      return false;
    }

    const authUser = {
      id: matchedUser.id,
      name: matchedUser.name,
      email: matchedUser.email,
      role: matchedUser.role,
    };

    setUser(authUser);
    setError('');
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    setError('');
    localStorage.removeItem(STORAGE_KEY);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      error,
      login,
      logout,
      setError,
    }),
    [user, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
