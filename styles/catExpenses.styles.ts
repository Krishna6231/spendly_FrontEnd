import { StyleSheet } from "react-native";

const catExpensesStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      padding: 16,
      flex: 1,
      backgroundColor: isDark ? "black" : "#f9f9f9",
    },
    backButton: {
      position: "absolute",
      top: 16,
      left: 16,
      zIndex: 1,
      padding: 8,
    },
    downloadButton: {
      position: "absolute",
      top: 16,
      right: 16,
      zIndex: 1,
      padding: 8,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      marginTop: 5,
      marginBottom: 15,
      color: isDark ? "#f8fafc" : "#333",
      textAlign: "center",
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: isDark ? "#cbd5e1" : "#555",
      marginTop: 20,
      marginBottom: 8,
    },
    separator: {
      height: 1,
      backgroundColor: isDark ? "#334155" : "#ddd",
      marginBottom: 12,
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
    },
    amountText: {
      fontSize: 18,
      fontWeight: "600",
      color: "#4CAF50", // keeping green for clarity
    },
    dateText: {
      fontSize: 14,
      color: isDark ? "#94a3b8" : "#888",
      marginTop: 4,
    },
    noteText: {
      marginTop: 6,
      fontSize: 14,
      fontStyle: "italic",
      color: isDark ? "#cbd5e1" : "#4b5563",
    },
    noExpensesText: {
      fontSize: 16,
      color: isDark ? "#94a3b8" : "#999",
      textAlign: "center",
      marginTop: 20,
    },
  });

export default catExpensesStyles;
