import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const databaseId = "(default)";

export const hasFirebaseConfig = !!(
  firebaseConfig.projectId && 
  firebaseConfig.apiKey
);

let app;
let db: any = null;

if (hasFirebaseConfig) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    if (databaseId && databaseId !== "(default)") {
      db = getFirestore(app, databaseId);
    } else {
      db = getFirestore(app);
    }
    console.log("Firebase initialized successfully with config project:", firebaseConfig.projectId, "database:", databaseId);
  } catch (err) {
    console.error("Firebase initialization failed:", err);
  }
} else {
  console.log("Firebase not configured yet. Operating in LocalStorage-backed simulation mode.");
}

export { db };
