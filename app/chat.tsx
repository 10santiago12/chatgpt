import { View, Text, TextInput, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Keyboard, Animated, StyleSheet } from 'react-native';
import React, { useState, useRef, useEffect, useContext } from 'react';
import Markdown from 'react-native-markdown-display';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import styles from '../utils/chat-styles';
import { DataContext } from '../context/DataContext';
import { FirestoreChat} from "@/interfaces/AppInterfaces";

export default function Chat() {
const [currentChatId, setCurrentChatId] = useState<string | null>(null);
const [userChats, setUserChats] = useState<FirestoreChat[]>([]);
const context = useContext(DataContext);
const { user, logout } = useContext(AuthContext);
const scrollViewRef = useRef<ScrollView>(null);

useEffect(() => {
    if (context.isMenuVisible && user) {
        const fetchUserChats = async () => {
            const chats = await context.getUserChats(user.uid);
            setUserChats(chats);
        };
        fetchUserChats();
    }
}, [context.isMenuVisible, user]);

return (
    <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
    >
        <View style={styles.header}>
            <TouchableOpacity onPress={context.isMenuVisible ? context.closeMenu : context.openMenu}>
                <Ionicons name="menu" size={24} color="#FFF" />
            </TouchableOpacity>
        </View>

        {context.isMenuVisible && (
            <Animated.View
                style={[
                    styles.fullScreenMenu,
                    {
                        opacity: context.fadeAnim,
                        transform: [{ translateY: context.slideAnim }],
                    },
                ]}
            >
                <TouchableOpacity style={styles.closeButton} onPress={context.closeMenu}>
                    <Ionicons name="close" size={32} color="#FFF" />
                </TouchableOpacity>

                <View style={styles.menuContent}>
                    <TouchableOpacity style={styles.newChatButton} onPress={context.handleNewChat}>
                        <Text style={styles.newChatButtonText}>New chat</Text>
                    </TouchableOpacity>

                    <ScrollView style={styles.chatList}>
                        {userChats.map((chat) => (
                            <View key={chat.id} style={styles.chatItemContainer}>
                                <TouchableOpacity
                                    style={styles.chatItem}
                                    onPress={() => context.loadChatMessages(chat.id)}
                                >
                                    <Text style={styles.chatItemText}>{chat.title}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.deleteIcon}
                                    onPress={async () => {
                                        await context.deleteChat(chat.id);
                                        setUserChats((prev) => prev.filter((c) => c.id !== chat.id));
                                        if (currentChatId === chat.id) {
                                            context.setMessages([]);
                                            setCurrentChatId(null);
                                        }
                                    }}
                                >
                                    <Ionicons name="trash" size={20} color="#FFF" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>

                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={async () => {
                            if (user) {
                                await context.deleteAllChats(user.uid);
                                setUserChats([]);
                                context.setMessages([]);
                                setCurrentChatId(null);
                                context.closeMenu();
                            }
                        }}
                    >
                        <Text style={styles.deleteButtonText}>Delete All Chats</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                        <Text style={styles.logoutButtonText}>Log Out</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        )}

        <ScrollView
            ref={scrollViewRef}
            style={styles.chatContainer}
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <Animated.View style={{ opacity: context.messageFadeAnim }}>
                {context.messages.map((msg, index) => (
                    <View key={index} style={[styles.message, msg.sender_by === "Me" ? styles.userMessage : styles.aiMessage]}>
                        <Markdown style={{ body: msg.sender_by === "Me" ? styles.userText : styles.aiText }}>{msg.text}</Markdown>
                    </View>
                ))}
                {context.isLoading && <Text style={styles.loading}>Thinking...</Text>}
            </Animated.View>
        </ScrollView>

        <View style={styles.inputContainer}>
            <TextInput
                style={[styles.input, { paddingVertical: 15 }]}
                value={context.message}
                onChangeText={context.setMessage}
                placeholder="Type your message..."
                placeholderTextColor="#bbb"
                returnKeyType="send"
                onSubmitEditing={context.getResponse}
            />
            <TouchableOpacity onPress={context.getResponse} style={styles.sendButton}>
                <Ionicons name="arrow-up" size={24} color="#FFF" />
            </TouchableOpacity>
        </View>
    </KeyboardAvoidingView>
);
}