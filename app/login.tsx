import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from "react-native";
import { Snackbar } from "react-native-paper";
import { useRouter } from "expo-router";
import axios from "axios";
import LottieView from 'lottie-react-native';
import * as SecureStore from "expo-secure-store";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarColor, setSnackbarColor] = useState("#000");

  const showSnackbar = (message: string, color: string = "#000") => {
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

      const { refreshToken, user } = response.data;

      await SecureStore.setItemAsync("token", refreshToken);
      await SecureStore.setItemAsync("userData", JSON.stringify(user));

      showSnackbar("Login successful...", "black");
      setTimeout(() => router.replace("/"), 300);
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
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.header}>MoneyNut</Text>

        <LottieView
          source={require('../assets/Animations/Login.json')}
          autoPlay
          loop
          style={styles.lottie}
        />

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/signup")}>
            <Text style={styles.signUpLink}>
              Don't have an account?{" "}
              <Text style={{ fontWeight: "bold" }}>Sign up</Text>
            </Text>
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
    paddingHorizontal: 24,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  header: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#111",
  },
  form: {
    width: "100%",
  },
  lottie: {
    width: 260,
    height: 260,
    marginBottom: 30,
  },
  label: {
    fontSize: 18,
    marginBottom: 6,
    color: "#222",
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    fontSize: 16,
    paddingVertical: 10,
    marginBottom: 24,
    color: "#000",
  },
  loginBtn: {
    backgroundColor: "#000",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 8,
  },
  loginText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
  },
  signUpLink: {
    textAlign: "center",
    marginTop: 24,
    fontSize: 16,
    color: "#444",
  },
});
