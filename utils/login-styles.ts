import { StyleSheet } from 'react-native';

export default StyleSheet.create({

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