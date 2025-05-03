import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import axios from 'axios';

const { height } = Dimensions.get('window');

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async () => {
    if (!name || !email || !password || !confirm) {
      return Alert.alert('Error', 'Please fill all fields');
    }
    if (password !== confirm) {
      return Alert.alert('Error', 'Passwords do not match');
    }

    try {
      setLoading(true);
      await axios.post('http://10.142.22.27:3000/auth/signup', {
        name,
        email,
        password,
      });

      Alert.alert('Signed up!', 'Redirecting to login...');
      router.replace('/login');
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Something went wrong';
      Alert.alert('Signup Failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.header}>Spendly</Text>

        <LottieView
          style={styles.lottie}
          source={require('../assets/Register.json')}
          autoPlay
          loop
        />

        <View style={styles.form}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="John Doe"
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor="#999"
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor="#999"
            secureTextEntry
          />

          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            value={confirm}
            onChangeText={setConfirm}
            placeholder="••••••••"
            placeholderTextColor="#999"
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.signupBtn}
            onPress={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.signupText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.replace('/login')}>
            <Text style={styles.loginLink}>
              Already have an account?{' '}
              <Text style={{ fontWeight: 'bold' }}>Log in</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingVertical: 40,
    paddingHorizontal: 24,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  header: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#111',
  },
  lottie: {
    width: 260,
    height: 260,
    marginBottom: 70,
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 18,
    marginBottom: 6,
    color: '#222',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    fontSize: 16,
    paddingVertical: 10,
    marginBottom: 24,
    color: '#000',
  },
  signupBtn: {
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 8,
  },
  signupText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
  },
  loginLink: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 16,
    color: '#444',
  },
});
