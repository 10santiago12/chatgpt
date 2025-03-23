import { createContext, useContext, useState, ReactNode, useRef } from "react";
import { db, auth } from "@/utils/firebaseConfig";
import { addDoc, collection, getDocs, updateDoc, doc, serverTimestamp, setDoc, getDoc, query, where, deleteDoc } from "firebase/firestore/lite";
import { FirestoreChat, Message } from "@/interfaces/AppInterfaces";
import { Animated, Keyboard } from "react-native";
import { APIResponse } from "@/interfaces/Responses";

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
    getResponse: () => Promise<void>; 
    loadChatMessages: (chatId: string) => Promise<void>;
    openMenu: () => void;
    closeMenu: () => void;
    handleNewChat: () => Promise<void>;
    message: string;
    setMessage: (message: string) => void;
    messages: Message[];
    setMessages: (messages: Message[]) => void;
    isMenuVisible: boolean;
    isLoading: boolean;
    currentChatId: string | null;
    slideAnim: Animated.Value;
    fadeAnim: Animated.Value;
    messageFadeAnim: Animated.Value;

}

export const DataContext = createContext<DataContextProps>({} as DataContextProps);

export const useDataContext = () => useContext(DataContext);

export const DataProvider = ({ children }: { children: ReactNode }) => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [chats, setChats] = useState<Message[]>([]);
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentChatId, setCurrentChatId] = useState<string | null>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(-100)).current;
    const messageFadeAnim = useRef(new Animated.Value(1)).current;
    

    const loadChatMessages = async (chatId: string) => {
        const messages = await getChatMessages(chatId);
        setMessages(messages);
        setCurrentChatId(chatId);
        closeMenu();
    };

    const openMenu = () => {
        setIsMenuVisible(true);
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const closeMenu = () => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: -100,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => setIsMenuVisible(false));
    };

    const handleNewChat = async () => {
        Animated.timing(messageFadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(async () => {
            const newChatId = await createChat(message, []);
            if (newChatId) {
                setMessages([]);
                setCurrentChatId(newChatId);
                Animated.timing(messageFadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }).start();
            }
        });
        closeMenu();
    };

    const getResponse = async () => {
        if (!message.trim()) return;
    
        const newUserMessage: Message = {
            text: message,
            sender_by: "Me",
            date: new Date(),
            state: "received",
        };
    
        setMessages((prev) => [...prev, newUserMessage]);
        setMessage("");
        Keyboard.dismiss();
    
        try {
            setIsLoading(true);
    
            let chatId = currentChatId;
    
            if (!chatId) {
                chatId = (await createChat("New Chat", [newUserMessage])) || null;
                setCurrentChatId(chatId);
            } else {
                await updateChat(chatId, [...messages, newUserMessage]);
            }
    
            if (!chatId) {
                throw new Error("Failed to create or update the chat.");
            }
    
            if (messages.length === 0) {
                const title = message.split(" ").slice(0, 5).join(" ");
                await updateChatTitle(chatId, title);
            }
    
            const response = await fetch(
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyB3k152tRx7iO3LTeyts5oFzbIR3OBFawA",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: message }] }],
                    }),
                }
            );
    
            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }
    
            const data: APIResponse = await response.json();
            const aiMessage = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response received";
    
            const newAIMessage: Message = {
                text: aiMessage,
                sender_by: "Bot",
                date: new Date(),
                state: "received",
            };
    
            setMessages((prev) => [...prev, newAIMessage]);
    
            await updateChat(chatId, [...messages, newUserMessage, newAIMessage]);
        } catch (error) {
            console.log("Error:", error);
            setMessages((prev) => [...prev, { text: "Error getting response", sender_by: "Bot", date: new Date(), state: "received" }]);
        } finally {
            setIsLoading(false);
        }
    };

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
        <DataContext.Provider 
            value={{ 
                chats, 
                getResponse, 
                createChat, 
                updateChat, 
                handleNewChat, 
                openMenu, 
                closeMenu, 
                getChats, 
                loadChatMessages, 
                getUserChats, 
                getChatMessages, 
                updateChatTitle, 
                deleteChat, 
                deleteAllChats,
                message,
                setMessage,
                messages,
                setMessages,
                isMenuVisible,
                isLoading,
                currentChatId,
                slideAnim,
                fadeAnim,
                messageFadeAnim
            }}
        >
            {children}
        </DataContext.Provider>
    );
};