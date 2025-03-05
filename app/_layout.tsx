import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        // Opciones globales para todas las pantallas
        headerTintColor: "#fff", // Color del texto del título y la flecha de regresar
        headerTitleStyle: {
          color: "#fff", // Color del texto del título
        },
      }}
    >
      <Stack.Screen name="splashscreen" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ title: "Home", headerShown: false }} />
      <Stack.Screen name="welcome" options={{ title: "Bienvenido" }} />
      <Stack.Screen
        name="chat"
        options={{
          title: "Chat",
          headerStyle: {
            backgroundColor: "#343541", // Color de fondo del header
          },
          headerTintColor: "#fff", // Color del texto del título y la flecha de regresar
          headerTitleStyle: {
            color: "#fff", // Color del texto del título
          },
        }}
      />
    </Stack>
  );
}