import { View, Text, TextInput, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Keyboard, Animated } from 'react-native';
import React, { useState, useRef, useEffect, useContext } from 'react';
import { APIResponse } from '@/interfaces/Responses';
import Markdown from 'react-native-markdown-display';
import { Ionicons } from '@expo/vector-icons';
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from 'expo-router';
import styles from '../utils/chat-styles';
import { DataContext, DataProvider } from '../context/DataContext';
import { Message } from "@/interfaces/AppInterfaces";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const context = useContext(DataContext);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const messageFadeAnim = useRef(new Animated.Value(1)).current;
  const router = useRouter();

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }

    const fetchChats = async () => {
      if (context.getChats) {
        await context.getChats();
      }
    };

    fetchChats();
  }, [messages]);

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
        chatId = (await context.createChat(message, [newUserMessage])) || null;
        setCurrentChatId(chatId);
      } else {
        await context.updateChat(chatId, [...messages, newUserMessage]);
      }

      if (!chatId) {
        throw new Error("No se pudo crear o actualizar el chat.");
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

      await context.updateChat(chatId, [...messages, newUserMessage, newAIMessage]);
    } catch (error) {
      console.log("Error:", error);
      setMessages((prev) => [...prev, { text: "Error getting response", sender_by: "Bot", date: new Date(), state: "received" }]);
    } finally {
      setIsLoading(false);
    }
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
      const newChatId = await context.createChat(message, []);
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

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      router.push('/welcome');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <DataProvider>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={isMenuVisible ? closeMenu : openMenu}>
            <Ionicons name="menu" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        {isMenuVisible && (
          <Animated.View
            style={[
              styles.fullScreenMenu,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeMenu}
            >
              <Ionicons name="close" size={24} color="#FFF" />
            </TouchableOpacity>

            <View style={styles.menuContent}>
              <TouchableOpacity style={styles.newChatButton} onPress={handleNewChat}>
                <Text style={styles.newChatButtonText}>Nuevo chat</Text>
              </TouchableOpacity>

              <ScrollView style={styles.chatList}></ScrollView>

              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

        <ScrollView
          ref={scrollViewRef}
          style={styles.chatContainer}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <Animated.View style={{ opacity: messageFadeAnim }}>
            {messages.map((msg, index) => (
              <View key={index} style={[styles.message, msg.sender_by === "Me" ? styles.userMessage : styles.aiMessage]}>
                <Markdown style={{ body: msg.sender_by === "Me" ? styles.userText : styles.aiText }}>{msg.text}</Markdown>
              </View>
            ))}
            {isLoading && <Text style={styles.loading}>Thinking...</Text>}
          </Animated.View>
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { paddingVertical: 15 }]}
            value={message}
            onChangeText={setMessage}
            placeholder="Type your message..."
            placeholderTextColor="#bbb"
            returnKeyType="send"
            onSubmitEditing={getResponse}
          />
          <TouchableOpacity onPress={getResponse} style={styles.sendButton}>
            <Ionicons name="arrow-up" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </DataProvider>
  );
}