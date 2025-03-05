import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerTintColor: "#fff",
        headerTitleStyle: {
          color: "#fff",
        },
      }}
    >
      <Stack.Screen name="splashscreen" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ title: "Home", headerShown: false }} />
      <Stack.Screen name="welcome" options={{ title: "Welcome",headerShown:false }} />
      <Stack.Screen
        name="chat"
        options={{
          title: "Chat",
          headerStyle: {
            backgroundColor: "#343541",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            color: "#fff",
          },
        }}
      />
    </Stack>
  );
}