import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
} from "react-native";
import LottieView from "lottie-react-native";
import { Snackbar } from "react-native-paper";
import axios from "axios";
import { useRouter } from "expo-router";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarColor, setSnackbarColor] = useState("#4caf50");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSendResetLink = async () => {
    if (!email.includes("@")) {
      setSnackbarMessage("Please enter a valid email address");
      setSnackbarColor("#f44336");
      setSnackbarVisible(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "http://192.168.0.105:3000/auth/forgot-password",
        {
          email,
        }
      );

      if (response.status === 201) {
        setSnackbarMessage("Reset link sent to your email");
        setSnackbarColor("#4caf50");

        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setSnackbarMessage("Failed to send reset link");
        setSnackbarColor("#f44336");
      }
    } catch (error: any) {
      const msg = error?.response?.data?.message || "An error occurred";
      setSnackbarMessage(msg);
      setSnackbarColor("#f44336");
    }

    setIsSubmitting(false); // re-enable button on failure
    setSnackbarVisible(true);
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
          source={require("../assets/Animations/Email.json")}
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

          <TouchableOpacity
            style={[styles.resetBtn, { opacity: isSubmitting ? 0.6 : 1 }]}
            onPress={handleSendResetLink}
            disabled={isSubmitting}
          >
            <Text style={styles.resetText}>
              {isSubmitting ? "Sending..." : "Send Reset Link"}
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
    marginBottom: 30,
    color: "#111",
  },
  lottie: {
    width: 260,
    height: 260,
    marginBottom: 20,
  },
  form: {
    width: "100%",
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
  resetBtn: {
    backgroundColor: "#000",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 8,
  },
  resetText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
  },
});
