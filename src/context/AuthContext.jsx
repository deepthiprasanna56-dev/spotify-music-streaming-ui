import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'spotify_user_session';

const DEFAULT_DEMO_USER = {
  id: 'user-alex-101',
  name: 'Alex Rivera',
  username: 'alexmusic',
  email: 'alex.rivera@example.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  plan: 'free', // 'free' | 'premium'
  bio: 'Music enthusiast, weekend DJ, and lofi beat curator 🎧',
  memberSince: 'March 2024',
  favoriteGenres: ['Pop', 'Hip-Hop', 'Electronic', 'Chill & Lofi'],
  totalMinutesListened: 1420,
  tracksPlayedCount: 384,
};

const DEMO_PREMIUM_USER = {
  id: 'user-sarah-202',
  name: 'Sarah Connor',
  username: 'sarah_vip',
  email: 'sarah.c@soundpulse.io',
  avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
  plan: 'premium',
  bio: 'Audiophile, concert seeker, living soundtrack creator ✨ High Fidelity only.',
  memberSince: 'January 2023',
  favoriteGenres: ['Rock Classics', 'R&B & Soul', 'Indie & Alt', 'Bollywood & Desi'],
  totalMinutesListened: 4890,
  tracksPlayedCount: 1290,
};

export const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
      // Start with the default demo user for frictionless instant enjoyment
      return DEFAULT_DEMO_USER;
    } catch {
      return DEFAULT_DEMO_USER;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login'); // 'login' | 'signup'

  // Persist session to localStorage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      console.warn('Could not persist auth session:', e);
    }
  }, [user]);

  // Open modal helpers
  const openLogin = useCallback(() => {
    setAuthModalTab('login');
    setIsAuthModalOpen(true);
  }, []);

  const openSignup = useCallback(() => {
    setAuthModalTab('signup');
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  // Login handler
  const login = useCallback((email, password) => {
    // Check demo credentials or create session
    const isPremiumEmail = email.toLowerCase().includes('sarah') || email.toLowerCase().includes('premium');
    const baseUser = isPremiumEmail ? DEMO_PREMIUM_USER : DEFAULT_DEMO_USER;

    const loggedUser = {
      ...baseUser,
      email: email.trim(),
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      username: email.split('@')[0].toLowerCase(),
    };

    setUser(loggedUser);
    setIsAuthModalOpen(false);
    return loggedUser;
  }, []);

  // Quick 1-click Demo Login
  const demoLogin = useCallback((type = 'free') => {
    const chosenUser = type === 'premium' ? DEMO_PREMIUM_USER : DEFAULT_DEMO_USER;
    setUser(chosenUser);
    setIsAuthModalOpen(false);
    return chosenUser;
  }, []);

  // Sign up handler
  const signup = useCallback(({ name, email, password, avatar, favoriteGenres }) => {
    const newUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      username: (email.split('@')[0] || name.replace(/\s+/g, '')).toLowerCase(),
      email: email.trim(),
      avatar: avatar || AVATAR_PRESETS[0],
      plan: 'free',
      bio: 'Just joined Spotify! Exploring new beats 🎵',
      memberSince: new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date()),
      favoriteGenres: favoriteGenres && favoriteGenres.length > 0 ? favoriteGenres : ['Pop', 'Bollywood & Desi', 'Chill & Lofi'],
      totalMinutesListened: 0,
      tracksPlayedCount: 0,
    };

    setUser(newUser);
    setIsAuthModalOpen(false);
    return newUser;
  }, []);

  // Update profile handler
  const updateProfile = useCallback((updates) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      return updated;
    });
  }, []);

  // Toggle Plan (Upgrade to Premium / Switch Plan)
  const togglePlan = useCallback(() => {
    setUser((prev) => {
      if (!prev) return prev;
      const nextPlan = prev.plan === 'premium' ? 'free' : 'premium';
      return { ...prev, plan: nextPlan };
    });
  }, []);

  // Logout handler
  const logout = useCallback(() => {
    setUser(null);
  }, []);

  // Increment user listening time & track count
  const recordTrackPlay = useCallback(() => {
    setUser((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        tracksPlayedCount: (prev.tracksPlayedCount || 0) + 1,
        totalMinutesListened: (prev.totalMinutesListened || 0) + 3,
      };
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAuthModalOpen,
        authModalTab,
        setAuthModalTab,
        openLogin,
        openSignup,
        closeAuthModal,
        login,
        signup,
        logout,
        demoLogin,
        updateProfile,
        togglePlan,
        recordTrackPlay,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
