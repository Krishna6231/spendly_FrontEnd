import { useState } from "react";
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { AuthInput } from "../components/AuthInput";
import axios from "axios";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async () => {
    if (!name || !email || !password || !confirm) {
      return Alert.alert("Error", "Please fill all fields");
    }
    if (password !== confirm) {
      return Alert.alert("Error", "Passwords do not match");
    }

    try {
      setLoading(true);
      const response = await axios.post("http://10.142.20.242:3000/auth/signup", {
        name,
        email,
        password,
      });

      Alert.alert("Signed up!", "Redirecting to login...");
      router.replace("/login");
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Something went wrong";
      Alert.alert("Signup Failed", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Sign Up
      </Text>

      <AuthInput label="Name" value={name} onChangeText={setName} />
      <AuthInput label="Email" value={email} onChangeText={setEmail} />
      <AuthInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <AuthInput
        label="Confirm Password"
        value={confirm}
        onChangeText={setConfirm}
        secureTextEntry
      />

      <TouchableOpacity
        style={{
          backgroundColor: "#28a745",
          padding: 12,
          borderRadius: 8,
          marginTop: 12,
        }}
        onPress={handleSignup}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: "#fff", textAlign: "center" }}>Sign Up</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.replace("/login")}
        style={{ marginTop: 16 }}
      >
        <Text style={{ color: "#007bff", textAlign: "center" }}>
          Back to Login
        </Text>
      </TouchableOpacity>
    </View>
  );
}
