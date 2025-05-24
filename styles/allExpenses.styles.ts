import { StyleSheet } from "react-native";

const allExpensesStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: isDark ? "black" : "#f9f9f9",
  },
  backButton: {
    position: "absolute", // 'fixed' is not valid in React Native
    top: 16,
    left: 16,
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
    color: "#4CAF50", // Keep green for visual clarity
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
  deleteButton: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -20 }],
    backgroundColor: "#e53935", // Error red — keep as is
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 1, height: 2 },
    shadowRadius: 4,
  },
  deleteTouchable: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  noteText: {
  marginTop: 6,
  fontSize: 14,
  fontStyle: "italic",
  color: isDark ? "#cbd5e1" : "#4b5563",
},
});

export default allExpensesStyles;
