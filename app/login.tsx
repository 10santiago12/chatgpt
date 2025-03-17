import React, { useState, useEffect } from "react";
import { Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { router } from "expo-router";
import { useAuthContext } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import styles from "@/utils/login-styles";

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [secureText, setSecureText] = useState(true);

    const { user, loading, error, success, handleAuth } = useAuthContext();

    useEffect(() => {
        if (user) {
            router.push("/chat");
        } else {
            router.push("/login");
        }
    }, [user]);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
            keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 40}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Image
                    source={require("../assets/images/images.png")}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.title}>{isLogin ? "Login" : "Register"}</Text>

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                {success ? <Text style={styles.successText}>{success}</Text> : null}

                {!isLogin && (
                    <TextInput
                        style={styles.input}
                        placeholder="Name"
                        value={username}
                        onChangeText={setUsername}
                    />
                )}
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={secureText}
                    />
                    <TouchableOpacity
                        style={styles.showPasswordButton}
                        onPress={() => setSecureText(!secureText)}
                    >
                        <Ionicons
                            name={secureText ? "eye-off" : "eye"}
                            size={24}
                            color="#fff"
                        />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => handleAuth(email, password, username, isLogin)} 
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>
                        {loading ? "Loading..." : isLogin ? "Login" : "Register"}
                    </Text>
                </TouchableOpacity>


                <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                    <Text style={[styles.switchText, { textDecorationLine: "underline" }]}>
                        {isLogin
                            ? "Don't have an account? Register"
                            : "Already have an account? Login"}
                    </Text> 
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}