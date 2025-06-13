import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import LottieView from 'lottie-react-native';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordStrong, setIsPasswordStrong] = useState(false);
  const [isConfirmMatch, setIsConfirmMatch] = useState(false);

  const router = useRouter();

  const validateEmail = (value: string) => {
    const emailRegex = /\S+@\S+\.\S+/;
    const isValid = emailRegex.test(value);
    setIsEmailValid(isValid);
    setEmailError(isValid ? '' : 'Enter a valid email');
  };

  const validatePassword = (value: string) => {
    if (value.length < 8) {
      setPasswordError('Min 8 characters');
      setIsPasswordStrong(false);
      return;
    }
    if (!/[A-Z]/.test(value)) {
      setPasswordError('At least 1 uppercase letter');
      setIsPasswordStrong(false);
      return;
    }
    if (!/\d/.test(value)) {
      setPasswordError('At least 1 number');
      setIsPasswordStrong(false);
      return;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      setPasswordError('At least 1 special character');
      setIsPasswordStrong(false);
      return;
    }

    setPasswordError('');
    setIsPasswordStrong(true);
  };

  const validateConfirm = (value: string) => {
    const isMatch = value === password;
    setConfirmError(isMatch ? '' : 'Passwords must match');
    setIsConfirmMatch(isMatch);
  };

  const handleSignup = async () => {
    if (!name || !email || !password || !confirm) {
      return Alert.alert('Error', 'Please fill all fields');
    }

    try {
      setLoading(true);
      await axios.post('https://api.moneynut.co.in/auth/signup', {
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

  const isFormValid =
    name && isEmailValid && isPasswordStrong && isConfirmMatch;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Create Account</Text>

        <LottieView
          style={styles.lottie}
          source={require('../assets/Animations/Register.json')}
          autoPlay
          loop
        />

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#888"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#888"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(val) => {
              setEmail(val);
              validateEmail(val);
            }}
          />
          {!!email.length && (
            <Text style={[styles.helperText, isEmailValid && styles.validText]}>
              {isEmailValid ? '✓ Valid email' : emailError}
            </Text>
          )}

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#888"
            secureTextEntry
            value={password}
            onChangeText={(val) => {
              setPassword(val);
              validatePassword(val);
              validateConfirm(confirm);
            }}
          />
          {!!password.length && (
            <Text
              style={[
                styles.helperText,
                isPasswordStrong && styles.validText,
              ]}
            >
              {isPasswordStrong ? '✓ Strong password' : passwordError}
            </Text>
          )}

          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#888"
            secureTextEntry
            value={confirm}
            onChangeText={(val) => {
              setConfirm(val);
              validateConfirm(val);
            }}
          />
          {!!confirm.length && (
            <Text
              style={[
                styles.helperText,
                isConfirmMatch && styles.validText,
              ]}
            >
              {isConfirmMatch ? '✓ Passwords match' : confirmError}
            </Text>
          )}

          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: isFormValid ? '#111' : '#ccc' },
            ]}
            disabled={!isFormValid || loading}
            onPress={handleSignup}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.replace('/login')}>
            <Text style={styles.switchText}>
              Already have an account?{' '}
              <Text style={styles.bold}>Log in</Text>
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
  content: {
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#111',
    textAlign: 'center',
    marginBottom: 12,
  },
  lottie: {
    width: 220,
    height: 220,
    alignSelf: 'center',
    marginBottom: 24,
  },
  form: {
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    fontSize: 16,
    color: '#111',
  },
  helperText: {
    fontSize: 13,
    color: '#d00',
    marginTop: -8,
    marginBottom: 4,
    paddingLeft: 4,
  },
  validText: {
    color: 'green',
  },
  button: {
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  switchText: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 14,
    color: '#444',
  },
  bold: {
    fontWeight: 'bold',
    color: '#111',
  },
});
