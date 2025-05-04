import { Dimensions, StyleSheet } from "react-native";

const analyticsStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? "#121212" : "#f8f9fa",
      padding: 16,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 60,
      marginBottom: 40,
    },
    backButton: {
      position: "absolute",
      top: 18,
      left: 18,
      zIndex: 1,
      padding: 5,
    },
    headerTitle: {
      paddingLeft: 10,
      fontSize: 24,
      fontWeight: "bold",
      color: isDark ? "#ffffff" : "#2f3542",
    },
    cardRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    card: {
      borderRadius: 16,
      padding: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    halfWidthCard: {
      width: Dimensions.get("window").width / 2 - 20,
    },
    cardPurple: {
      backgroundColor: isDark ? "#a29bfe" : "#6c5ce7",
    },
    cardRed: {
      backgroundColor: isDark ? "#fab1a0" : "#ff7675",
    },
    cardBlue: {
      backgroundColor: isDark ? "#81ecec" : "#74b9ff",
    },
    cardGreen: {
      backgroundColor: isDark ? "#55efc4" : "#00b386",
    },
    cardTitle: {
      color: "#fff",
      fontSize: 14,
      marginTop: 8,
      opacity: 0.9,
    },
    cardAmount: {
      color: "#fff",
      fontSize: 22,
      fontWeight: "bold",
      marginTop: 4,
    },
    cardSubtext: {
      color: "#fff",
      fontSize: 12,
      marginTop: 4,
      opacity: 0.8,
    },
    cardTrend: {
      position: "absolute",
      top: 12,
      right: 12,
      fontSize: 12,
      fontWeight: "bold",
    },
    chartContainer: {
      backgroundColor: isDark ? "#1e1e1e" : "#fff",
      borderRadius: 16,
      padding: 16,
      marginTop: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 12,
      color: isDark ? "#ffffff" : "#2f3542",
    },
    insightContainer: {
      marginTop: 16,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: isDark ? "#3a3a3a" : "#dfe6e9",
    },
    insightText: {
      fontSize: 14,
      color: isDark ? "#dfe6e9" : "#636e72",
      marginBottom: 8,
    },

    // New styles for the Monthly Bar Graph Section
    monthNavContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginVertical: 16,
    },
    monthNavButton: {
      padding: 8,
      backgroundColor: isDark ? "#2c3e50" : "#ecf0f1",
      borderRadius: 50,
    },
    barGraphContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    viewMoreButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isDark ? "#4b7bec" : "#2980b9",
      borderRadius: 25,
      paddingVertical: 10,
      marginTop: 20,
    },
    viewMoreText: {
      color: "#fff",
      fontSize: 16,
      marginRight: 8,
    },
    expandedContainer: {
      padding: 16,
      marginTop: 16,
      backgroundColor: isDark ? "#2c3e50" : "#ecf0f1",
      borderRadius: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
      maxHeight: 500, // Adjust based on your content
    },
    expandedCardRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    expandedCard: {
      width: Dimensions.get("window").width / 2 - 20,
      padding: 16,
      borderRadius: 16,
      backgroundColor: isDark ? "#34495e" : "#ecf0f1",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    expandedCardTitle: {
      fontSize: 14,
      color: isDark ? "#ecf0f1" : "#2c3e50",
    },
    expandedCardAmount: {
      fontSize: 22,
      color: "#fff",
      fontWeight: "bold",
      marginTop: 4,
    },
  });

export default analyticsStyles;
