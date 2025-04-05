import { useState } from 'react';
import { View, Text, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthInput } from '../components/AuthInput';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert('Error', 'Please fill in all fields');
    }

    try {
      const response = await axios.post('http://10.81.20.135:3000/auth/login', {
        email,
        password,
      });

      Alert.alert('Login Success', 'Redirecting to dashboard...');
      router.replace('/dashboard');
    } catch (error: any) {
      console.log('Login error:', error);
      const errorMsg =
        error?.response?.data?.message || 'Login failed. Try again.';
      Alert.alert('Login Failed', errorMsg);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        Login
      </Text>

      <AuthInput
        label="Email"
        value={email}
        onChangeText={setEmail}
      />
      <AuthInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={{
          backgroundColor: '#007bff',
          padding: 12,
          borderRadius: 8,
          marginTop: 12,
        }}
        onPress={handleLogin}
      >
        <Text style={{ color: '#fff', textAlign: 'center' }}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{ marginTop: 12 }}
        onPress={() => router.push('/signup')}
      >
        <Text style={{ color: '#007bff', textAlign: 'center' }}>
          Don't have an account? Sign up
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          marginTop: 20,
          backgroundColor: '#db4437',
          padding: 12,
          borderRadius: 8,
        }}
        onPress={() => Alert.alert('Google Sign-In', 'This is a dummy button.')}
      >
        <Text style={{ color: '#fff', textAlign: 'center' }}>
          Sign in with Google
        </Text>
      </TouchableOpacity>
    </View>
  );
}
