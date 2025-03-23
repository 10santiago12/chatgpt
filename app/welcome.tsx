import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import React, { useState, useRef } from 'react';
import { router } from 'expo-router';
import { Image } from 'expo-image';

export default function Welcome() {
  const [stage, setStage] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const stages = [
    {
      title: "Welcome to ChatGPT",
      subtitle: "Ask anything. Get your answer.",
      content: [
        "Explain quantum computing in simple terms",
        "Get creative ideas for a 10-year-old's birthday",
        "How do I make an HTTP request in Javascript?",
      ],
    },
    {
      title: "Capabilities",
      subtitle: "What ChatGPT can do for you.",
      content: [
        "Remember what user said earlier in the conversation",
        "Allows user to provide follow-up corrections",
        "Trained to decline inappropriate requests",
      ],
    },
    {
      title: "Limitations",
      subtitle: "Things to keep in mind.",
      content: [
        "May occasionally generate incorrect information",
        "May occasionally produce harmful instructions or biased content",
        "Limited knowledge of world and events after 2021",
      ],
    },
  ];

  const nextStage = () => {
    if (stage < stages.length - 1) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setStage(stage + 1);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    } else {
      router.push("/login");
    }
  };

  return (
    <View style={styles.container}>
      {}
      <Image
        source={require('../assets/images/whitelogo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      {}
      <Animated.View style={{ opacity: fadeAnim }}>
        <Text style={styles.welcomeText}>{stages[stage].title}</Text>
        <Text style={styles.subtitle}>{stages[stage].subtitle}</Text>
      </Animated.View>

      {}
      <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
        {stages[stage].content.map((text, index) => (
          <View key={index} style={styles.contentBox}>
            <Text style={styles.contentText}>{text}</Text>
          </View>
        ))}
      </Animated.View>

      {}
      <View style={styles.stageIndicator}>
        {stages.map((_, index) => (
          <View
            key={index}
            style={[
              styles.stageLine,
              index === stage && styles.activeStageLine,
            ]}
          />
        ))}
      </View>

      {}
      <TouchableOpacity style={styles.button} onPress={nextStage}>
        <Text style={styles.buttonText}>
          {stage < stages.length - 1 ? "Next" : "Let's Chat!"}
        </Text>
      </TouchableOpacity>
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
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 40,
    textAlign: 'center',
  },
  contentContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
  contentBox: {
    width: '90%',
    backgroundColor: '#40414f',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  contentText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  stageIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  stageLine: {
    width: 30,
    height: 3,
    backgroundColor: '#555',
    marginHorizontal: 5,
    borderRadius: 2,
  },
  activeStageLine: {
    backgroundColor: '#18a47c',
  },
  button: {
    backgroundColor: '#18a47c',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});