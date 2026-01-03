import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: "AIzaSyATnB7DHZp1Gksl-BIcO-itLJzOJ9hX4bw",
  authDomain: "fitness-pro-aa6e0.firebaseapp.com",
  projectId: "fitness-pro-aa6e0",
  storageBucket: "fitness-pro-aa6e0.firebasestorage.app",
  messagingSenderId: "584006295908",
  appId: "1:584006295908:web:559e50b5b20b02b7c75a71",
  measurementId: "G-XZB0Y6N8CD"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Conditionally Initialize Auth for Web and Mobile
const auth = initializeAuth(app, {
  persistence: Platform.OS === 'web' 
    ? browserLocalPersistence 
    : getReactNativePersistence(AsyncStorage)
});

const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
