// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase, ref, set, get, onValue, off } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC6ENhmUrrtrN6HFbudthifGwUGSzWih7A",
  authDomain: "aviatoronline-6c2b4.firebaseapp.com",
  databaseURL: "https://aviatoronline-6c2b4-default-rtdb.firebaseio.com",
  projectId: "aviatoronline-6c2b4",
  storageBucket: "aviatoronline-6c2b4.firebasestorage.app",
  messagingSenderId: "471392622297",
  appId: "1:471392622297:web:95dca8c181277d3526d0c8",
  measurementId: "G-192Z8B860B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const realtimeDb = getDatabase(app);

// Realtime Database helper functions
export const dbRef = ref;
export const dbSet = set;
export const dbGet = get;
export const dbOnValue = onValue;
export const dbOff = off;

// Global notifications helper functions
export const createGlobalNotification = async (title: string, message: string, type: 'info' | 'warning' | 'success' | 'error' = 'info') => {
  const notificationId = `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const notificationRef = ref(realtimeDb, `globalNotifications/${notificationId}`);
  
  await set(notificationRef, {
    title,
    message,
    type,
    timestamp: Date.now(),
    active: true
  });
  
  return notificationId;
};

export const getGlobalNotifications = () => {
  return ref(realtimeDb, 'globalNotifications');
};

export default app;