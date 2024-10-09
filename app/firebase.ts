import { initializeApp, FirebaseApp } from "firebase/app";
// import { getFirestore } from 'firebase/firestore';
import { getAuth, Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMIAN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | undefined;
let auth: Auth | undefined;

try {
  const requiredConfigKeys = ['apiKey', 'authDomain', 'projectId', 'appId'] as const;
  const missingKeys = requiredConfigKeys.filter(key => !firebaseConfig[key as keyof typeof firebaseConfig]);

  if (missingKeys.length > 0) {
    console.error(`Missing required Firebase config keys: ${missingKeys.join(', ')}`);
    throw new Error(`Missing required Firebase config keys: ${missingKeys.join(', ')}`);
  }

  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
//   console.log('Firebase initialized successfully');
} catch (error) {
  console.error("Error initializing Firebase:", error);
}

export { auth };
// export const db = getFirestore(app);