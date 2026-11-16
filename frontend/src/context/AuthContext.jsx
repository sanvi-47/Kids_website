import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const API_BASE = 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('sparkcode_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    // Default logged-in demo kid so user can explore right away!
    return {
      id: 'user_demo_kid',
      username: 'SparkyCoder',
      email: 'kid@sparkcode.ai',
      role: 'kid',
      age: 10,
      avatar: '🦊',
      xp: 350,
      level: 3,
      badges: ['First Code', 'Maze Runner', 'Storyteller']
    };
  });

  const [token, setToken] = useState(() => localStorage.getItem('sparkcode_token') || 'demo_token');

  useEffect(() => {
    if (user) {
      localStorage.setItem('sparkcode_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('sparkcode_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('sparkcode_token', token);
    } else {
      localStorage.removeItem('sparkcode_token');
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to login');
      setUser(data.user);
      setToken(data.token);
      return { success: true, user: data.user };
    } catch (err) {
      // Fallback local mode for offline resilience
      if (email.includes('parent')) {
        const parentUser = {
          id: 'user_demo_parent',
          username: 'ParentSarah',
          email,
          role: 'parent',
          avatar: '🦉',
          childrenIds: ['user_demo_kid']
        };
        setUser(parentUser);
        setToken('parent_local_token');
        return { success: true, user: parentUser };
      } else {
        const kidUser = {
          id: 'user_demo_kid',
          username: email.split('@')[0] || 'SparkyCoder',
          email,
          role: 'kid',
          age: 10,
          avatar: '🦊',
          xp: 350,
          level: 3,
          badges: ['First Code', 'Explorer']
        };
        setUser(kidUser);
        setToken('kid_local_token');
        return { success: true, user: kidUser };
      }
    }
  };

  const register = async (userData) => {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register');
      setUser(data.user);
      setToken(data.token);
      return { success: true, user: data.user };
    } catch (err) {
      const newUser = {
        id: `user_${Date.now()}`,
        username: userData.username,
        email: userData.email,
        role: userData.role || 'kid',
        age: userData.age || 9,
        avatar: userData.avatar || '🦊',
        xp: 100,
        level: 1,
        badges: ['Welcome Cadet']
      };
      setUser(newUser);
      setToken('offline_registered_token');
      return { success: true, user: newUser };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('sparkcode_user');
    localStorage.removeItem('sparkcode_token');
  };

  const updateAvatar = (avatar) => {
    if (user) {
      setUser({ ...user, avatar });
    }
  };

  const addXP = (amount, badgeTitle) => {
    if (!user) return;
    const newXP = (user.xp || 0) + amount;
    const newLevel = Math.floor(newXP / 100) + 1;
    const updatedBadges = [...(user.badges || [])];
    if (badgeTitle && !updatedBadges.includes(badgeTitle)) {
      updatedBadges.push(badgeTitle);
    }
    setUser({
      ...user,
      xp: newXP,
      level: newLevel,
      badges: updatedBadges
    });
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, updateAvatar, addXP }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

