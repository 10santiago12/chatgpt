// firestoreService.ts
import { getFirestore, doc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import { db } from './firebaseConfig';  // Asegúrate de importar db desde tu archivo de configuración

export const saveMessage = async (chatId: string, message: string, user: boolean) => {
const auth = getAuth();
const userId = auth.currentUser?.uid;

if (!userId) {
throw new Error("User not authenticated");
}

const messageData = {
text: message,
user: user,
timestamp: Timestamp.now(),
};

try {
const chatRef = doc(db, `users/${userId}/chats/${chatId}`);

// Añadir el mensaje al array de mensajes en el chat
await updateDoc(chatRef, {
    messages: arrayUnion(messageData)
});

console.log("Message saved successfully");
} catch (error) {
console.error("Error saving message: ", error);
}
};
