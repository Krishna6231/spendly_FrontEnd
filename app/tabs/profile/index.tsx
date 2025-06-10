import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Animated,
} from "react-native";
import { profileStyles } from "@/styles/profile.styles";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "@/utils/api";

const Profile = () => {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const styles = profileStyles(isDark);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const { logout, userData: user } = useAuth();

  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: isDark ? 1 : 0,
      useNativeDriver: false,
      stiffness: 100,
      damping: 13,
      mass: 1,
    }).start();
  }, [isDark]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 39],
  });

 const handleLogout = async () => {
  try {
    const refreshToken = await AsyncStorage.getItem("refreshToken");

    if (refreshToken) {
      await api.post("/auth/logout", { refreshToken });
    }

    await logout();
    router.replace("/landing");
  } catch (error) {
    console.error("Error during logout:", error);
    Alert.alert("Logout Error", "Something went wrong while logging out.");
  }
};

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons
          name="arrow-back"
          size={24}
          color={isDark ? "white" : "#4b5563"}
        />
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* User Info Section */}
        <View style={styles.userInfoSection}>
          <Image
            source={{ uri: "https://via.placeholder.com/100" }}
            style={styles.profileImage}
          />
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <TouchableOpacity
            style={styles.row}
            onPress={() => router.push("/tabs/profile/edit-profile")}
          >
            <Feather
              name="user"
              size={20}
              color={isDark ? "white" : "#4b5563"}
            />
            <Text style={styles.rowText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* App Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          <TouchableOpacity style={styles.row}>
            <Feather
              name="list"
              size={20}
              color={isDark ? "white" : "#4b5563"}
            />
            <Text style={styles.rowText}>Manage Categories</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.row}>
            <Feather
              name="dollar-sign"
              size={20}
              color={isDark ? "white" : "#4b5563"}
            />
            <Text style={styles.rowText}>Currency: ₹</Text>
          </TouchableOpacity>
          <View style={styles.rowBetween}>
            <View style={styles.row}>
              <Feather
                name="sun"
                size={20}
                color={isDark ? "white" : "#4b5563"}
              />
              <Text style={styles.rowText}>Theme</Text>
            </View>

            <TouchableOpacity
              style={[
                styles.toggleOuter,
                { backgroundColor: isDark ? "#1f2937" : "#e5e7eb" },
              ]}
              activeOpacity={0.8}
              onPress={toggleTheme}
            >
              {/* Sliding Thumb */}
              <Animated.View
                style={[
                  styles.toggleThumb,
                  {
                    transform: [{ translateX }],
                    shadowColor: isDark ? "#fff" : "#000",
                  },
                ]}
              >
                {isDark ? (
                  <Feather name="moon" size={14} color="#1f2937" />
                ) : (
                  <Feather name="sun" size={14} color="#f59e0b" />
                )}
              </Animated.View>

              {/* Texts */}
              <View style={styles.toggleTextWrapper}>
                <Text
                  style={[
                    styles.toggleText,
                    {
                      color: isDark ? "#9ca3af" : "#111827",
                      textAlign: isDark ? "left" : "right",
                      paddingLeft: isDark ? 10 : 0,
                      paddingRight: isDark ? 0 : 10,
                    },
                  ]}
                >
                  {isDark ? "Dark" : "Light"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <TouchableOpacity style={styles.row}>
            <Feather
              name="bell"
              size={20}
              color={isDark ? "white" : "#4b5563"}
            />
            <Text style={styles.rowText}>Spending Alerts</Text>
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <TouchableOpacity
            style={styles.row}
            onPress={() => router.push("/tabs/profile/privacy-policy")}
          >
            <Feather
              name="lock"
              size={20}
              color={isDark ? "white" : "#4b5563"}
            />
            <Text style={styles.rowText}>Privacy Policy</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.row}
            onPress={() => router.push("/tabs/profile/tnc")}
          >
            <Feather
              name="file-text"
              size={20}
              color={isDark ? "white" : "#4b5563"}
            />
            <Text style={styles.rowText}>Terms and Conditions</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.row}>
            <Feather
              name="info"
              size={20}
              color={isDark ? "white" : "#4b5563"}
            />
            <Text style={styles.rowText}>Version 1.0.0</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.row} onPress={handleLogout}>
            <Feather name="log-out" size={22} color="#ef4444" />
            <Text style={styles.logoutText}> Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default Profile;
