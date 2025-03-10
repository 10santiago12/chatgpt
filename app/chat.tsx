import { View, Text, TextInput, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Keyboard, Animated } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { APIResponse } from '@/interfaces/Responses';
import Markdown from 'react-native-markdown-display';
import { Ionicons } from '@expo/vector-icons';
import { getAuth, signOut } from "firebase/auth";
import { router } from 'expo-router';
import styles from '../utils/chat-styles';
import { saveMessage } from '../utils/chats';

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ text: string; user: boolean }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const messageFadeAnim = useRef(new Animated.Value(1)).current;

  const getResponse = async () => {
    if (!message.trim()) return;

    setMessages((prev) => [...prev, { text: message, user: true }]);
    setMessage("");
    Keyboard.dismiss();

    try {
      setIsLoading(true);
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

      const data: APIResponse = await response.json();
      const aiMessage = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response received";

      // Guardar mensaje del usuario y mensaje de la AI en Firestore
      const chatId = "uniqueChatId"; // Debes definir cómo obtener y manejar el ID único de cada chat
      await saveMessage(chatId, message, true);
      await saveMessage(chatId, aiMessage, false);

      setMessages((prev) => [...prev, { text: aiMessage, user: false }]);
    } catch (error) {
      console.log("Error:", error);
      setMessages((prev) => [...prev, { text: "Error getting response", user: false }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

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

  const handleNewChat = () => {
    Animated.timing(messageFadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setMessages([]);
      Animated.timing(messageFadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
    >
      {/* Header con el botón del menú */}
      <View style={styles.header}>
        <TouchableOpacity onPress={isMenuVisible ? closeMenu : openMenu}>
          <Ionicons name="menu" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Pantalla completa del menú */}
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
          {/* Botón de "X" para cerrar el menú */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={closeMenu}
          >
            <Ionicons name="close" size={24} color="#FFF" />
          </TouchableOpacity>

          <View style={styles.menuContent}>
            {/* Botón de "Nuevo chat" */}
            <TouchableOpacity style={styles.newChatButton} onPress={handleNewChat}>
              <Text style={styles.newChatButtonText}>Nuevo chat</Text>
            </TouchableOpacity>

            {/* Lista de chats */}
            <ScrollView style={styles.chatList}>
            </ScrollView>

            {/* Botón de "Cerrar sesión" */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
      {/* Contenedor del chat */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.chatContainer}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <Animated.View style={{ opacity: messageFadeAnim }}>
          {messages.map((msg, index) => (
            <View key={index} style={[styles.message, msg.user ? styles.userMessage : styles.aiMessage]}>
              {msg.user ? (
                <Markdown style={{ body: styles.userText }}>{msg.text}</Markdown>
              ) : (
                <Markdown style={{ body: styles.aiText }}>{msg.text}</Markdown>
              )}
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