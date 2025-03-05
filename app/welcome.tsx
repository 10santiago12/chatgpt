import { View, Text, StyleSheet, Button } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import { Image } from 'expo-image';

export default function Welcome() {
  return (
    <View style={styles.container}>
      {}
      <Image
        source={require('../assets/images/images.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.welcomeText}>Welcome to</Text>
      {}
      <Text style={styles.chatGPTTitle}>ChatGPT</Text>
      {}
      <Text style={styles.subtitle}>Ask anything. Get your answer.</Text>

      {}
      <View style={styles.limitationsContainer}>
        <Text style={styles.limitationsTitle}>Limitations</Text>

        {}
        <View style={styles.limitationBox}>
          <Text style={styles.limitationText}>
            May occasionally generate incorrect information
          </Text>
        </View>

        {}
        <View style={styles.limitationBox}>
          <Text style={styles.limitationText}>
            May occasionally produce harmful instructions or biased content
          </Text>
        </View>

        {}
        <View style={styles.limitationBox}>
          <Text style={styles.limitationText}>
            Limited knowledge of world and events after 2021
          </Text>
        </View>
      </View>

      {}
      <Button
        title="Let's Chat!"
        onPress={() => router.push("/chat")}
        color="#18a47c"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#343541',
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  chatGPTTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 40,
    textAlign: 'center',
  },
  limitationsContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
    padding: 10,
  },
  limitationsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  limitationBox: {
    width: '90%',
    backgroundColor: '#40414f',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  limitationText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
});