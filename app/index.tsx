import { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, Dimensions, Alert, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { AppDispatch } from "@/redux/store";
import { ScrollView } from "react-native-gesture-handler";
import { PieChart } from "react-native-chart-kit";
import DropDownPicker from "react-native-dropdown-picker";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import axios from "axios";
import { Modalize } from "react-native-modalize";
import DateTimePicker from "@react-native-community/datetimepicker";
import styles from "@/styles/index.styles";
import { useDispatch } from "react-redux";
import {
  addExpenseAsync,
  fetchExpensesAsync,
} from "../redux/slices/expenseSlice";
import Fab from '../components/Fab'; // Use PascalCase for React components
const CATEGORY_COLORS = [
  "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF",
  "#FF9F40", "#8D6E63", "#00ACC1", "#D4E157", "#F06292",
  "#BA68C8", "#4DB6AC", "#FFD54F", "#7986CB", "#AED581"
];

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
  const dispatch = useDispatch<AppDispatch>();
  const expenses = useSelector((state: RootState) => state.expenses.expenses);
  const categories = useSelector((state: RootState) => state.expenses.categories);
  
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
    };
    getUserDataAndExpenses();
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


  expenses.forEach((expense) => {
    const { category, amount } = expense;

    if (!categoryColorMap[category]) {
      categoryColorMap[category] = CATEGORY_COLORS[colorIndex % CATEGORY_COLORS.length];
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

  const expenseData = Object.entries(categoryMap).map(
    ([category, data]) => ({
      name: category,
      amount: data.amount,
      color: data.color,
    })
  );

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
        await axios.post("http://192.168.1.6:3000/auth/logout", {
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <TouchableOpacity onPress={() => setDropdownVisible(!dropdownVisible)}>
          <Ionicons name="person-circle-outline" size={38} color="#333" />
        </TouchableOpacity>

        {dropdownVisible && (
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
        )}
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
        <Text style={styles.sectionTitle}>Spending Categories</Text>
        {expenseData.map((item, index) => (
          <View key={index} style={styles.categoryRow}>
            <View style={[styles.colorDot, { backgroundColor: item.color }]} />
            <Text style={styles.categoryName}>{item.name}</Text>
            <Text style={styles.categoryAmount}>₹{item.amount}</Text>
          </View>
        ))}
      </View>

      {/* Add Expense Button */}
      <Fab
        onAddExpense={openAddExpenseModal}
        onAddCategory={() => router.push("/category")}
        goToSettings={() => router.push("/settings")}
      />

      {/* <TouchableOpacity style={styles.fab} onPress={openAddExpenseModal}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.fab2} onPress={() => router.push('/category')}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity> */}

      {/* Bottom Sheet Modal */}
      <Modalize
        ref={modalRef}
        adjustToContentHeight
        handleStyle={{ backgroundColor: "#ccc" }}
        scrollViewProps={{
          nestedScrollEnabled: true,
        }}
      >
        <ScrollView keyboardShouldPersistTaps="handled" nestedScrollEnabled>
          <View style={{ padding: 20 }}>
            <Text style={styles.sectionTitle}>Add Expense</Text>

            <Text style={styles.inputLabel}>Category</Text>
            <View style={{ zIndex: 1000 }}>
              <DropDownPicker
                open={open}
                value={category}
                items={items}
                setOpen={setOpen}
                setValue={setCategory}
                setItems={setItems}
                flatListProps={{ nestedScrollEnabled: true }}
                placeholder="Select a category"
                style={{
                  borderColor: "#ccc",
                  borderRadius: 8,
                }}
                dropDownContainerStyle={{
                  borderColor: "#ccc",
                  maxHeight: 200, // 🔥 FIXED HEIGHT
                }}
                listMode="SCROLLVIEW"
                scrollViewProps={{
                  nestedScrollEnabled: true,
                }}
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
              onPress={() => setShowDatePicker(true)} // Show date picker on click
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
                  setShowDatePicker(false); // Hide the date picker after selection
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
        </ScrollView>
      </Modalize>
    </View>
  );
}
