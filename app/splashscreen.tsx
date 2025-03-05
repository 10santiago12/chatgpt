import { View,StyleSheet} from 'react-native';
import { Image } from 'expo-image';
import React from 'react';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function splashscreen() {
  
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.replace("/welcome");
    }, 1000);
  }, []);
  
  return (
    <View style={styles.container}>
      <Image
        source="https://freelogopng.com/images/all_img/1681039182chatgpt-logo-with-name.png"
        style={styles.logo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#343541",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 250,
    height: 250,
    resizeMode: "contain",
  },
});