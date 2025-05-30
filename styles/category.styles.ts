import { StyleSheet } from "react-native";

const categoryStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? "black" : "#f9fafb",
      padding: 16,
    },
    backButton: {
      position: "absolute",
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
    card: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: isDark ? "#1e293b" : "#f2f2f2",
      padding: 10,
      borderRadius: 12,
      marginBottom: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    name: {
      fontSize: 16,
      fontWeight: "600",
      color: isDark ? "#f1f5f9" : "#222",
    },
    limit: {
      fontSize: 14,
      color: isDark ? "#94a3b8" : "#666",
      marginTop: 4,
    },
    editIconContainer: {
      justifyContent: "center",
      alignItems: "center",
      height: 40,
      width: 40,
    },
    addBtn: {
      backgroundColor: "#007bff",
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 30,
      alignSelf: "center",
      marginTop: 20,
    },
    addBtnText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.3)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      backgroundColor: isDark ? "#1f2937" : "#fff",
      padding: 20,
      borderRadius: 12,
      width: "80%",
      elevation: 5,
    },
    modalContent2: {
      backgroundColor: isDark ? "#1f2937" : "#fff",
      padding: 20,
      borderRadius: 12,
      width: "90%",
      elevation: 5,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 12,
      textAlign: "center",
      color: isDark ? "#f8fafc" : "#111827",
    },
    modalSubTitle2: {
      fontSize: 16,
      fontWeight: "600",
      marginVertical: "auto",
      color: isDark ? "#e2e8f0" : "#374151",
    },
    sc: {
      flexDirection: "row",
      marginVertical: 10,
    },
    colorBar: {
      marginHorizontal: "auto",
      width: "50%",
      height: 35,
      borderRadius: 10,
    },
    input: {
      borderWidth: 1,
      borderColor: isDark ? "#475569" : "#ccc",
      borderRadius: 8,
      padding: 10,
      marginBottom: 12,
      fontSize: 16,
      color: isDark ? "#f8fafc" : "#111827",
      backgroundColor: isDark ? "#334155" : "#fff",
    },
    okBtn: {
      backgroundColor: "#28a745",
      paddingVertical: 10,
      borderRadius: 8,
      alignItems: "center",
    },
    okBtnText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
    },
    modalSubTitle: {
      fontSize: 16,
      fontWeight: "600",
      marginTop: 16,
      marginBottom: 8,
      color: isDark ? "#e2e8f0" : "#374151",
    },
    colorGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
      justifyContent: "center",
      marginBottom: 20,
    },
    colorCircle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderColor: isDark ? "#f1f5f9" : "black",
    },
    colorIndicator: {
      width: 16,
      height: 16,
      borderRadius: 8,
      marginRight: 10,
      marginTop: 5,
    },
    textContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    editColorPreviewContainer: {
      alignItems: "center",
      marginVertical: 10,
    },
    colorPreviewCircle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: isDark ? "#475569" : "#ccc",
    },
    delcat: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 20,
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "red",
      alignSelf: "center",
      backgroundColor: "#fff0f0",
    },

    delcatText: {
      color: "red",
      fontSize: 16,
      fontWeight: "600",
    },
    bottom_buttons: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-evenly",
    },
    partition: {
      height: 1,
      backgroundColor: isDark ? "#444" : "#ccc",
      marginVertical: 12,
    },

    toggleRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 12,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: isDark ? "#fff" : "#000",
    },

    subscriptionContainer: {
      overflow: "hidden",
      paddingHorizontal: 16,
    },
    subscriptionItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? "#333" : "#eee",
    },
    subName: {
      fontSize: 16,
      fontWeight: "500",
      color: isDark ? "#fff" : "#000",
    },

    subDetails: {
      fontSize: 14,
      color: isDark ? "#aaa" : "#666",
      marginTop: 2,
    },

    iconRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    emptyText: {
      textAlign: "center",
      color: isDark ? "#999" : "#777",
      fontStyle: "italic",
      paddingVertical: 20,
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
      backgroundColor: "#e5e7eb",
      justifyContent: "center",
      alignItems: "center",
    },

    selectedDateCircle: {
      backgroundColor: "#007bff",
    },

    dateText: {
      color: "#111827",
      fontWeight: "600",
    },

    selectedDateText: {
      color: "#fff",
    },
  });

export default categoryStyles;