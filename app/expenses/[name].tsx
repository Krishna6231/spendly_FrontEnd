import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for the back arrow

const AllExpenses = () => {
  const expenses = useSelector((state: RootState) => state.expenses.expenses);
  const { name } = useLocalSearchParams();
  const router = useRouter(); // Use the router from expo-router

  const filteredAndSortedExpenses = expenses
    .filter((expense) => expense.category === name)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const renderItem = ({ item }: { item: any }) => (
    <View key={item.id} style={styles.expenseCard}>
      <Text style={styles.amountText}>₹{item.amount}</Text>
      <Text style={styles.dateText}>{new Date(item.date).toLocaleDateString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Back button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>All Expenses of {name}</Text>

      {filteredAndSortedExpenses.length > 0 ? (
        <FlatList
          data={filteredAndSortedExpenses}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text style={styles.noExpensesText}>No expenses found for this category.</Text>
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
    zIndex: 1, // Ensure the button stays on top
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
  },
  amountText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4CAF50", // Green color for amount
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
});

export default AllExpenses;
