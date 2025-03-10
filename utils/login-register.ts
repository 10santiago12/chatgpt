// authService.ts
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore"; // Import Firestore
import app from './firebaseConfig';

const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore

export const registerUser = async (email: string, password: string, username: string) => {
    try {
        // Register the user with Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save the user's name in Firestore
        await setDoc(doc(db, "users", user.uid), {
            email: user.email,
            username: username,
            createdAt: new Date().toISOString(),
        });

        console.log('User registered and data saved in Firestore:', user.uid);
        return user; // Return the registered user
    } catch (error) {
        console.error('Error registering user:', error);
        throw new Error(getFirebaseErrorMessage(error)); // Throw a readable error
    }
};

export const loginUser = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('User logged in:', userCredential.user);
        return userCredential.user; // Return the logged-in user
    } catch (error) {
        console.error('Error logging in user:', error);
        throw new Error(getFirebaseErrorMessage(error)); // Throw a readable error
    }
};

// Function to translate Firebase errors to readable messages
const getFirebaseErrorMessage = (error: any) => {
    switch (error.code) {
        case 'auth/email-already-in-use':
            return 'The email address is already in use.';
        case 'auth/invalid-email':
            return 'The email address is not valid.';
        case 'auth/weak-password':
            return 'The password is too weak.';
        case 'auth/user-not-found':
            return 'User not found.';
        case 'auth/wrong-password':
            return 'Incorrect password.';
        default:
            return 'An error occurred. Please try again.';
    }
};