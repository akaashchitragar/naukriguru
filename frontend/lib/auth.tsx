'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  getRedirectResult
} from 'firebase/auth';
import { auth } from './firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isInitialized: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.log('Auth state check timed out, setting loading to false');
        setLoading(false);
        setIsInitialized(true);
      }
    }, 2000);

    if (auth) {
      try {
        // Set up the auth state change listener to catch any auth changes
        const unsubscribe = onAuthStateChanged(auth, 
          (user) => {
            console.log('Auth state changed. User:', user ? user.email : 'null');
            setUser(user);
            setLoading(false);
            setIsInitialized(true);
            clearTimeout(timeoutId);
          },
          (error) => {
            console.error("Auth state change error:", error);
            setLoading(false);
            setIsInitialized(true);
            clearTimeout(timeoutId);
          }
        );

        return () => {
          unsubscribe();
          clearTimeout(timeoutId);
        };
      } catch (error) {
        console.error("Auth setup error:", error);
        setLoading(false);
        setIsInitialized(true);
        clearTimeout(timeoutId);
      }
    } else {
      setLoading(false);
      setIsInitialized(true);
      clearTimeout(timeoutId);
    }

    return () => clearTimeout(timeoutId);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      if (!auth) throw new Error("Auth not initialized");
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      if (!auth) throw new Error("Auth not initialized");
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      if (!auth) throw new Error("Auth not initialized");
      const provider = new GoogleAuthProvider();
      // Add scopes if needed for more Google API access
      provider.addScope('profile');
      provider.addScope('email');
      
      // Set custom parameters for the auth provider
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      console.log('Starting Google sign-in with popup...');
      const result = await signInWithPopup(auth, provider);
      // Return the user info
      return result.user;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (!auth) throw new Error("Auth not initialized");
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    isInitialized,
    signIn,
    signUp,
    signInWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 