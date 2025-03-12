// AuthContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import app from "@/utils/firebaseConfig";
import { User } from "firebase/auth";

interface AuthContextProps {
user: User | null;
loading: boolean;
error: string | null;
success: string | null;
register: (email: string, password: string, username: string) => Promise<void>;
login: (email: string, password: string) => Promise<void>;
logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
const [user, setUser] = useState<User | null>(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [success, setSuccess] = useState<string | null>(null);

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
    setSuccess("Registro exitoso");
} catch (error) {
    setError(getFirebaseErrorMessage(error));
} finally {
    setLoading(false);
}
};

const login = async (email: string, password: string) => {
setLoading(true);
setError(null);
setSuccess(null);

try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    setUser(userCredential.user);
    setSuccess("Inicio de sesión exitoso");
} catch (error) {
    setError(getFirebaseErrorMessage(error));
} finally {
    setLoading(false);
}
};

const logout = () => {
setUser(null);
setSuccess("Sesión cerrada");
};

const getFirebaseErrorMessage = (error: any) => {
switch (error.code) {
    case "auth/email-already-in-use":
    return "El correo electrónico ya está en uso.";
    case "auth/invalid-email":
    return "El correo electrónico no es válido.";
    case "auth/weak-password":
    return "La contraseña es demasiado débil.";
    case "auth/user-not-found":
    return "Usuario no encontrado.";
    case "auth/wrong-password":
    return "Contraseña incorrecta.";
    default:
    return "Ocurrió un error. Por favor, inténtalo de nuevo.";
}
};

return (
<AuthContext.Provider value={{ user, loading, error, success, register, login, logout }}>
    {children}
</AuthContext.Provider>
);
};