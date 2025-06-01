import { StyleSheet } from "react-native";

const indexStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: isDark ? "black" : "#fdfdfd",
    },

    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    piechart: {
      alignItems: "center",
      marginTop: 20,
      backgroundColor: isDark ? "#1e293b" : "#f0f4ff",
      borderWidth: 1,
      borderColor: isDark ? "#334155" : "#eee",
      borderRadius: 13,
      elevation: 3,
    },

    fabInsideModal: {
      position: "absolute",
      bottom: 20,
      right: 20,
      backgroundColor: isDark ? "#38bdf8" : "#007bff",
      borderRadius: 30,
      width: 60,
      height: 60,
      justifyContent: "center",
      alignItems: "center",
      elevation: 4,
      shadowColor: "#000",
      shadowOpacity: 0.2,
      shadowRadius: 5,
    },

    title: {
      fontSize: 22,
      fontWeight: "600",
      color: isDark ? "#f8fafc" : "#333",
    },

    dropdown: {
      position: "absolute",
      top: 50,
      right: 0,
      backgroundColor: isDark ? "#1e293b" : "#fff",
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 10,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 5,
      zIndex: 10,
    },

    dropdownItem: {
      paddingVertical: 8,
    },

    dropdownText: {
      fontSize: 16,
      color: isDark ? "#e2e8f0" : "#333",
    },

    divider: {
      height: 1,
      backgroundColor: isDark ? "#334155" : "#ccc",
      marginVertical: 8,
    },

    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 12,
      color: isDark ? "#cbd5e1" : "#444",
    },

    userSummaryContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      height: 70,
      paddingHorizontal: 15,
      backgroundColor: isDark ? "#000000" : "#f0f4ff",
      borderWidth: 1,
      borderColor: isDark ? "#334155" : "#eee",
      borderRadius: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 6,
      elevation: 3,
      marginTop: 20,
    },

    totalSpentLabel: {
      fontSize: 15,
      color: isDark ? "#cbd5e1" : "black",
    },

    totalSpentAmount: {
      fontSize: 28,
      fontWeight: "900",
      color: "#00bcd4",
    },

    noexpense: {
      fontSize: 18,
      fontWeight: "500",
      color: "#444",
      textAlign: "center",
    },

    tryadd: {
      fontSize: 14,
      color: "#888",
      marginTop: 6,
      textAlign: "center",
    },

    noexpview: {
      justifyContent: "center",
      alignItems: "center",
      marginVertical: 40,
      padding: 20,
      backgroundColor: "#fff",
      borderRadius: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },

    ok: {
      color: "#fff",
      textAlign: "center",
      fontWeight: "600",
    },

    categoryCard: {
      backgroundColor: isDark ? "#000000" : "#f0f4ff",
      borderColor: isDark ? "#000000" : "#eee",
      padding: 16,
      borderWidth: 1,
      borderRadius: 12,
      marginTop: 30,
      height: "50%",
      elevation: 2,
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 3,
    },

    categoryRow: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 6,
    },

    categoryName: {
      fontSize: 16,
      flex: 1,
      color: isDark ? "#f1f5f9" : "#333",
    },

    categoryAmount: {
      fontSize: 16,
      fontWeight: "bold",
      color: isDark ? "#e0f2fe" : "#333",
    },

    fab: {
      position: "absolute",
      bottom: 30,
      right: 20,
      backgroundColor: isDark ? "#38bdf8" : "#007bff",
      borderRadius: 30,
      width: 60,
      height: 60,
      justifyContent: "center",
      alignItems: "center",
      elevation: 4,
      shadowColor: "#000",
      shadowOpacity: 0.2,
      shadowRadius: 5,
    },

    fab2: {
      position: "absolute",
      bottom: 100,
      right: 20,
      backgroundColor: isDark ? "#6366f1" : "#000bff",
      borderRadius: 30,
      width: 60,
      height: 60,
      justifyContent: "center",
      alignItems: "center",
      elevation: 4,
      shadowColor: "#000",
      shadowOpacity: 0.2,
      shadowRadius: 5,
    },

    inputLabel: {
      fontSize: 16,
      marginTop: 12,
      fontWeight: "600",
      color: isDark ? "#e2e8f0" : "#444",
    },

    dropdownWrapper: {
      borderBottomWidth: 1,
      borderColor: isDark ? "#475569" : "#ccc",
      marginBottom: 12,
      overflow: "scroll",
    },

    input: {
      borderWidth: 1,
      borderColor: isDark ? "#475569" : "#ccc",
      borderRadius: 8,
      height: 50,
      paddingHorizontal: 10,
      marginBottom: 12,
      color: isDark ? "white" : "black",
    },

    dateInputWrapper: {
      borderWidth: 1,
      borderColor: isDark ? "#475569" : "#ccc",
      borderRadius: 8,
      height: 50,
      justifyContent: "center",
      paddingHorizontal: 10,
    },

    dateInput: {
      fontSize: 16,
      color: isDark ? "#f1f5f9" : "#444",
    },

    addBtn: {
      marginTop: 20,
      paddingVertical: 12,
      borderRadius: 8,
      backgroundColor: isDark ? "#2563eb" : "#007bff",
    },

    progressBarOut: {
      height: 8,
      backgroundColor: isDark ? "#334155" : "#eee",
      borderRadius: 5,
      marginTop: 10,
      overflow: "hidden",
    },

    cat_top_row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    history: {
      padding: 7,
      textDecorationLine: "underline",
      color: isDark ? "#facc15" : "#1e40af",
    },
  });

export default indexStyles;
