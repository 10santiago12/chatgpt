import { View, Text, TextInput, Button, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState, useRef, useEffect } from 'react'; // Importa useRef y useEffect
import { APIResponse } from '@/interfaces/Responses';
import Markdown from 'react-native-markdown-display';

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ text: string; user: boolean }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Referencia al ScrollView
  const scrollViewRef = useRef<ScrollView>(null);

  const getResponse = async () => {
    if (!message.trim()) return;

    setMessages((prev) => [...prev, { text: message, user: true }]); // Agregar mensaje del usuario
    setMessage(""); // Limpiar input

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

  // Desplazar el ScrollView al final cuando se actualizan los mensajes
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]); // Se ejecuta cada vez que `messages` cambia

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"} // Ajusta el comportamiento según la plataforma
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0} // Ajusta el offset si es necesario
    >
      <ScrollView
        ref={scrollViewRef} // Asignar la referencia al ScrollView
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

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type your message..."
          placeholderTextColor="#bbb"
          returnKeyType="send"
          onSubmitEditing={getResponse}
        />
        <Button title="Send" onPress={getResponse} color={"#18a47c"} />
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
    marginVertical: 10,
    borderRadius: 25,
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
  },
});