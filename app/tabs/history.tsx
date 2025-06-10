import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Dimensions,
  SectionList,
} from "react-native";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";
import { deleteExpenseAsync } from "@/redux/slices/expenseSlice";
import { ThunkDispatch } from "@reduxjs/toolkit";
import allExpensesStyles from "@/styles/allExpenses.styles";
import { useTheme } from "@/context/ThemeContext";
import XLSX from "xlsx";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { useAuth } from "@/context/AuthContext";
import { fetchAnalytics } from "@/redux/slices/analyticsSlice";

const screenWidth = Dimensions.get("window").width;

const exportToExcel = async (data: any[], fileName = "Expenses") => {
  try {
    const formattedData = data.map((item) => ({
      Amount: `₹${item.amount}`,
      Category: item.category,
      Date: new Date(item.date).toLocaleString(),
      Note: item.note || "",
    }));

    const ws = XLSX.utils.json_to_sheet(formattedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Expenses");

    const wbout = XLSX.write(wb, { type: "base64", bookType: "xlsx" });

    const uri = FileSystem.documentDirectory + `${fileName}.xlsx`;

    await FileSystem.writeAsStringAsync(uri, wbout, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // File is saved now, trigger sharing
    await Sharing.shareAsync(uri, {
      mimeType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      dialogTitle: "Share your expenses Excel file",
      UTI: "com.microsoft.excel.xlsx",
    });
  } catch (error) {
    alert("Failed to export file: " + error);
  }
};

const ExpenseItem = ({ item }: { item: any }) => {
  const [showDelete, setShowDelete] = React.useState(false);
  const deleteOffset = useSharedValue(100);
  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, any>>();
  const { accessToken, userData: user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const styles = allExpensesStyles(isDark);

  const animatedDeleteStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: deleteOffset.value }],
    opacity: deleteOffset.value < 100 ? 1 : 0,
  }));
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
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
    } else if (isThisWeek) {
      return date.toLocaleDateString("en-US", {
        weekday: "short",
      });
    } else {
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }
  };

  const toggleDelete = () => {
    deleteOffset.value = withTiming(showDelete ? 100 : 0, { duration: 200 });
    setShowDelete(!showDelete);
  };

  const handleDelete = async () => {
    if (!user || !user.id || !accessToken) {
      Alert.alert("Error", "User data is missing");
      return;
    }

    try {
      await dispatch(deleteExpenseAsync({ expenseId: item.id }));
      await dispatch(fetchAnalytics());

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

  return (
    <TouchableOpacity
      onLongPress={toggleDelete}
      onPress={showDelete ? toggleDelete : undefined}
      activeOpacity={0.9}
    >
      <View style={styles.expenseItemContainer}>
        <View style={styles.expenseContent}>
          <View style={styles.row}>
            <Text style={styles.amount}>₹{item.amount}</Text>
            <Text style={styles.date}>{formatDate(item.date)}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.category}>{item.category}</Text>
            {item.note?.trim() !== "" && (
              <Text style={styles.note}>📝 {item.note}</Text>
            )}
          </View>
        </View>

        <Animated.View style={[styles.deleteButton, animatedDeleteStyle]}>
          <TouchableOpacity
            onPress={handleDelete}
            style={styles.deleteTouchable}
          >
            <Ionicons name="trash" size={18} color="#fff" />
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
  const [selectedCategory, setSelectedCategory] = useState("All");
  const categories = [
    "All",
    ...Array.from(new Set(expenses.map((expense) => expense.category))),
  ];

  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const filteredExpenses =
    selectedCategory === "All"
      ? sortedExpenses
      : sortedExpenses.filter((e) => e.category === selectedCategory);

  const now = new Date();
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const thisMonthExpenses = filteredExpenses.filter(
    (expense) => new Date(expense.date) >= firstOfMonth
  );
  const previousExpenses = filteredExpenses.filter(
    (expense) => new Date(expense.date) < firstOfMonth
  );

  const sections = [
  {
    title: 'This Month Expenses',
    data: thisMonthExpenses,
  },
  // Only add previous section if there are items
  ...(previousExpenses.length > 0 ? [{
    title: 'Previous Expenses',
    data: previousExpenses,
  }] : [])
];

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={isDark ? "white" : "#4b5563"}
          />
        </TouchableOpacity>

        <Text style={styles.title}>Expenses</Text>

        <TouchableOpacity
          style={styles.downloadButton}
          onPress={() =>
            exportToExcel(
              filteredExpenses,
              selectedCategory === "All"
                ? "Expenses"
                : `Expenses_${selectedCategory}`
            )
          }
        >
          <Feather
            name="download"
            size={24}
            color={isDark ? "white" : "#4b5563"}
          />
        </TouchableOpacity>
      </View>
      <View style={{ width: screenWidth, paddingVertical: 16 }}>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 14 }}
          keyExtractor={(item) => item}
          renderItem={({ item }) => {
            const isSelected = selectedCategory === item;
            return (
              <TouchableOpacity
                onPress={() => setSelectedCategory(item)}
                style={[
                  styles.hiscatsel,
                  { backgroundColor: isSelected ? "#4b5563" : "#e5e7eb" },
                ]}
              >
                <Text style={{ color: isSelected ? "#fff" : "#374151" }}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {filteredExpenses.length > 0 ? (
        <SectionList
          sections={sections}
          renderItem={({ item }) => <ExpenseItem item={item} />}
          renderSectionHeader={({ section }) => (
            <Text style={styles.sectionHeader}>{section.title}</Text>
          )}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Text style={styles.noExpensesText}>No expenses found.</Text>
      )}
    </View>
  );
};

export default History;
