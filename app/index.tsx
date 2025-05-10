import { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, TouchableOpacity, Dimensions, Alert, TextInput, LogBox, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { AppDispatch } from "@/redux/store";
import { Pressable, ScrollView } from "react-native-gesture-handler";
import CustomDropdown from "@/components/CustomDropdown";
import { FontAwesome, FontAwesome5, Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Modalize } from "react-native-modalize";
import DateTimePicker from "@react-native-community/datetimepicker";
import indexStyles from "@/styles/index.styles";
import { Animated } from "react-native";
import { useDispatch } from "react-redux";
import { addExpenseAsync, fetchExpensesAsync } from "../redux/slices/expenseSlice";
import { fetchAnalytics } from "@/redux/slices/analyticsSlice";
import Fab from "../components/Fab";
import { useTheme } from "../theme/ThemeContext";
import RingChart from "@/components/RingChart";

LogBox.ignoreLogs([
  "VirtualizedLists should never be nested inside plain ScrollViews",
]);

const screenWidth = Dimensions.get("window").width;

export default function Dashboard() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const modalRef = useRef<Modalize>(null);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [items, setItems] = useState<{ label: string; value: string }[]>([]);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [access_token, setAccessToken] = useState<any>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { expenses, loading } = useSelector((state: RootState) => state.expenses);
  const categories = useSelector(
    (state: RootState) => state.expenses.categories
  );
  const blinkingBorder = useRef(new Animated.Value(0)).current;
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const styles = indexStyles(isDark);

  useEffect(() => {
    const getUserDataAndExpenses = async () => {
      const userString = await SecureStore.getItemAsync("userData");
      const token = await SecureStore.getItemAsync("accessToken");
      if (userString) {
        const parsedUser = JSON.parse(userString);
        setUser(parsedUser);
        dispatch(fetchExpensesAsync(parsedUser.id));
        dispatch(fetchAnalytics(parsedUser.id));
      }

      if (token) {
        setAccessToken(token);
      }
    };
    getUserDataAndExpenses();
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkingBorder, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(blinkingBorder, {
          toValue: 0,
          duration: 500,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    const formatted = categories.map((cat) => ({
      label: cat.category,
      value: cat.category,
    }));
    setItems(formatted);
  }, [categories]);

  const onRefresh = async () => {
    setRefreshing(true);
    if (user?.id) {
      await dispatch(fetchExpensesAsync(user.id));
      await dispatch(fetchAnalytics(user.id));
    }
    setRefreshing(false);
  };

  const { thisMonthExpenseData, totalSpent, categoryLimitMap } = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const filteredExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startOfMonth && expenseDate <= now;
    });

    const categoryColorMap = categories.reduce((acc, item) => {
      acc[item.category] = item.color;
      return acc;
    }, {} as Record<string, string>);

    const categoryLimitMap = categories.reduce((acc, item) => {
      acc[item.category] = item.limit;
      return acc;
    }, {} as Record<string, number>);

    const categoryTotals: Record<string, { amount: number; color: string }> = {};

    filteredExpenses.forEach((expense) => {
      const { category, amount } = expense;
      if (!categoryTotals[category]) {
        categoryTotals[category] = {
          amount: 0,
          color: categoryColorMap[category] || "#ccc",
        };
      }
      categoryTotals[category].amount += amount;
    });

    const thisMonthExpenseData = Object.entries(categoryTotals).map(
      ([category, data]) => ({
        name: category,
        amount: data.amount,
        color: data.color,
        legendFontColor: "#333",
        legendFontSize: 14,
      })
    );

    const totalSpent = thisMonthExpenseData.reduce(
      (acc, item) => acc + item.amount,
      0
    );

    return { thisMonthExpenseData, totalSpent, categoryLimitMap };
  }, [expenses, categories]);

  const openAddExpenseModal = () => modalRef.current?.open();
  const closeAddExpenseModal = () => modalRef.current?.close();

  const isFormValid = category && amount && parseFloat(amount) > 0;

  const handleAddExpense = async () => {
    if (!category || !amount || !date) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }

    try {
      const formattedDate = date.toISOString();
      const expensePayload = {
        category,
        date: formattedDate,
        amount: parseFloat(amount),
        id: user?.id,
      };

      const result = await dispatch(addExpenseAsync(expensePayload));

      if (addExpenseAsync.fulfilled.match(result)) {
        Alert.alert("Success", "Expense is added!!");
        dispatch(fetchAnalytics(user?.id));
        closeAddExpenseModal();
        setCategory("");
        setAmount("");
        setDate(new Date());
      } else {
        Alert.alert("Error", "Failed to add expense");
      }
    } catch (error) {
      console.error("Add expense error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      {/* RefreshControl wrapping the entire page */}
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
        tintColor="#888"
        colors={['#4e9bde']}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Hi, {user?.name} 👋</Text>
          <TouchableOpacity onPress={() => router.push("/profile")}>
            <Ionicons
              name="person-circle-outline"
              size={38}
              color={isDark ? "#cbd5e1" : "#333"}
            />
          </TouchableOpacity>
        </View>

        {/* User Summary */}
        <View style={styles.userSummaryContainer}>
          <View style={styles.summaryRow}>
            <Text style={styles.totalSpentLabel}>Total Spent This Month</Text>
            <Text style={styles.totalSpentAmount}>₹{totalSpent}</Text>
          </View>
        </View>

        {/* Ring Chart or Empty State */}
        {loading ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 16, color: "#666" }}>Loading expenses...</Text>
          </View>
        ) : thisMonthExpenseData.length > 0 ? (
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <RingChart
              data={thisMonthExpenseData.map(item => ({
                key: item.name,
                value: item.amount,
                color: item.color,
              }))}
              size={220}
              strokeWidth={40}
            />
          </View>
        ) : (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginVertical: 40,
              padding: 20,
              backgroundColor: "#fff",
              borderRadius: 10,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <FontAwesome5
              name="money-bill-wave"
              size={40}
              color="green"
              style={{ marginBottom: 12 }}
            />
            <Text
              style={{
                fontSize: 18,
                fontWeight: "500",
                color: "#444",
                textAlign: "center",
              }}
            >
              No expenses for this month.
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#888",
                marginTop: 6,
                textAlign: "center",
              }}
            >
              Try adding your first spending now!
            </Text>
          </View>
        )}
      </RefreshControl>
    



        
      {/* Categories */}
      <View style={styles.categoryCard}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={styles.sectionTitle}>Spending Categories</Text>

          <TouchableOpacity
            onPress={() => router.push("/history")}
            style={{ flexDirection: "row", alignItems: "center" }}
            activeOpacity={0.5}
          >
            <FontAwesome
              name="history"
              size={16}
              color={isDark ? "#cbd5e1" : "#333"}
              style={{ marginRight: 4, marginBottom: 10 }}
            />
            <Text style={[styles.sectionTitle, { fontSize: 16 }]}>History</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 12 }}
          style={{ marginTop: 8 }}
        >
          {loading ? (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text style={{ fontSize: 16, color: "#666" }}>Loading categories...</Text>
  </View>
) : thisMonthExpenseData.length === 0 ? (
            <View style={{ alignItems: "center", marginTop: 40 }}>
              <Text
                style={{ fontSize: 16, color: "#555", textAlign: "center" }}
              >
                Looks like your wallet’s been on vacation this month! 🏖️{"\n\n"}
                No expenses yet — saving pro or just broke? 😄
              </Text>
            </View>
          ) : (
            thisMonthExpenseData
              .map((item) => {
                const limit = categoryLimitMap[item.name] || 0;
                const percentage = limit > 0 ? (item.amount / limit) * 100 : 0;
                return { ...item, percentage };
              })
              .sort((a, b) => b.percentage - a.percentage)
              .map((item, index) => {
                const limit = categoryLimitMap[item.name] || 0;
                const isOverspent = item.amount > limit;
                const percentage = limit > 0 ? (item.amount / limit) * 100 : 0;

                let barColor = "#4CAF50"; // green by default
                if (isOverspent) barColor = "#B71C1C";
                else if (percentage >= 90) barColor = "#F44336"; // red
                else if (percentage >= 70) barColor = "#FF9800"; // orange
                else if (percentage >= 40) barColor = "#FFEB3B"; // yellow

                const borderColor = blinkingBorder.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["#ccc", barColor],
                });

                return (
                  <Pressable
                    key={index}
                    onPress={() =>
                      router.push({
                        pathname: `/expenses/[name]`,
                        params: { name: item.name },
                      })
                    }
                  >
                    <Animated.View
                      style={[
                        {
                          borderWidth: 1.5,
                          borderRadius: 10,
                          padding: 10,
                          marginVertical: 8,
                          borderColor: percentage >= 70 ? borderColor : "#ccc",
                          shadowColor: barColor,
                          shadowOffset: { width: 0, height: 0 },
                          shadowOpacity: blinkingBorder,
                          shadowRadius: blinkingBorder.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 10],
                          }),
                          backgroundColor: "#fff",
                          elevation:
                            percentage >= 70
                              ? blinkingBorder.interpolate({
                                  inputRange: [0, 1],
                                  outputRange: [0, 10],
                                })
                              : 0,
                        },
                      ]}
                    >
                      {/* Top Row */}
                      <View style={styles.cat_top_row}>
                        <View>
                          <Text style={{ fontSize: 16, fontWeight: "600" }}>
                            {item.name}
                          </Text>
                        </View>
                        <Text style={{ fontSize: 16 }}>₹{item.amount}</Text>
                      </View>

                      {/* Progress Bar */}
                      <View style={styles.progressBarOut}>
                        <View
                          style={{
                            width: `${Math.min(percentage, 100)}%`,
                            backgroundColor: barColor,
                            height: "100%",
                            borderRadius: 5,
                          }}
                        />
                      </View>
                      {isOverspent ? (
                        <Text
                          style={{
                            marginTop: 4,
                            fontSize: 12,
                            color: "#B71C1C",
                          }}
                        >
                          Whoa! You overspent 🚨
                        </Text>
                      ) : (
                        <Text
                          style={{ marginTop: 4, fontSize: 12, color: "#666" }}
                        >
                          Limit: ₹{limit} ({Math.floor(percentage)}%)
                        </Text>
                      )}
                    </Animated.View>
                  </Pressable>
                );
              })
          )}
        </ScrollView>
      </View>

      {/* Add Expense Button */}
      <Fab
        onAddExpense={openAddExpenseModal}
        onAddCategory={() => router.push("/category")}
        goToAnalytics={() => router.push("/analytics")}
      />

      {/* Bottom Sheet Modal */}
      <Modalize
        ref={modalRef}
        adjustToContentHeight
        handleStyle={{ backgroundColor: "#ccc" }}
        scrollViewProps={{
          nestedScrollEnabled: true,
          keyboardShouldPersistTaps: "handled",
          scrollEnabled: true,
        }}
      >
        <View
          style={{ padding: 20, backgroundColor: isDark ? "#11151e" : "white" }}
        >
          <Text style={styles.sectionTitle}>Add Expense</Text>

          <Text style={styles.inputLabel}>Category</Text>
          <View
            style={{
              zIndex: 1000,
              backgroundColor: isDark ? "#11151e" : "white",
            }}
          >
            <CustomDropdown
              items={items}
              selectedValue={category}
              onSelect={setCategory}
            />
          </View>

          <Text style={styles.inputLabel}>Amount</Text>
          <TextInput
            keyboardType="numeric"
            placeholder="Enter amount"
            placeholderTextColor={isDark ? "white" : "black"}
            value={amount}
            onChangeText={(text) => setAmount(text.replace(/[^0-9]/g, ""))}
            style={styles.input}
          />

          <Text style={styles.inputLabel}>Date</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.dateInputWrapper}
          >
            <Text style={styles.dateInput}>{date.toLocaleDateString()}</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              themeVariant={isDark ? "dark" : "light"}
              onChange={(event, selectedDate) => {
                const currentDate = selectedDate || date;
                setDate(currentDate);
                setShowDatePicker(false);
              }}
              maximumDate={new Date()}
            />
          )}

          <TouchableOpacity
            style={[
              styles.addBtn,
              { backgroundColor: isFormValid ? "#007bff" : "#ccc" },
            ]}
            onPress={handleAddExpense}
            disabled={!isFormValid}
          >
            <Text
              style={{
                color: "#fff",
                textAlign: "center",
                fontWeight: "600",
              }}
            >
              OK
            </Text>
          </TouchableOpacity>
        </View>
      </Modalize>
    </View>
  );
}
