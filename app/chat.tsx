import { View, Text, TextInput, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, Keyboard } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { APIResponse } from '@/interfaces/Responses';
import Markdown from 'react-native-markdown-display';
import { Ionicons } from '@expo/vector-icons';
export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ text: string; user: boolean }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);

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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView
        ref={scrollViewRef}
        style={styles.chatContainer}
        contentContainerStyle={{ flexGrow: 1 }}
      >
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
      </ScrollView>

      {}
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, {paddingVertical:15}]}
          value={message}
          onChangeText={setMessage}
          placeholder="Type your message..."
          placeholderTextColor="#bbb"
          returnKeyType="send"
          onSubmitEditing={getResponse}
        />
        {}
        <TouchableOpacity onPress={getResponse} style={styles.sendButton}>
          <Ionicons name="arrow-up" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#343541",
    padding: 10,
  },
  chatContainer: {
    flex: 1,
    marginBottom: 10,
  },
  message: {
    maxWidth: "80%",
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#18a47c",
  },
  aiMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#5d5d67",
  },
  userText: {
    color: "#FFF",
  },
  aiText: {
    color: "#FFF",
  },
  loading: {
    textAlign: "center",
    color: "#FFFFFF",
    marginVertical: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    padding: 10,
    borderRadius: 30,
    marginBottom: 35,
  },
  input: {
    flex: 1,
    color: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  sendButton: {
    backgroundColor: "#18a47c",
    borderRadius: 20,
    padding: 10,
    marginLeft: 10,
  },
});