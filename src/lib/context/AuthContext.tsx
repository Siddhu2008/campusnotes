'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { MOCK_USERS } from '@/lib/data/mock';

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email?: string, password?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: MOCK_USERS[0],
  isLoggedIn: true,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(MOCK_USERS[0]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

  useEffect(() => {
    // Check localStorage on mount
    const savedState = localStorage.getItem('campusnotes_auth');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        if (parsed.isLoggedIn === false) {
          setUser(null);
          setIsLoggedIn(false);
        } else if (parsed.user) {
          setUser(parsed.user);
          setIsLoggedIn(true);
        }
      } catch (e) {
        console.error('Error reading auth state', e);
      }
    }
  }, []);

  const login = (email?: string) => {
    const matchedUser = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === (email || '').toLowerCase()
    ) || MOCK_USERS[0];

    setUser(matchedUser);
    setIsLoggedIn(true);
    localStorage.setItem(
      'campusnotes_auth',
      JSON.stringify({ isLoggedIn: true, user: matchedUser })
    );
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.setItem(
      'campusnotes_auth',
      JSON.stringify({ isLoggedIn: false, user: null })
    );
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
