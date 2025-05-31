import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';

export default function LandingPage() {
  const router = useRouter();

  const handleStart = () => {
    router.replace('/login'); // or '/signup' if you prefer
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MoneyNut</Text>

      <LottieView
        style={styles.giff}
        source={require('../assets/Animations/Animation.json')}
        autoPlay
        loop
      />

      <Text style={styles.subtitle}>Explore your expenses smarter</Text>

      <TouchableOpacity style={styles.button} onPress={handleStart}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  giff: {
    width: 250,
    height: 250,
  },
  subtitle: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 30,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});
