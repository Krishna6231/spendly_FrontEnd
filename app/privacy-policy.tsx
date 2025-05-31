import React from "react";
import { View, ScrollView, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/theme/ThemeContext";
import { useRouter } from "expo-router";

const PrivacyPolicy = () => {
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
        <Text style={{ fontSize: 18, color: colors.text, marginLeft: 8 }}>Privacy Policy</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", color: colors.text, marginBottom: 16 }}>
          Privacy Policy
        </Text>
        <Text style={{ fontSize: 16, lineHeight: 24, color: colors.secondary, marginBottom: 12 }}>
          MoneyNut values your privacy. This policy outlines how we collect, use, and protect your
          information.
        </Text>
        <Text style={{ fontSize: 18, fontWeight: "600", color: colors.text, marginBottom: 8 }}>
          1. Data Collection
        </Text>
        <Text style={{ fontSize: 16, color: colors.secondary, marginBottom: 12 }}>
          We collect your name, email, and expense data to provide personalized analytics and store
          data securely.
        </Text>
        <Text style={{ fontSize: 18, fontWeight: "600", color: colors.text, marginBottom: 8 }}>
          2. Usage of Information
        </Text>
        <Text style={{ fontSize: 16, color: colors.secondary, marginBottom: 12 }}>
          Your data helps us deliver a better experience, provide insights, and enhance features.
        </Text>
        <Text style={{ fontSize: 18, fontWeight: "600", color: colors.text, marginBottom: 8 }}>
          3. Data Protection
        </Text>
        <Text style={{ fontSize: 16, color: colors.secondary, marginBottom: 12 }}>
          All data is stored securely. We do not share or sell your information to third parties.
        </Text>
        <Text style={{ fontSize: 18, fontWeight: "600", color: colors.text, marginBottom: 8 }}>
          4. User Control
        </Text>
        <Text style={{ fontSize: 16, color: colors.secondary }}>
          You may request deletion of your data or update it via the Edit Profile section.
        </Text>
      </ScrollView>
    </View>
  );
};

export default PrivacyPolicy;