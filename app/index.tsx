import { useRouter } from "expo-router";
import { Text, View, Button } from "react-native";

export default function Index() {

  const router = useRouter();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
    <Button
    title="Go to Details"    
    />
    </View>
  );
}
