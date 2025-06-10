import { useRouter } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import api from "@/utils/api";
import { Snackbar, Provider as PaperProvider } from "react-native-paper";
import { useAuth } from "@/context/AuthContext";

export default function ChangePasswordScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [loading, setLoading] = useState(false);
  const { accessToken, userData: user } = useAuth();

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const isValid = oldPass && newPass && confirmPass && newPass === confirmPass;

  const handleChangePassword = async () => {
    if (!user?.id || !isValid) return;
    try {
      setLoading(true);
      const response = await api.post("/auth/change-password", {
        oldPassword: oldPass,
        newPassword: newPass,
      });

      if (response.status === 201) {
        setSnackbarVisible(true);
        setTimeout(() => router.back(), 2000);
      } else {
        setErrorMsg("Failed to update password");
        setModalVisible(true);
      }
    } catch (error: any) {
      setErrorMsg(error?.response?.data?.message || "Something went wrong.");
      setModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PaperProvider>
      <KeyboardAvoidingView
        style={[
          styles.container,
          { backgroundColor: isDark ? "black" : "#f9fafb" },
        ]}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={isDark ? "white" : "black"}
          />
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={[styles.title, { color: isDark ? "white" : "black" }]}>
            Change Password
          </Text>

          {[oldPass, newPass, confirmPass].map((_, idx) => (
            <TextInput
              key={idx}
              style={[
                styles.input,
                {
                  backgroundColor: isDark ? "#1e293b" : "#e5e7eb",
                  color: isDark ? "white" : "black",
                },
              ]}
              placeholder={
                idx === 0
                  ? "Old Password"
                  : idx === 1
                  ? "New Password"
                  : "Confirm New Password"
              }
              placeholderTextColor={isDark ? "#94a3b8" : "#6b7280"}
              secureTextEntry
              value={idx === 0 ? oldPass : idx === 1 ? newPass : confirmPass}
              onChangeText={
                idx === 0 ? setOldPass : idx === 1 ? setNewPass : setConfirmPass
              }
            />
          ))}

          <TouchableOpacity
            disabled={!isValid || loading}
            onPress={handleChangePassword}
            style={[
              styles.okButton,
              {
                backgroundColor: isValid ? "#10b981" : "#9ca3af",
              },
            ]}
          >
            <Text style={{ color: "white", fontWeight: "600" }}>
              {loading ? "Updating..." : "OK"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Snackbar */}
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={2000}
          style={{
            backgroundColor: isDark ? "#10b981" : "#34d399",
          }}
        >
          Password updated successfully!
        </Snackbar>

        {/* Modal Dialog */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.modalContent,
                {
                  backgroundColor: isDark ? "#1e293b" : "white",
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: isDark ? "white" : "black",
                  marginBottom: 10,
                }}
              >
                Error
              </Text>
              <Text
                style={{
                  color: isDark ? "#cbd5e1" : "#1f2937",
                  textAlign: "center",
                }}
              >
                {errorMsg}
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={[styles.okButton2, { marginTop: 20 }]}
              >
                <Text style={{ color: "white", fontWeight: "600" }}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 1,
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 80,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 30,
  },
  input: {
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    marginBottom: 14,
  },
  okButton: {
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    backgroundColor: "black",
  },
  okButton2: {
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    backgroundColor: "black",
    width: 120,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    elevation: 10,
  },
});
