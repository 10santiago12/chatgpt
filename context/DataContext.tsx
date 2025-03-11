import { createContext, useContext, useState, ReactNode } from "react";
import { db } from "@/utils/firebaseConfig";
import { addDoc, collection, getDocs, updateDoc, doc, serverTimestamp, setDoc, getDoc } from "firebase/firestore/lite";
import { Message } from "@/interfaces/AppInterfaces";

interface DataContextProps {
chats: Message[];
createChat: (text: string, messages: Message[]) => Promise<string | undefined>;
updateChat: (id: string, messages: Message[]) => Promise<void>;
getChats: () => Promise<void>;
}

export const DataContext = createContext<DataContextProps>({} as DataContextProps);

export const useDataContext = () => useContext(DataContext);

export const DataProvider = ({ children }: { children: ReactNode }) => {
const [chats, setChats] = useState<Message[]>([]);

// Crear un nuevo chat
const createChat = async (text: string, messages: Message[]) => {
try {
    const textSplit = text.split(" ");
    const response = await addDoc(collection(db, "chats"), {
    title: textSplit.slice(0, 5).join(" "),
    created_at: serverTimestamp(),
    messages,
    });
    return response.id;
} catch (error) {
    console.error("Error creating chat: ", error);
    return undefined;
}
};

// Actualizar un chat existente
const updateChat = async (id: string, messages: Message[]) => {
try {
    const chatRef = doc(db, "chats", id);

    // Verificar si el documento existe
    const chatDoc = await getDoc(chatRef);
    if (!chatDoc.exists()) {
    // Si no existe, crear un nuevo documento
    await setDoc(chatRef, { messages });
    } else {
    // Si existe, actualizar el documento
    await updateDoc(chatRef, { messages });
    }
} catch (error) {
    console.error("Error updating chat:", error);
}
};

const getChats = async () => {
try {
    const querySnapshot = await getDocs(collection(db, "chats"));
    const newChats: Message[] = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
    })) as unknown as Message[];
    setChats(newChats);
} catch (error) {
    console.error("Error fetching chats:", error);
}
};

return (
<DataContext.Provider value={{ chats, createChat, updateChat, getChats }}>
    {children}
</DataContext.Provider>
);
};