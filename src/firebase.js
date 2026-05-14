import { type } from "./api/apiConfig";
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import config from "./api/envConfig";



let firebaseConfig = {};

if (type === "DEV") {

    firebaseConfig = {
        apiKey: config.VITE_FIREBASE_API_KEY,
        authDomain: config.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: config.VITE_FIREBASE_PROJECT_ID,
        storageBucket: config.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: config.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: config.VITE_FIREBASE_APP_ID,
        measurementId: config.VITE_FIREBASE_MEASUREMENT_ID
    };
}

const app = initializeApp(firebaseConfig);

// Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;