// authService.ts
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import app from './firebase-config';

const auth = getAuth(app);

export const registerUser = async (email: string, password: string, username: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log('Usuario registrado:', userCredential.user);
        return userCredential.user; // Devuelve el usuario registrado
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        throw new Error(getFirebaseErrorMessage(error)); // Lanza un error legible
    }
};

export const loginUser = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('Usuario logueado:', userCredential.user);
        return userCredential.user; // Devuelve el usuario logueado
    } catch (error) {
        console.error('Error al loguear usuario:', error);
        throw new Error(getFirebaseErrorMessage(error)); // Lanza un error legible
    }
};

// Función para traducir errores de Firebase a mensajes legibles
const getFirebaseErrorMessage = (error: any) => {
    switch (error.code) {
        case 'auth/email-already-in-use':
            return 'El correo electrónico ya está en uso.';
        case 'auth/invalid-email':
            return 'El correo electrónico no es válido.';
        case 'auth/weak-password':
            return 'La contraseña es demasiado débil.';
        case 'auth/user-not-found':
            return 'Usuario no encontrado.';
        case 'auth/wrong-password':
            return 'Contraseña incorrecta.';
        default:
            return 'Ocurrió un error. Por favor, inténtalo de nuevo.';
    }
};