import { StyleSheet } from "react-native";

const allExpensesStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? "black" : "#f9f9f9",
    },
    heading: {
      paddingHorizontal: 16,
      paddingTop: 16,
    },
    backButton: {
      position: "absolute",
      top: 24,
      left: 20,
      zIndex: 1,
      padding: 0,
    },
    downloadButton: {
      position: "absolute",
      top: 24,
      right: 20,
      zIndex: 1,
      padding: 0,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      marginTop: 5,
      marginBottom: 15,
      color: isDark ? "#f8fafc" : "#333",
      textAlign: "center",
    },

    expenseItemContainer: {
      position: "relative",
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? "#2E2E2E" : "#E0E0E0",
      backgroundColor: isDark ? "#0F0F0F" : "#FFFFFF",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    expenseContent: {
      flex: 1,
    },

    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 4,
    },

    amount: {
      fontSize: 16,
      fontWeight: "600",
      color: isDark ? "#A7F3D0" : "#059669", // teal
    },

    date: {
      fontSize: 12,
      color: isDark ? "#9CA3AF" : "#6B7280", // subtle gray
    },

    category: {
      fontSize: 14,
      fontWeight: "500",
      color: isDark ? "#D1D5DB" : "#374151", // primary text
    },

    note: {
      fontSize: 12,
      color: isDark ? "#94A3B8" : "#6B7280",
      textAlign: "right",
    },

    deleteButton: {
      position: "absolute",
      right: 12,
      top: "50%",
      transform: [{ translateY: -14 }],
      backgroundColor: "#EF4444",
      borderRadius: 24,
      padding: 8,
      elevation: 2,
    },

    deleteTouchable: {
      justifyContent: "center",
      alignItems: "center",
    },

    expenseCard: {
      backgroundColor: isDark ? "#1e293b" : "#fff",
      padding: 15,
      marginVertical: 8,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDark ? "#334155" : "#eee",
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 5,
      elevation: 2,
      position: "relative",
    },
    expenseRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    amountText: {
      fontSize: 18,
      fontWeight: "600",
      color: "#4CAF50",
    },
    categoryText: {
      fontSize: 16,
      color: isDark ? "#94a3b8" : "#888",
    },
    dateText: {
      fontSize: 14,
      color: isDark ? "#94a3b8" : "#888",
      marginTop: 4,
    },
    noExpensesText: {
      fontSize: 16,
      color: isDark ? "#94a3b8" : "#999",
      textAlign: "center",
      marginTop: 20,
    },
    noteText: {
      marginTop: 6,
      fontSize: 14,
      fontStyle: "italic",
      color: isDark ? "#cbd5e1" : "#4b5563",
    },
    hiscatsel: {
      paddingHorizontal: 16,
      paddingVertical: 6,
      borderRadius: 20,
      marginRight: 10,
    },
    sectionHeader: {
      backgroundColor: isDark ? "#1f2937" : "#f3f4f6",
      paddingVertical: 8,
      paddingHorizontal: 16,
      fontSize: 14,
      fontWeight: "600",
      color: isDark ? "#9ca3af" : "#4b5563",
    },
  });

export default allExpensesStyles;
