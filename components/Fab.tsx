import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Easing } from "react-native-reanimated";

interface FabProps {
  onAddExpense: () => void;
  onAddCategory: () => void;
  goToSettings: () => void;
}

const Fab: React.FC<FabProps> = ({
  onAddExpense,
  onAddCategory,
  goToSettings,
}) => {
  const [expanded, setExpanded] = useState(false);
  const offset = useSharedValue(0);

  const toggleFab = (nextExpanded?: boolean) => {
    const shouldExpand =
      typeof nextExpanded === "boolean" ? nextExpanded : !expanded;
    setExpanded(shouldExpand);
    offset.value = withTiming(shouldExpand ? 1 : 0, {
      duration: 200,
      easing: Easing.out(Easing.ease),
    });
  };

  const handleAction = (callback: () => void) => {
    callback();
    setTimeout(() => {
      toggleFab(false); 
    }, 200);
  };

  const animatedStyle1 = useAnimatedStyle(() => ({
    transform: [{ translateY: -offset.value * 55 }],
    opacity: offset.value,
  }));

  const animatedStyle2 = useAnimatedStyle(() => ({
    transform: [{ translateY: -offset.value * 110 }],
    opacity: offset.value,
  }));

  const animatedStyle3 = useAnimatedStyle(() => ({
    transform: [{ translateY: -offset.value * 165 }],
    opacity: offset.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.actionButtonContainer, animatedStyle3]}>
        <Pressable
          style={styles.fabItem}
          onPress={() => handleAction(goToSettings)}
          android_ripple={{ color: "transparent" }}
        >
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Analytics</Text>
          </View>
          <View style={styles.circleIcon}>
            <Icon name="analytics" size={20} color="#fff" />
          </View>
        </Pressable>
      </Animated.View>

      <Animated.View style={[styles.actionButtonContainer, animatedStyle2]}>
        <Pressable
          style={styles.fabItem}
          onPress={() => handleAction(onAddCategory)}
          android_ripple={{ color: "transparent" }}
        >
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Add Category</Text>
          </View>
          <View style={styles.circleIcon}>
            <Icon name="category" size={20} color="#fff" />
          </View>
        </Pressable>
      </Animated.View>

      <Animated.View style={[styles.actionButtonContainer, animatedStyle1]}>
        <Pressable
          style={styles.fabItem}
          onPress={() => handleAction(onAddExpense)}
          android_ripple={{ color: "transparent" }}
        >
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Add Expense</Text>
          </View>
          <View style={styles.circleIcon}>
            <Icon name="attach-money" size={20} color="#fff" />
          </View>
        </Pressable>
      </Animated.View>

      <Pressable
        style={styles.fab}
        onPress={() => toggleFab()}
        android_ripple={{ color: "transparent" }}
        android_disableSound={true}
      >
        <Icon
          name={expanded ? "keyboard-arrow-up" : "add"}
          size={30}
          color="#fff"
        />
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
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: "#8e24aa",
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 2, height: 4 },
    shadowRadius: 5,
  },
  actionButtonContainer: {
    position: "absolute",
    right: 0,
  },

  fabItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 20,
    paddingHorizontal: 10,
    minWidth: 200,
    gap: 10,
  },

  labelContainer: {
    backgroundColor: "#000",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    elevation: 5,
    maxWidth: 200,
    flexShrink: 1,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 4 },
    shadowRadius: 4,
  },

  label: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    flexShrink: 1,
  },

  circleIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#ec407a",
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 2, height: 4 },
    shadowRadius: 5,
  },
});
