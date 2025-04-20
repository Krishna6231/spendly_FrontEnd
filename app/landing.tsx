import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

export default function Landing() {
  const router = useRouter();

  const handleGetStarted = async () => {
    await SecureStore.setItemAsync('hasLaunched', 'true');
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Spendly</Text>
      <Button title="Get Started" onPress={handleGetStarted} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});