import { createContext, useContext, useState, ReactNode } from "react";
import { db, auth } from "@/utils/firebaseConfig";
import { addDoc, collection, getDocs, updateDoc, doc, serverTimestamp, setDoc, getDoc, query, where, deleteDoc } from "firebase/firestore/lite";
import { FirestoreChat, Message } from "@/interfaces/AppInterfaces";

interface DataContextProps {
    chats: Message[];
    createChat: (text: string, messages: Message[]) => Promise<string | undefined>;
    updateChat: (id: string, messages: Message[]) => Promise<void>;
    getChats: () => Promise<void>;
    getUserChats: (userId: string) => Promise<FirestoreChat[]>; 
    getChatMessages: (chatId: string) => Promise<Message[]>; 
    updateChatTitle: (chatId: string, title: string) => Promise<void>; 
    deleteChat: (chatId: string) => Promise<void>; 
    deleteAllChats: (userId: string) => Promise<void>; 
}

export const DataContext = createContext<DataContextProps>({} as DataContextProps);

export const useDataContext = () => useContext(DataContext);

export const DataProvider = ({ children }: { children: ReactNode }) => {
    const [chats, setChats] = useState<Message[]>([]);

    const createChat = async (text: string, messages: Message[]) => {
        try {
            const user = auth.currentUser;
            if (!user) {
                throw new Error("No authenticated user found");
            }
    
            const defaultTitle = "New Chat";
            const title = text.trim() ? text.split(" ").slice(0, 5).join(" ") : defaultTitle;
    
            const response = await addDoc(collection(db, "chats"), {
                userid: user.uid,
                user: user.email,
                title: title,
                created_at: serverTimestamp(),
                messages,
            });
    
            return response.id;
        } catch (error) {
            console.error("Error creating chat: ", error);
            return undefined;
        }
    };

    const updateChat = async (id: string, messages: Message[]) => {
        try {
            const chatRef = doc(db, "chats", id);
            const chatDoc = await getDoc(chatRef);
            if (!chatDoc.exists()) {
                await setDoc(chatRef, { messages });
            } else {
                await updateDoc(chatRef, { messages });
            }
        } catch (error) {
            console.error("Error updating chat:", error);
        }
    };

    const updateChatTitle = async (chatId: string, title: string) => {
        try {
            const chatRef = doc(db, "chats", chatId);
            await updateDoc(chatRef, { title });
        } catch (error) {
            console.error("Error updating chat title:", error);
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

    const getUserChats = async (userId: string) => {
        try {
            const q = query(collection(db, "chats"), where("userid", "==", userId));
            const querySnapshot = await getDocs(q);
            const userChats: FirestoreChat[] = querySnapshot.docs.map((doc) => ({
                id: doc.id, 
                ...doc.data(), 
            })) as FirestoreChat[];
            return userChats;
        } catch (error) {
            console.error("Error fetching user chats:", error);
            return [];
        }
    };

    const getChatMessages = async (chatId: string) => {
        try {
            const chatRef = doc(db, "chats", chatId);
            const chatDoc = await getDoc(chatRef);
            if (chatDoc.exists()) {
                return chatDoc.data().messages as Message[];
            }
            return [];
        } catch (error) {
            console.error("Error fetching chat messages:", error);
            return [];
        }
    };

    const deleteChat = async (chatId: string) => {
        try {
            const chatRef = doc(db, "chats", chatId);
            await deleteDoc(chatRef);
        } catch (error) {
            console.error("Error deleting chat:", error);
        }
    };

    const deleteAllChats = async (userId: string) => {
        try {
            const q = query(collection(db, "chats"), where("userid", "==", userId));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
            });
        } catch (error) {
            console.error("Error deleting all chats:", error);
        }
    };

    return (
        <DataContext.Provider value={{ chats, createChat, updateChat, getChats, getUserChats, getChatMessages, updateChatTitle, deleteChat, deleteAllChats }}>
            {children}
        </DataContext.Provider>
    );
};