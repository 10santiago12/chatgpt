import { useRouter } from "expo-router";
import {View, Button } from "react-native";

export default function Index() {

  const router = useRouter();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#343541",
      }}
    >
    <Button
    title="Iniciar app :)"
    onPress={() => router.push("/splashscreen")}
    color={"#58bed5"}    
    />
    </View>
  );
}