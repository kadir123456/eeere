'use client';

import { useEffect, useState } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth, realtimeDb, dbRef, dbSet, dbGet } from '@/lib/firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        loadUserProfile(user.uid);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      const userRef = dbRef(realtimeDb, `users/${userId}`);
      const snapshot = await dbGet(userRef);
      const profile = snapshot.val();
      setUserProfile(profile);
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const createUserProfile = async (user: User) => {
    try {
      const userRef = dbRef(realtimeDb, `users/${user.uid}`);
      const userProfile = {
        profile: {
          email: user.email,
          name: user.displayName || 'User'
        },
        subscription: {
          tier: 'free',
          expiresAt: null
        },
        botSettings: {
          isActive: false,
          timeframe: '15m',
          leverage: 10,
          positionSizePercent: 5,
          allowedPairs: ['BTCUSDT']
        },
        paymentInfo: {
          status: 'none'
        },
        tradeHistory: {}
      };
      
      await dbSet(userRef, userProfile);
      setUserProfile(userProfile);
    } catch (error) {
      console.error('Error creating user profile:', error);
    }
  };
  const signIn = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return { user: result.user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await createUserProfile(result.user);
      return { user: result.user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Check if user profile exists, create if not
      const userRef = dbRef(realtimeDb, `users/${result.user.uid}`);
      const snapshot = await dbGet(userRef);
      if (!snapshot.exists()) {
        await createUserProfile(result.user);
      }
      
      return { user: result.user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  };

  return {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logout
  };
}