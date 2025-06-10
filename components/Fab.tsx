import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

interface FabProps {
  onAddExpense: () => void;
}

const Fab: React.FC<FabProps> = ({ onAddExpense }) => {
  return (
    <View style={styles.container}>
      <Pressable
        style={styles.fab}
        onPress={() => onAddExpense()}
        android_ripple={{ color: "transparent" }}
        android_disableSound={true}
      >
        <Icon name={"add"} size={30} color="#fff" />
      </Pressable>
    </View>
  );
};

export default Fab;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 25,
    right: 25,
    alignItems: "flex-end",
    pointerEvents: "box-none",
  },
  fab: {
    zIndex: 10,
    position: "absolute",
    right: -5,
    bottom: -5,
    backgroundColor: "#8e24aa",
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
});
