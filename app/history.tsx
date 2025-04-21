import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from 'react-native-reanimated';
import * as SecureStore from "expo-secure-store";
import { deleteExpenseAsync } from '@/redux/slices/expenseSlice';
import { ThunkDispatch } from '@reduxjs/toolkit';

// Typing the dispatch as ThunkDispatch
const ExpenseItem = ({ item }: { item: any }) => {
  const [showDelete, setShowDelete] = React.useState(false);
  const deleteOffset = useSharedValue(100);
  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, any>>();
  const [user, setUser] = useState<any>(null);

  const animatedDeleteStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: deleteOffset.value }],
    opacity: deleteOffset.value < 100 ? 1 : 0,
  }));

  const toggleDelete = () => {
    if (!showDelete) {
      deleteOffset.value = withTiming(0, { duration: 200 });
    } else {
      deleteOffset.value = withTiming(100, { duration: 200 });
    }
    setShowDelete(!showDelete);
  };

  const handleDelete = async () => {
    if (!user || !user.id) {
      Alert.alert("Error", "User data is missing");
      return;
    }

    try {
      await dispatch(deleteExpenseAsync({ expenseId: item.id, userId: user.id }));

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
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
        <Text style={styles.dateText}>{new Date(item.date).toLocaleDateString()}</Text>

        <Animated.View style={[styles.deleteButton, animatedDeleteStyle]}>
          <TouchableOpacity onPress={handleDelete} style={styles.deleteTouchable}>
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

  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="black" />
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

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: "#f9f9f9",
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
    color: "#333",
    textAlign: "center",
  },
  expenseCard: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
    position: 'relative',
  },
  expenseRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  amountText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4CAF50",
  },
  categoryText: {
    fontSize: 16,
    color: "#888",
  },
  dateText: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },
  noExpensesText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 20,
  },
  deleteButton: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -20 }],
    backgroundColor: '#e53935',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 1, height: 2 },
    shadowRadius: 4,
  },
  deleteTouchable: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default History;
