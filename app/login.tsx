// login.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { router } from "expo-router";
import { useAuthContext } from "@/context/AuthContext"; // Importa el contexto

export default function Login() {
const [isLogin, setIsLogin] = useState(true);
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [username, setUsername] = useState("");

// Usa el contexto de autenticación
const { user, loading, error, success, register, login } = useAuthContext();

const handleAuth = async () => {
if (isLogin) {
    await login(email, password); // Llama a la función login del contexto
} else {
    await register(email, password, username); // Llama a la función register del contexto
}

// Redirigir a la pantalla de chat si no hay errores
if (!error && user) {
    router.push("/chat");
}
};

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

    {/* Mostrar mensajes de error */}
    {error ? <Text style={styles.errorText}>{error}</Text> : null}

    {/* Mostrar mensajes de éxito */}
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
    <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
    />
    <TouchableOpacity style={styles.button} onPress={handleAuth} disabled={loading}>
        <Text style={styles.buttonText}>
        {loading ? "Cargando..." : isLogin ? "Login" : "Register"}
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