import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Snackbar } from "react-native-paper";
import { useRouter } from "expo-router";
import axios from "axios";
import LottieView from "lottie-react-native";
import { registerForPushNotificationsAsync } from "../utils/notifications";
import { useAuth } from "@/context/AuthContext";
import { Feather } from '@expo/vector-icons';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarColor, setSnackbarColor] = useState("#000");

  const { login } = useAuth();

  const showSnackbar = (message: string, color = "#000") => {
    setSnackbarMessage(message);
    setSnackbarColor(color);
    setSnackbarVisible(true);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      return showSnackbar("Please fill in all fields", "red");
    }

    try {
      const response = await axios.post(
        "https://api.moneynut.co.in/auth/login",
        {
          email,
          password,
        }
      );

      const { accessToken, refreshToken, user } = response.data;
      await login(accessToken, refreshToken, user);

      try {
        const expoPushToken = await registerForPushNotificationsAsync();
        if (expoPushToken) {
          await axios.post("https://api.moneynut.co.in/auth/push-token", {
            userid: user.id,
            expoPushToken,
          });
        }
      } catch (e) {
        console.warn("Push notification setup failed", e);
      }

      showSnackbar("Login successful...", "black");
      setTimeout(() => router.replace("/tabs"), 300);
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Login failed. Try again.";
      showSnackbar(msg, "red");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.header}>MoneyNut</Text>

        <LottieView
          source={require("../assets/Animations/Login.json")}
          autoPlay
          loop
          style={styles.lottie}
        />

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View style={styles.passwordWrapper}>
            <TextInput
              style={[styles.input2, { flex: 1 }]}
              placeholder="Password"
              placeholderTextColor="#888"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Feather
                name={showPassword ? 'eye-off' : 'eye'}
                size={20}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: email && password ? '#111' : '#ccc' }]}
            onPress={handleLogin}
            disabled={!email || !password}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/forgot-password")}>
            <Text style={styles.linkText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/signup")}>
            <Text style={styles.linkText}>Don't have an account? <Text style={styles.linkBold}>Sign up</Text></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        style={{ backgroundColor: snackbarColor }}
      >
        {snackbarMessage}
      </Snackbar>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "600",
    color: "#111",
    textAlign: "center",
    marginBottom: 20,
  },
  lottie: {
    width: 220,
    height: 220,
    alignSelf: "center",
    marginBottom: 24,
  },
  form: {
    gap: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    fontSize: 16,
    color: "#111",
  },
  input2: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    color: "#111",
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  eyeIcon: {
    paddingHorizontal: 8,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  linkText: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 14,
    color: '#444',
  },
  linkBold: {
    fontWeight: 'bold',
    color: '#111',
  },
});
