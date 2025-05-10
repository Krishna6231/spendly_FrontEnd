import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for the back arrow
import catExpensesStyles from "@/styles/catExpenses.styles";
import { useTheme } from '@/theme/ThemeContext';

const AllExpenses = () => {
  const expenses = useSelector((state: RootState) => state.expenses.expenses);
  const { name } = useLocalSearchParams();
  const router = useRouter(); 
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const styles = catExpensesStyles(isDark);

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
        <Ionicons name="arrow-back" size={24} color={isDark ? "white" : "#4b5563"} />
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

export default AllExpenses;
