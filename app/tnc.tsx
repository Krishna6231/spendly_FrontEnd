import React from "react";
import { View, ScrollView, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/theme/ThemeContext";
import { useRouter } from "expo-router";

const TermsAndConditions = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const router = useRouter();

  const colors = {
    background: isDark ? "black" : "#ffffff",
    text: isDark ? "#f3f4f6" : "#1f2937",
    secondary: isDark ? "#9ca3af" : "#4b5563",
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <TouchableOpacity
        onPress={() => router.back()}
        style={{ padding: 16, flexDirection: "row", alignItems: "center" }}
      >
        <Ionicons name="arrow-back" size={24} color={colors.text} />
        <Text style={{ fontSize: 18, color: colors.text, marginLeft: 8 }}>Terms & Conditions</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", color: colors.text, marginBottom: 16 }}>
          Terms and Conditions
        </Text>
        <Text style={{ fontSize: 16, lineHeight: 24, color: colors.secondary, marginBottom: 12 }}>
          By using Spendly, you agree to the following terms and conditions:
        </Text>
        <Text style={{ fontSize: 18, fontWeight: "600", color: colors.text, marginBottom: 8 }}>
          1. Usage
        </Text>
        <Text style={{ fontSize: 16, color: colors.secondary, marginBottom: 12 }}>
          The app is intended for personal finance tracking. You are responsible for maintaining the
          confidentiality of your account.
        </Text>
        <Text style={{ fontSize: 18, fontWeight: "600", color: colors.text, marginBottom: 8 }}>
          2. Restrictions
        </Text>
        <Text style={{ fontSize: 16, color: colors.secondary, marginBottom: 12 }}>
          You may not misuse the app, reverse engineer it, or attempt unauthorized access to the
          backend.
        </Text>
        <Text style={{ fontSize: 18, fontWeight: "600", color: colors.text, marginBottom: 8 }}>
          3. Liability
        </Text>
        <Text style={{ fontSize: 16, color: colors.secondary, marginBottom: 12 }}>
          Spendly is provided “as is.” We are not liable for any financial losses or miscalculations
          based on data input by users.
        </Text>
        <Text style={{ fontSize: 18, fontWeight: "600", color: colors.text, marginBottom: 8 }}>
          4. Termination
        </Text>
        <Text style={{ fontSize: 16, color: colors.secondary }}>
          We reserve the right to terminate or suspend accounts violating these terms.
        </Text>
      </ScrollView>
    </View>
  );
};

export default TermsAndConditions;