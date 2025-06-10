import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

const categoryStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 2,
      backgroundColor: isDark ? "black" : "#fdfdfd",
    },

    fab: {
      zIndex: 10,
      position: "absolute",
      right: 20,
      bottom: 20,
      backgroundColor: isDark ? "#1f2937" : "#4B5563",
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: "center",
      alignItems: "center",
      elevation: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },

    heading: {
      paddingHorizontal: 16,
      paddingTop: 16,
    },

    title: {
      fontSize: 20,
      fontWeight: "bold",
      marginTop: 5,
      marginBottom: 15,
      color: isDark ? "#f1f5f9" : "#333",
      textAlign: "center",
    },

    backButton: {
      position: "absolute",
      top: 24,
      left: 20,
      zIndex: 1,
      padding: 0,
    },

    tabRow: {
      flexDirection: "row",
      justifyContent: "space-around",
      borderBottomWidth: 1,
      borderColor: isDark ? "#1f2937" : "#e5e7eb",
      position: "relative",
    },

    tabButton: {
      flex: 1,
      alignItems: "center",
      paddingVertical: 12,
    },

    tabText: {
      color: isDark ? "#9ca3af" : "#6b7280",
      fontWeight: "600",
    },

    activeTabText: {
      color: isDark ? "#f3f4f6" : "#111827",
    },

    underline: {
      position: "absolute",
      bottom: 0,
      height: 3,
      width: width / 3,
      backgroundColor: isDark ? "#f3f4f6" : "#4b5563",
      borderRadius: 2,
    },

    card: {
      backgroundColor: isDark ? "#111111" : "#ffffff",
      borderRadius: 16,
      paddingVertical: 14,
      paddingHorizontal: 16,
      marginBottom: 14,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 3,
    },

    textContainer: {
      flexDirection: "row",
      alignItems: "center",
    },

    name: {
      fontSize: 16,
      fontWeight: "600",
      color: isDark ? "#e5e7eb" : "#111827",
    },

    limit: {
      fontSize: 13,
      marginTop: 4,
      color: isDark ? "#9ca3af" : "#6b7280",
    },

    editIconContainer: {
      justifyContent: "center",
      alignItems: "center",
      padding: 6,
      borderRadius: 8,
    },

    colorIndicator: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: 12,
      marginTop: 4,
      borderWidth: 1.5,
      borderColor: isDark ? "#374151" : "#d1d5db",
    },

    screen: {
      width,
      padding: 16,
    },

    emptyText: {
      textAlign: "center",
      fontSize: 16,
      color: isDark ? "#6b7280" : "#9ca3af",
      marginTop: 24,
      fontStyle: "italic",
    },

    subscriptionItem: {
      backgroundColor: isDark ? "#111111" : "#ffffff",
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderRadius: 16,
      marginBottom: 14,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      elevation: 3,
    },

    subName: {
      fontSize: 16,
      fontWeight: "600",
      color: isDark ? "#e5e7eb" : "#111827",
    },

    subDetails: {
      fontSize: 13,
      marginTop: 4,
      color: isDark ? "#9ca3af" : "#6b7280",
    },

    iconRow: {
      flexDirection: "row",
      alignItems: "center",
    },

    loanItem: {
      backgroundColor: isDark ? "#111111" : "#ffffff",
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderRadius: 16,
      marginBottom: 14,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      elevation: 3,
    },

    loanName: {
      fontSize: 16,
      fontWeight: "600",
      color: isDark ? "#e5e7eb" : "#111827",
    },

    loanDetails: {
      fontSize: 13,
      marginTop: 4,
      color: isDark ? "#9ca3af" : "#6b7280",
    },

    italicLabel: {
      fontStyle: "italic",
      color: isDark ? "#6b7280" : "#6b7280",
    },

    modalOverlay: {
      flex: 1,
      backgroundColor: isDark
        ? "rgba(256, 256, 256, 0.2)"
        : "rgba(0, 0, 0, 0.4)",
      justifyContent: "center",
      alignItems: "center",
    },

    modalContent: {
      width: "85%",
      backgroundColor: isDark ? "#111111" : "#fff",
      padding: 20,
      borderRadius: 20,
      elevation: 10,
    },

    modalTitle: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 12,
      color: isDark ? "#f1f5f9" : "#333",
      textAlign: "center",
    },

    modalSubTitle: {
      marginTop: 14,
      marginBottom: 6,
      fontSize: 14,
      fontWeight: "600",
      color: isDark ? "#cbd5e1" : "#555",
    },

    modalSubTitle2: {
      fontSize: 13,
      color: isDark ? "#94a3b8" : "#777",
      marginBottom: 6,
    },

    input: {
      borderWidth: 1,
      borderColor: isDark ? "#334155" : "#ccc",
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 10,
      fontSize: 16,
      marginVertical: 8,
      backgroundColor: isDark ? "#1e1e1e" : "#f9f9f9",
      color: isDark ? "#f1f5f9" : "#000",
    },

    colorGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      marginVertical: 10,
    },

    colorCircle: {
      width: 30,
      height: 30,
      borderRadius: 15,
      margin: 6,
    },

    colorBar: {
      width: 40,
      height: 15,
      borderRadius: 6,
      marginTop: -3,
      marginLeft: 8,
      borderWidth: 1,
      borderColor: isDark ? "#475569" : "#ccc",
    },

    sc: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 12,
    },

    okBtn: {
      marginTop: 20,
      backgroundColor: isDark ? "#1e293b" : "#007bff",
      paddingVertical: 12,
      borderRadius: 10,
      alignItems: "center",
    },

    okBtnText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
    },

    delcat: {
      marginTop: 14,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isDark ? "#2c0a0a" : "#fff0f0",
      borderWidth: 1,
      borderColor: "red",
      paddingVertical: 10,
      borderRadius: 10,
    },

    delcatText: {
      color: "red",
      fontWeight: "600",
    },

    modalContent2: {
      width: "90%",
      backgroundColor: isDark ? "#111111" : "#fff",
      padding: 20,
      borderRadius: 20,
      elevation: 10,
    },

    dateGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: 7,
      marginBottom: 20,
    },

    dateCircle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: isDark ? "#1f2937" : "#e5e7eb",
      justifyContent: "center",
      alignItems: "center",
    },

    selectedDateCircle: {
      backgroundColor: isDark ? "#f3f4f6" : "#007bff",
    },

    dateText: {
      color: isDark ? "#f1f5f9" : "#111827",
      fontWeight: "600",
    },

    selectedDateText: {
      color: isDark ? "#000" : "#fff",
    },
  });

export default categoryStyles;
