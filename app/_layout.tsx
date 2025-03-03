import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack
  screenOptions={{
    
  }}
  
  >
    <Stack.Screen name="splashscreen" options={{headerShown: false}}/>
    <Stack.Screen name="index" options={{title:"Home"}}/>
    <Stack.Screen name="welcome" options={{title:"Bienvenido"}}/>
  </Stack>;
}
