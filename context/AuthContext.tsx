import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getAuth, onAuthStateChanged, signOut, User } from "firebase/auth";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import app from "../utils/firebaseConfig"; // Asegúrate de que la ruta sea correcta

const auth = getAuth(app);
const db = getFirestore(app);

interface AuthContextType {
user: User | null;
loading: boolean;
registerUser: (email: string, password: string, username: string) => Promise<User>;
loginUser: (email: string, password: string) => Promise<User>;
logoutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// **📌 Proveedor del contexto**
export const AuthProvider = ({ children }: { children: ReactNode }) => {
const [user, setUser] = useState<User | null>(null);
const [loading, setLoading] = useState(true);

// 📌 Escucha el estado de autenticación
useEffect(() => {
const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
    setLoading(false);
});
return () => unsubscribe();
}, []);

// 📌 Registrar usuario y guardarlo en Firestore
const registerUser = async (email: string, password: string, username: string) => {
const userCredential = await createUserWithEmailAndPassword(auth, email, password);
const user = userCredential.user;

await setDoc(doc(db, "users", user.uid), {
    email: user.email,
    username: username,
    createdAt: new Date().toISOString(),
});

setUser(user);
return user;
};

// 📌 Iniciar sesión
const loginUser = async (email: string, password: string) => {
const userCredential = await signInWithEmailAndPassword(auth, email, password);
setUser(userCredential.user);
return userCredential.user;
};

// 📌 Cerrar sesión
const logoutUser = async () => {
await signOut(auth);
setUser(null);
};

return (
<AuthContext.Provider value={{ user, loading, registerUser, loginUser, logoutUser }}>
    {!loading && children} 
</AuthContext.Provider>
);
};

export const useAuth = () => {
const context = useContext(AuthContext);
if (!context) {
throw new Error("useAuth must be used within an AuthProvider");
}
return context;
};