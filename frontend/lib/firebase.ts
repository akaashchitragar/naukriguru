import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAuth, Auth } from 'firebase/auth';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Initialize Firebase only on the client side
let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let auth: Auth | null = null;
let analytics: Analytics | null = null;

// Only initialize Firebase on the client side
if (isBrowser) {
  try {
    // Validate that we have the required config
    if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
      console.error("Firebase configuration is incomplete. Check your environment variables.");
    } else {
      // Initialize Firebase
      app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
      
      // Initialize services with error handling
      try {
        db = getFirestore(app);
      } catch (error) {
        console.error("Firestore initialization error:", error);
      }
      
      try {
        storage = getStorage(app);
      } catch (error) {
        console.error("Storage initialization error:", error);
      }
      
      try {
        auth = getAuth(app);
      } catch (error) {
        console.error("Auth initialization error:", error);
      }
      
      // Initialize Analytics conditionally
      try {
        isSupported().then(supported => {
          if (supported) {
            analytics = getAnalytics(app as FirebaseApp);
          }
        }).catch(error => {
          console.error("Analytics initialization error:", error);
        });
      } catch (error) {
        console.error("Analytics setup error:", error);
      }
    }
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
} else {
  // Server-side placeholder values
  app = null;
  db = null;
  storage = null;
  auth = null;
}

export { app, db, storage, auth, analytics }; 