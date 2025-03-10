import { Message } from "@/interfaces/AppInterfaces";
import { db } from "@/utils/firebaseConfig";
import { addDoc, collection, getDocs, updateDoc } from "firebase/firestore/lite";
import { createContext, useState } from "react";

interface DataContextProps {
    chats: Message[];
    createChat: (text: string, messages: Message[]) => Promise<string | undefined>;
    updateChat: (id: string, messages: Message[]) => Promise<void>;
    getChats: () => Promise<void>;
}

// Create context
export const DataContext = createContext({} as DataContextProps);

// Create a component for all app
export const DataProvider = ({ children }: any) => {

    const [chats, setChats] = useState([] as Message[])

    const createChat = async (text: string, messages: Message[]) => {
        try {
            const textSplit = text.split(" ");
            const response = await addDoc(collection(db, "chats"), {
                title: textSplit.slice(0, 5).join(" "),
                create_at: new Date(),
                messages
            });
            return response.id
        } catch (error) {
            console.log("Error: ", { error })
        }
    }

    const updateChat = async (id: string, messages: Message[]) => {
        try {
            // @ts-ignore
            const chatRef = doc(db, "chats", id);
            await updateDoc(chatRef, {
                messages
            });
        } catch (error) {
            console.log({ error })
        }
    }

    const getChats = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "chats"));
            const newChats: any = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            setChats(newChats);
        } catch (error) {
            console.log({ error })
        }
    }

    return <DataContext.Provider
        value={{
            chats,
            createChat,
            updateChat,
            getChats
        }}
    >
        {children}
    </DataContext.Provider>
}