import { StyleSheet } from "react-native";

const RingStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 10,
    },
    loadingContainer: {
      height: 300,
      justifyContent: "center",
    },
    chartContainer: {
      position: "relative",
    },
    categoryScrollContainer: {
      marginTop: 5,
      paddingHorizontal: 10,
      justifyContent: "center",
    },
    categoryItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "flex-start",
      borderRadius: 10,
      backgroundColor: isDark ? "#1d1d1d" : "#f0f0f0",
      marginHorizontal: 5,
      paddingHorizontal: 12,
      paddingVertical: 4,
    },
    activeItem: {
      borderWidth: 1,
      borderColor: "#00bcd4",
      backgroundColor: isDark ? "#1d1d1d" : "#e0f7fa",
    },
    squareColor: {
      width: 12,
      height: 12,
      borderRadius: 4,
      marginRight: 8,
    },
    label: {
      fontSize: 12,
      fontWeight: "600",
      color: isDark ? "white" : "black",
    },
  });

export default RingStyles;
