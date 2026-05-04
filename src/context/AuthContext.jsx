


import { Children, createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signInWithCustomToken, signInWithEmailAndPassword, signOut } from "firebase/auth";
import API_URL from "../api/apiConfig";

const AuthContext = createContext()

export function AuthContextProvider({ children }) {

    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [otpSession, setOtpSession] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [otpReferenceId, setOtpReferenceId] = useState("")


    // Login
    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };
    const loginWithCustomToken = (customToken) => {
        return signInWithCustomToken(auth, customToken);
    };

    // Logout
    const logout = () => {
        setCurrentUser(null);
        return signOut(auth);
    };

    const getAccessToken = async (refresh = false) => {
        if (!currentUser) return null;
        try {
            const token = await currentUser.getIdToken(refresh);
            return token;
        } catch (error) {
            console.error("Error getting access token:", error);
            return null;
        }
    };

    const getUserProfile = async (user) => {
        try {
            const token = await user.accessToken;
            const response = await fetch(API_URL.profile.getUserProfile, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    // 'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorResult = await response.json();
                throw new Error(errorResult?.message);
            }

            const result = await response.json();
            console.log("user Profile : ",result)

            if (result?.response) {
                setUserProfile(result?.response);
            }

        } catch (error) {
            console.log("Error in fetch user account profile : ", error?.message);
        }
    }



    useEffect(() => {

        const unsubscribe = onAuthStateChanged(auth, async (user) => {

            setLoading(false)
            if (user) {
                setCurrentUser(user);
                await getUserProfile(user);
            }

        });

        return () => unsubscribe();

    }, []);


    const value = {
        loading,
        currentUser,
        userProfile,
        setUserProfile,
        login,
        logout,
        getAccessToken,
        otpSession,
        setOtpSession,
        userEmail,
        setUserEmail,
        loginWithCustomToken,
        otpReferenceId,
        setOtpReferenceId
    };


    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}