import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";
import * as SecureStore from "expo-secure-store";
import { deleteExpenseAsync } from "@/redux/slices/expenseSlice";
import { ThunkDispatch } from "@reduxjs/toolkit";
import allExpensesStyles from "@/styles/allExpenses.styles";
import { useTheme } from "@/theme/ThemeContext";

// Typing the dispatch as ThunkDispatch
const ExpenseItem = ({ item }: { item: any }) => {
  const [showDelete, setShowDelete] = React.useState(false);
  const deleteOffset = useSharedValue(100);
  const contentOffset = useSharedValue(0);
  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, any>>();
  const [user, setUser] = useState<any>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const styles = allExpensesStyles(isDark);

  const animatedDeleteStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: deleteOffset.value }],
    opacity: deleteOffset.value < 100 ? 1 : 0,
  }));
  const animatedContentStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: contentOffset.value }],
  }));
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();

    // Check if same date (ignoring time)
    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    // Calculate start and end of the current week
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday

    const endOfWeek = new Date(now);
    endOfWeek.setDate(now.getDate() + (6 - now.getDay())); // Saturday

    const isThisWeek = date >= startOfWeek && date <= endOfWeek;

    if (isToday) {
      // Only show time
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
    } else if (isThisWeek) {
      // Only show weekday
      return date.toLocaleDateString("en-US", {
        weekday: "short",
      });
    } else {
      // Full date: 26 Apr, 2025
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }
  };

  const toggleDelete = () => {
    if (!showDelete) {
      deleteOffset.value = withTiming(0, { duration: 200 });
      contentOffset.value = withTiming(-40, { duration: 200 }); // Move content left
    } else {
      deleteOffset.value = withTiming(100, { duration: 200 });
      contentOffset.value = withTiming(0, { duration: 200 }); // Move content back
    }
    setShowDelete(!showDelete);
  };

  const handleDelete = async () => {
    if (!user || !user.id) {
      Alert.alert("Error", "User data is missing");
      return;
    }

    try {
      await dispatch(
        deleteExpenseAsync({ expenseId: item.id, userId: user.id })
      );

      Alert.alert("Deleted", "Expense deleted", [
        {
          text: "OK",
          onPress: () => {
            deleteOffset.value = withTiming(100, { duration: 200 });
            setShowDelete(false);
          },
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to delete expense");
    }
  };

  // Load user data when component mounts
  useEffect(() => {
    const getUserDataAndExpenses = async () => {
      const userString = await SecureStore.getItemAsync("userData");

      if (userString) {
        const parsedUser = JSON.parse(userString);
        setUser(parsedUser);
      }
    };
    getUserDataAndExpenses();
  }, []);

  return (
    <TouchableOpacity
      onLongPress={toggleDelete}
      onPress={showDelete ? toggleDelete : undefined}
      activeOpacity={1}
    >
      <View style={styles.expenseCard}>
        <View style={styles.expenseRow}>
          <Text style={styles.amountText}>₹{item.amount}</Text>
          <Animated.View style={[animatedContentStyle]}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </Animated.View>
        </View>
        <Text style={styles.dateText}>{formatDate(item.date)}</Text>

        {item.note?.trim() !== "" && (
          <Text style={styles.noteText}>📝 {item.note}</Text>
        )}

        <Animated.View style={[styles.deleteButton, animatedDeleteStyle]}>
          <TouchableOpacity
            onPress={handleDelete}
            style={styles.deleteTouchable}
          >
            <Ionicons name="trash" size={20} color="#fff" />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
};

const History = () => {
  const expenses = useSelector((state: RootState) => state.expenses.expenses);
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const styles = allExpensesStyles(isDark);

  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons
          name="arrow-back"
          size={24}
          color={isDark ? "white" : "#4b5563"}
        />
      </TouchableOpacity>

      <Text style={styles.title}>History</Text>

      {sortedExpenses.length > 0 ? (
        <FlatList
          data={sortedExpenses}
          renderItem={({ item }) => <ExpenseItem item={item} />}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text style={styles.noExpensesText}>No expenses found.</Text>
      )}
    </View>
  );
};

export default History;
