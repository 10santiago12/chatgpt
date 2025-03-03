import { View,StyleSheet} from 'react-native';
import { Image } from 'expo-image';
import React from 'react';

export default function Page() {
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
    backgroundColor: "#1E1E1E",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 500,
    height: 500,
    resizeMode: "contain",
  },
});
