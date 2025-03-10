// AuthScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { registerUser, loginUser } from '../utils/login-register';
import { router } from 'expo-router'; // Importa router de expo-router

export default function AuthScreen() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // Estado para mensajes de error
    const [successMessage, setSuccessMessage] = useState(''); // Estado para mensajes de éxito

    const handleAuth = async () => {
        setErrorMessage(''); // Limpiar mensajes de error previos
        setSuccessMessage(''); // Limpiar mensajes de éxito previos

        try {
            if (isLogin) {
                await loginUser(email, password);
                setSuccessMessage('Inicio de sesión exitoso');
                router.push('/chat'); // Redirigir a la pantalla de chat usando router
            } else {
                await registerUser(email, password, username);
                setSuccessMessage('Registro exitoso');
                router.push('/chat'); // Redirigir a la pantalla de chat usando router
            }
        } catch (error) {
            console.error('Error en la autenticación:', error);
            setErrorMessage((error as Error).message); // Mostrar mensaje de error
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
                    source={require('../assets/images/images.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.title}>{isLogin ? 'Login' : 'Register'}</Text>

                {/* Mostrar mensajes de error */}
                {errorMessage ? (
                    <Text style={styles.errorText}>{errorMessage}</Text>
                ) : null}

                {/* Mostrar mensajes de éxito */}
                {successMessage ? (
                    <Text style={styles.successText}>{successMessage}</Text>
                ) : null}

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
                <TouchableOpacity style={styles.button} onPress={handleAuth}>
                    <Text style={styles.buttonText}>{isLogin ? 'Login' : 'Register'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                    <Text style={[styles.switchText, { textDecorationLine: 'underline' }]}>
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
        backgroundColor: '#343541',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#fff',
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
        backgroundColor: '#343541',
        color: '#fff',
    },
    button: {
        width: "60%",
        height: 40,
        backgroundColor: '#18a47c',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    switchText: {
        color: '#fff',
        fontSize: 14,
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    successText: {
        color: 'green',
        marginBottom: 10,
    },
});