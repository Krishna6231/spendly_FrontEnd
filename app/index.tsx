import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Alert,
  TextInput,
  LogBox,
} from "react-native";
import { useRouter } from "expo-router";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { AppDispatch } from "@/redux/store";
import { Pressable, ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { PieChart } from "react-native-chart-kit";
import CustomDropdown from "@/components/CustomDropdown";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import axios from "axios";
import { Modalize } from "react-native-modalize";
import DateTimePicker from "@react-native-community/datetimepicker";
import styles from "@/styles/index.styles";
import { Animated } from "react-native";
import AnimatedLoader from "../components/AnimatedLoader";
import { useDispatch } from "react-redux";
import {
  addExpenseAsync,
  fetchExpensesAsync,
} from "../redux/slices/expenseSlice";
import Fab from "../components/Fab";
const CATEGORY_COLORS = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
  "#8D6E63",
  "#00ACC1",
  "#D4E157",
  "#F06292",
  "#BA68C8",
  "#4DB6AC",
  "#FFD54F",
  "#7986CB",
  "#AED581",
];

LogBox.ignoreLogs([
  "VirtualizedLists should never be nested inside plain ScrollViews",
]);

const screenWidth = Dimensions.get("window").width;

export default function Dashboard() {
  const router = useRouter();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const modalRef = useRef<Modalize>(null);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [access_token, setAccessToken] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch<AppDispatch>();
  const expenses = useSelector((state: RootState) => state.expenses.expenses);
  const categories = useSelector(
    (state: RootState) => state.expenses.categories
  );
  const blinkingBorder = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  useEffect(() => {
    const getUserDataAndExpenses = async () => {
      const userString = await SecureStore.getItemAsync("userData");
      const token = await SecureStore.getItemAsync("accessToken");

      if (userString) {
        const parsedUser = JSON.parse(userString);
        setUser(parsedUser);
        dispatch(fetchExpensesAsync(parsedUser.id));
      }

      if (token) {
        setAccessToken(token);
      }
      setLoading(false);
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

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<{ label: string; value: string }[]>([]);

  const categoryMap: Record<string, { amount: number; color: string }> = {};
  const categoryColorMap: Record<string, string> = {};
  let colorIndex = 0;

  const categoryLimitMap = categories.reduce((acc, item) => {
    acc[item.category] = item.limit;
    return acc;
  }, {} as Record<string, number>);

  expenses.forEach((expense) => {
    const { category, amount } = expense;

    if (!categoryColorMap[category]) {
      categoryColorMap[category] =
        CATEGORY_COLORS[colorIndex % CATEGORY_COLORS.length];
      colorIndex++;
    }

    if (categoryMap[category]) {
      categoryMap[category].amount += amount;
    } else {
      categoryMap[category] = {
        amount,
        color: categoryColorMap[category],
      };
    }
  });

  const expenseData = Object.entries(categoryMap).map(([category, data]) => ({
    name: category,
    amount: data.amount,
    color: data.color,
  }));

  const totalSpent = expenseData.reduce((acc, item) => acc + item.amount, 0);

  const openAddExpenseModal = () => modalRef.current?.open();
  const closeAddExpenseModal = () => modalRef.current?.close();

  const isFormValid = category && amount && parseFloat(amount) > 0;

  const handleAddExpense = async () => {
    if (!category || !amount || !date) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }

    try {
      const formattedDate = date.toISOString().split("T")[0];
      const expensePayload = {
        category,
        date: formattedDate,
        amount: parseFloat(amount),
        id: user?.id,
      };

      const result = await dispatch(addExpenseAsync(expensePayload));

      if (addExpenseAsync.fulfilled.match(result)) {
        Alert.alert("Success", "Expense is added!!");
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

  const handleLogout = async () => {
    try {
      const refreshToken = await SecureStore.getItemAsync("refreshToken");

      if (refreshToken) {
        await axios.post("http://192.168.1.4:3000/auth/logout", {
          refreshToken,
        });
      }

      await SecureStore.deleteItemAsync("authToken");
      await SecureStore.deleteItemAsync("refreshToken");
      await SecureStore.deleteItemAsync("userData");

      router.replace("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      Alert.alert("Logout Error", "Something went wrong while logging out.");
    }
  };
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {/* Simple smooth loader */}
        <AnimatedLoader />
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <TouchableOpacity onPress={() => router.push("/history")}>
          <Ionicons name="person-circle-outline" size={38} color="#333" />
        </TouchableOpacity>

        {/* {dropdownVisible && (
          <View style={styles.dropdown}>
            <TouchableOpacity onPress={() => { }} style={styles.dropdownItem}>
              <Text style={styles.dropdownText}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { }} style={styles.dropdownItem}>
              <Text style={styles.dropdownText}>Settings</Text>
            </TouchableOpacity>

            <View style={styles.divider} />
            <TouchableOpacity
              onPress={handleLogout}
              style={styles.dropdownItem}
            >
              <Text style={[styles.dropdownText, { color: "#e53935" }]}>
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        )} */}
      </View>

      {/* Pie Chart */}
      <View style={{ alignItems: "center", marginTop: 20 }}>
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 22, fontWeight: "bold" }}>
            Welcome, {user?.name ? user.name : "User"}
          </Text>
          <Text style={{ fontSize: 16, marginTop: 4 }}>
            Total Spent: ₹{totalSpent}
          </Text>
        </View>
        <PieChart
          data={expenseData.map((item) => ({
            name: item.name,
            population: item.amount,
            color: item.color,
            legendFontColor: "#333",
            legendFontSize: 14,
          }))}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            color: () => `#333`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
        />
      </View>

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
    >
      <FontAwesome name="history" size={18} color="black" style={{ marginRight: 4 }} />
      <Text style={[styles.sectionTitle, { fontSize: 16 }]}>
        History
      </Text>
    </TouchableOpacity>
  
  
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 12 }}
          style={{ marginTop: 8 }}
        >
          {expenseData
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
                    key={index}
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
                        style={{ marginTop: 4, fontSize: 12, color: "#B71C1C" }}
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
            })}
        </ScrollView>
      </View>


      {/* Add Expense Button */}
      <Fab
        onAddExpense={openAddExpenseModal}
        onAddCategory={() => router.push("/category")}
        goToSettings={() => router.push("/analytics")}
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
        <View style={{ padding: 20 }}>
          <Text style={styles.sectionTitle}>Add Expense</Text>

          <Text style={styles.inputLabel}>Category</Text>
          <View style={{ zIndex: 1000 }}>
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
