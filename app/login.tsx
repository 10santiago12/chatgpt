import React, { useState, useEffect } from "react";
import { Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { router } from "expo-router";
import { useAuthContext } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";

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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#343541",
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#fff",
    },
    input: {
        width: "100%",
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
        backgroundColor: "#343541",
        color: "#fff",
    },
    passwordContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: "#343541",
        marginBottom: 15,
        position: "relative",
    },
    passwordInput: {
        flex: 1,
        height: 40,
        paddingHorizontal: 10,
        color: "#fff",
    },
    showPasswordButton: {
        position: "absolute",
        right: 10,
        padding: 10,
    },
    button: {
        width: "60%",
        height: 40,
        backgroundColor: "#18a47c",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 15,
        marginBottom: 10,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    switchText: {
        color: "#fff",
        fontSize: 14,
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    errorText: {
        color: "red",
        marginBottom: 10,
    },
    successText: {
        color: "green",
        marginBottom: 10,
    },
});