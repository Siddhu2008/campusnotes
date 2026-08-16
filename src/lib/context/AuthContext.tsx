'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, UserLevel } from '@/types';
import { MOCK_USERS } from '@/lib/data/mock';

const AUTH_STORAGE_KEY = 'campusnotes_auth';
const USERS_STORAGE_KEY = 'campusnotes_users';

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email?: string, password?: string) => User | null;
  register: (profile: {
    name: string;
    email: string;
    password: string;
    branchId?: string;
    semesterId?: string;
    year?: number;
    role?: UserRole;
  }) => User | null;
  logout: () => void;
}

const readStoredUsers = (): User[] => {
  if (typeof window === 'undefined') return [];

  try {
    const saved = localStorage.getItem(USERS_STORAGE_KEY);
    if (!saved) return [...MOCK_USERS];
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [...MOCK_USERS];
  } catch {
    return [...MOCK_USERS];
  }
};

const persistUsers = (users: User[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

const buildUserFromEmail = (
  email: string,
  overrides: Partial<User> = {}
): User => {
  const normalizedEmail = (email || '').trim().toLowerCase();
  const nameFromEmail = normalizedEmail.split('@')[0].replace(/[._-]+/g, ' ');
  const safeName = overrides.name ||
    nameFromEmail
      .split(' ')
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ') || 'Campus User';

  const role: UserRole = overrides.role || (/admin/i.test(normalizedEmail) ? 'admin' : 'student');
  const level: UserLevel = role === 'admin' ? 'Campus Mentor' : 'Beginner';

  return {
    _id: overrides._id || `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name: safeName,
    email: normalizedEmail,
    avatarUrl: overrides.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(safeName)}&background=random`,
    collegeId: overrides.collegeId || 'col_tcet',
    branchId: overrides.branchId || 'br_it',
    year: overrides.year || 2,
    semester: overrides.semester || 3,
    bio: overrides.bio || '',
    role,
    points: overrides.points ?? (role === 'admin' ? 2600 : 1200),
    level,
    isEmailVerified: true,
    isActive: true,
    stats: overrides.stats || {
      uploads: 0,
      downloads: 0,
      bookmarks: 0,
      xp: role === 'admin' ? 2600 : 1200,
    },
    createdAt: overrides.createdAt || new Date().toISOString(),
    updatedAt: overrides.updatedAt || new Date().toISOString(),
  };
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  login: () => null,
  register: () => null,
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const savedState = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!savedState) return;

      const parsed = JSON.parse(savedState);
      if (parsed.isLoggedIn && parsed.user) {
        setUser(parsed.user);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('Error reading auth state', error);
    }
  }, []);

  const persistAuth = (nextUser: User | null, loggedIn: boolean) => {
    if (typeof window === 'undefined') return;

    setUser(nextUser);
    setIsLoggedIn(loggedIn);
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({ isLoggedIn: loggedIn, user: nextUser })
    );
  };

  const login = (email?: string, password?: string) => {
    if (typeof window === 'undefined') return null;

    const normalizedEmail = (email || '').trim().toLowerCase();
    if (!normalizedEmail) return null;

    const users = readStoredUsers();
    const matchedUser =
      users.find((u) => u.email.toLowerCase() === normalizedEmail) ||
      MOCK_USERS.find((u) => u.email.toLowerCase() === normalizedEmail) ||
      buildUserFromEmail(normalizedEmail, {
        role: /admin/i.test(normalizedEmail) ? 'admin' : 'student',
      });

    if (!users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
      persistUsers([...users, matchedUser]);
    }

    persistAuth(matchedUser, true);
    return matchedUser;
  };

  const register = (profile: {
    name: string;
    email: string;
    password: string;
    branchId?: string;
    semesterId?: string;
    year?: number;
    role?: UserRole;
  }) => {
    if (typeof window === 'undefined') return null;

    const normalizedEmail = profile.email.trim().toLowerCase();
    const users = readStoredUsers();
    const existing = users.find((u) => u.email.toLowerCase() === normalizedEmail);

    const newUser = existing || buildUserFromEmail(normalizedEmail, {
      name: profile.name,
      branchId: profile.branchId || 'br_it',
      semester: profile.year ? Number(profile.year) * 2 || 2 : 2,
      year: profile.year || 2,
      role: profile.role || (/admin/i.test(normalizedEmail) ? 'admin' : 'student'),
      points: profile.role === 'admin' ? 2600 : 1200,
    });

    const updatedUsers = existing ? users.map((userItem) => userItem.email.toLowerCase() === normalizedEmail ? { ...userItem, ...newUser } : userItem) : [...users, newUser];
    persistUsers(updatedUsers);
    persistAuth(newUser, true);
    return newUser;
  };

  const logout = () => {
    persistAuth(null, false);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
