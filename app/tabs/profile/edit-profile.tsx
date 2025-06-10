import { useRouter } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/api";

export default function EditProfileScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { userData: user, setUserData } = useAuth();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const [initialName, setInitialName] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      if (user) {
        try {
          setEmail(user.email || "");
          setName(user.name || "");
          setInitialName(user.name || "");
        } catch (e) {
          console.error("Error parsing userData", e);
        }
      }
    };
    loadUser();
  }, [user]);

  const hasChanges = name !== initialName;

  const updateProfile = async () => {
  if (!user) return;

  try {
    const response = await api.post("/auth/update", { name });

    if (response.status === 201) {
      const updatedUser = { ...user, name };
      setUserData(updatedUser);
      setInitialName(name);
    }

    Alert.alert("Profile updated successfully");
  } catch (error: any) {
    console.error(
      "Failed to update profile",
      error.response?.data || error.message
    );
    Alert.alert("Error", "Could not update your profile.");
  }
};

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "black" : "#f9fafb" },
      ]}
    >
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons
          name="arrow-back"
          size={24}
          color={isDark ? "white" : "black"}
        />
      </TouchableOpacity>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={[styles.title, { color: isDark ? "white" : "black" }]}>
            Edit Profile
          </Text>

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: isDark ? "#1e293b" : "#e5e7eb",
                color: isDark ? "white" : "black",
              },
            ]}
            value={email}
            editable={false}
          />

          <Text style={styles.label}>Name</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: isDark ? "#1e293b" : "#e5e7eb",
                color: isDark ? "white" : "black",
              },
            ]}
            value={name}
            onChangeText={setName}
          />

          <TouchableOpacity
            disabled={!hasChanges}
            style={[
              styles.okButton,
              {
                backgroundColor: hasChanges
                  ? isDark
                    ? "#4ade80"
                    : "#10b981"
                  : isDark
                  ? "#334155"
                  : "#d1d5db",
              },
            ]}
            onPress={updateProfile}
          >
            <Text
              style={{
                color: hasChanges ? "white" : "gray",
                fontWeight: "600",
              }}
            >
              OK
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <TouchableOpacity
        style={[
          styles.passwordButton,
          { backgroundColor: isDark ? "#334155" : "#e5e7eb" },
        ]}
        onPress={() => router.push("/tabs/profile/change-password")}
      >
        <Text style={{ color: isDark ? "white" : "black", fontWeight: "600" }}>
          Update Password
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingTop: 70, paddingBottom: 120 },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 1,
    padding: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 12,
    color: "#6b7280",
  },
  input: {
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    marginBottom: 8,
  },
  okButton: {
    marginTop: 20,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  passwordButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
});
