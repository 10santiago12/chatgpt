import { View, Text, TextInput, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Keyboard, Animated, StyleSheet } from 'react-native';
import React, { useState, useRef, useEffect, useContext } from 'react';
import { APIResponse } from '@/interfaces/Responses';
import Markdown from 'react-native-markdown-display';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'expo-router';
import styles from '../utils/chat-styles';
import { DataContext } from '../context/DataContext';
import { FirestoreChat, Message } from "@/interfaces/AppInterfaces";

export default function Chat() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [currentChatId, setCurrentChatId] = useState<string | null>(null);
    const [userChats, setUserChats] = useState<FirestoreChat[]>([]);
    const context = useContext(DataContext);
    const { user, logout } = useContext(AuthContext);
    const scrollViewRef = useRef<ScrollView>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(-100)).current;
    const messageFadeAnim = useRef(new Animated.Value(1)).current;
    const router = useRouter();

    // Cargar los chats del usuario cuando el menú se abre
    useEffect(() => {
        if (isMenuVisible && user) {
            const fetchUserChats = async () => {
                const chats = await context.getUserChats(user.uid);
                setUserChats(chats);
            };
            fetchUserChats();
        }
    }, [isMenuVisible, user]);

    // Cargar los mensajes del chat seleccionado
    const loadChatMessages = async (chatId: string) => {
        const messages = await context.getChatMessages(chatId);
        setMessages(messages);
        setCurrentChatId(chatId);
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
  
          // Si no hay un chat actual, crea uno nuevo
          if (!chatId) {
              chatId = (await context.createChat("New Chat", [newUserMessage])) || null;
              setCurrentChatId(chatId);
          } else {
              await context.updateChat(chatId, [...messages, newUserMessage]);
          }
  
          if (!chatId) {
              throw new Error("Failed to create or update the chat.");
          }
  
          // Actualizar el título del chat con las primeras 5 palabras del mensaje
          if (messages.length === 0) { // Solo actualiza el título si es el primer mensaje
              const title = message.split(" ").slice(0, 5).join(" ");
              await context.updateChatTitle(chatId, title);
          }
  
          // Enviar el mensaje a la API y obtener la respuesta
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

    return (
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
                  <TouchableOpacity style={styles.closeButton} onPress={closeMenu}>
                      <Ionicons name="close" size={32} color="#FFF" />
                  </TouchableOpacity>
  
                  <View style={styles.menuContent}>
                      {/* Botón para nuevo chat */}
                      <TouchableOpacity style={styles.newChatButton} onPress={handleNewChat}>
                          <Text style={styles.newChatButtonText}>New chat</Text>
                      </TouchableOpacity>
  
                      {/* Lista de chats */}
                      <ScrollView style={styles.chatList}>
                          {userChats.map((chat) => (
                              <View key={chat.id} style={styles.chatItemContainer}>
                                  <TouchableOpacity
                                      style={styles.chatItem}
                                      onPress={() => loadChatMessages(chat.id)}
                                  >
                                      <Text style={styles.chatItemText}>{chat.title}</Text>
                                  </TouchableOpacity>
                                  {/* Ícono para borrar el chat específico */}
                                  <TouchableOpacity
                                      style={styles.deleteIcon}
                                      onPress={async () => {
                                          await context.deleteChat(chat.id);
                                          setUserChats((prev) => prev.filter((c) => c.id !== chat.id));
                                          if (currentChatId === chat.id) {
                                              setMessages([]);
                                              setCurrentChatId(null);
                                          }
                                      }}
                                  >
                                      <Ionicons name="trash" size={20} color="#FFF" />
                                  </TouchableOpacity>
                              </View>
                          ))}
                      </ScrollView>
  
                      {/* Botón para borrar todos los chats */}
                      <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={async () => {
                              if (user) {
                                  await context.deleteAllChats(user.uid);
                                  setUserChats([]); // Limpiar la lista de chats
                                  setMessages([]); // Limpiar los mensajes
                                  setCurrentChatId(null); // Reiniciar el chat actual
                                  closeMenu(); // Cerrar el menú
                              }
                          }}
                      >
                          <Text style={styles.deleteButtonText}>Delete All Chats</Text>
                      </TouchableOpacity>
  
                      {/* Botón para cerrar sesión */}
                      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                          <Text style={styles.logoutButtonText}>Log Out</Text>
                      </TouchableOpacity>
                  </View>
              </Animated.View>
          )}
  
          {/* Ventana principal de chat */}
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
  
          {/* Input para enviar mensajes */}
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
  );
}