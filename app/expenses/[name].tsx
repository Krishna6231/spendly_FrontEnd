import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for the back arrow

const AllExpenses = () => {
  const expenses = useSelector((state: RootState) => state.expenses.expenses);
  const { name } = useLocalSearchParams();
  const router = useRouter(); 

  const filteredAndSortedExpenses = expenses
    .filter((expense) => expense.category === name)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();

    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());

    const endOfWeek = new Date(now);
    endOfWeek.setDate(now.getDate() + (6 - now.getDay()));

    const isThisWeek = date >= startOfWeek && date <= endOfWeek;

    if (isToday) {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      });
    } else if (isThisWeek) {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
      });
    } else {
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    }
  };

  // Separate this month's and previous expenses
  const now = new Date();
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const thisMonthExpenses = filteredAndSortedExpenses.filter((expense) => new Date(expense.date) >= firstOfMonth);
  const previousExpenses = filteredAndSortedExpenses.filter((expense) => new Date(expense.date) < firstOfMonth);

  const renderExpenseItem = ({ item }: { item: any }) => (
    <View key={item.id} style={styles.expenseCard}>
      <Text style={styles.amountText}>₹{item.amount}</Text>
      <Text style={styles.dateText}>{formatDate(item.date)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>All Expenses of {name}</Text>

      {filteredAndSortedExpenses.length > 0 ? (
        <FlatList
          data={[]}
          ListHeaderComponent={
            <>
              {thisMonthExpenses.length > 0 && (
                <>
                  <Text style={styles.sectionTitle}>This Month</Text>
                  <View style={styles.separator} />
                  {thisMonthExpenses.map((item) => renderExpenseItem({ item }))}
                </>
              )}

              {previousExpenses.length > 0 && (
                <>
                  <Text style={styles.sectionTitle}>Previous</Text>
                  <View style={styles.separator} />
                  {previousExpenses.map((item) => renderExpenseItem({ item }))}
                </>
              )}
            </>
          }
          renderItem={null}
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
    marginTop: 20,
    marginBottom: 8,
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
    marginBottom: 12,
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
    color: "#4CAF50",
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
