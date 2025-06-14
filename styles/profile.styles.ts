import { StyleSheet } from "react-native";

export const profileStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? "black" : "#f9fafb",
    },
    scrollContent: {
      marginTop: 50,
      padding: 20,
      paddingBottom: 100,
    },
    userInfoSection: {
      alignItems: "center",
      marginBottom: 30,
    },
    rowBetween: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    toggleOuter: {
      width: 72.5,
      height: 34,
      borderRadius: 20,
      padding: 2,
      flexDirection: "row",
      alignItems: "center",
      position: "relative",
      backgroundColor: isDark ? "black" : "#e5e7eb",
    },
    toggleThumb: {
      width: 28,
      height: 28,
      borderRadius: 18,
      backgroundColor: isDark ? "#f1f5f9" : "#f9fafb",
      justifyContent: "center",
      alignItems: "center",
      position: "absolute",
      top: 3,
      left: 2,
      zIndex: 2,
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    toggleTextWrapper: {
      flex: 1,
      justifyContent: "center",
    },
    toggleText: {
      fontSize: 11,
      fontWeight: "600",
      color: isDark ? "#cbd5e1" : "#1f2937",
    },
    toggleContainer: {
      width: 50,
      height: 28,
      borderRadius: 14,
      justifyContent: "center",
      alignItems: "center",
    },
    profileImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 10,
      backgroundColor: isDark ? "#334155" : "#e5e7eb",
    },
    userName: {
      fontSize: 20,
      fontWeight: "bold",
      color: isDark ? "#f8fafc" : "#111827",
    },
    userEmail: {
      fontSize: 14,
      color: isDark ? "#94a3b8" : "#6b7280",
    },
    section: {
      marginBottom: 30,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: isDark ? "#e2e8f0" : "#374151",
      marginBottom: 10,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
    },
    rowText: {
      marginLeft: 15,
      fontSize: 15,
      color: isDark ? "#cbd5e1" : "#4b5563",
    },
    logoutButton: {
      position: "absolute",
      bottom: 20,
      alignSelf: "center",
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: "#ef4444",
      borderRadius: 999,
      backgroundColor: isDark ? "#1e293b" : "#fff",
    },
    logoutText: {
      marginLeft: 8,
      fontSize: 18,
      color: "#ef4444",
      fontWeight: "bold",
    },
    backButton: {
      position: "absolute",
      top: 16,
      left: 16,
      zIndex: 1,
      padding: 8,
    },
  });
