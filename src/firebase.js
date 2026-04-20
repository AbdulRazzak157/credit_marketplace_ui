import { type } from "./api/apiConfig";
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";



let firebaseConfig = {};

if (type === "DEV") {

    firebaseConfig = {
        apiKey: "AIzaSyDCat1v4FtPwDuDHcYQQ_MpILy7Nyhv-Do",
        authDomain: "dev-credit-marketplace.firebaseapp.com",
        projectId: "dev-credit-marketplace",
        storageBucket: "dev-credit-marketplace.firebasestorage.app",
        messagingSenderId: "512001220434",
        appId: "1:512001220434:web:2d359568a7b4d32b1ca48b",
        measurementId: "G-W793NZ5062"
    };
}

const app = initializeApp(firebaseConfig);

// Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;