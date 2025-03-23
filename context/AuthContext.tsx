import { createContext, useContext, useState, ReactNode } from "react";
import { User, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import app from "@/utils/firebaseConfig";
import { router } from "expo-router";

interface AuthContextProps {
    user: User | null;
    loading: boolean;
    error: string | null;
    success: string | null;
    register: (email: string, password: string, username: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    setError: (error: string | null) => void;
    handleAuth: (email: string, password: string, username: string, isLogin:boolean) => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isLogin] = useState(true);

    const auth = getAuth(app);
    const db = getFirestore(app);

    const register = async (email: string, password: string, username: string) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
    
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
    
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                username: username,
                createdAt: new Date().toISOString(),
            });
    
            setUser(user);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(getFirebaseErrorMessage(error));
            } else {
                setError("An unexpected error occurred.");
                console.error("An error occurred:", error);
            }
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleAuth = async (email: string, password: string, username: string, isLogin: boolean) => {
        if (!email || !password) {
            setError("Please enter your email and password.");
            return;
        }
    
        try {
            if (isLogin) {
                await login(email, password);
            } else {
                if (!username) {
                    setError("Please enter a username.");
                    return;
                }
                await register(email, password, username);
            }
            router.replace("/chat");
        } catch (error) {
            console.error("Authentication error:", error);
        }
    };        

    const login = async (email: string, password: string) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
    
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            setUser(userCredential.user);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(getFirebaseErrorMessage(error));
            } else {
                setError("An error occurred. Please try again.");
            }
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await auth.signOut();
            setUser(null);
            router.replace("/welcome");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    const getFirebaseErrorMessage = (error: any) => {
        switch (error.code) {
            case "auth/email-already-in-use":
                return "The email address is already in use.";
            case "auth/invalid-email":
                return "The email address is not valid.";
            case "auth/weak-password":
                return "The password is too weak.";
            case "auth/user-not-found":
                return "User not found.";
            case "auth/wrong-password":
                return "Incorrect password.";
            default:
                return "An error occurred. Please try again.";
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, success, register, handleAuth, login, logout,setError }}>
            {children}
        </AuthContext.Provider>
    );
};