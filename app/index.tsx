import { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, Dimensions, StyleSheet, Alert, TextInput} from "react-native";
import { useRouter } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import { DashboardHeader } from "@/components/DashboardHeader";
import { PieChart } from "react-native-chart-kit";
import DropDownPicker from "react-native-dropdown-picker";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { Modalize } from "react-native-modalize";
import DateTimePicker from "@react-native-community/datetimepicker";

const screenWidth = Dimensions.get("window").width;
const expenseData = [
  { name: "Food", amount: 1500, color: "#4caf50" },
  { name: "Travel", amount: 1000, color: "#ff9800" },
  { name: "Shopping", amount: 800, color: "#f44336" },
];

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

  useEffect(() => {
    const getUserData = async () => {
      const userString = await SecureStore.getItemAsync("userData");
      const token = await SecureStore.getItemAsync("accessToken");

      if (userString) {
        const parsedUser = JSON.parse(userString);
        setUser(parsedUser);
      }

      if (token) {
        setAccessToken(token);
      }
    };
    getUserData();
  }, []);

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Food", value: "Food" },
    { label: "Travel", value: "Travel" },
    { label: "Shopping", value: "Shopping" },
    { label: "Medicine", value: "Medicine" },
    { label: "Drinks", value: "Drinks" },
    { label: "Entertainment", value: "Entertainment" },
    { label: "Other", value: "Other" },
  ]);

  const openAddExpenseModal = () => modalRef.current?.open();
  const closeAddExpenseModal = () => modalRef.current?.close();

  const isFormValid = category && amount && parseFloat(amount) > 0;

  const handleAddExpense = async () => {
    if (!category || !amount || !date) {
      Alert.alert("Error", "Please fill all fields.");
      console.log("Missing field:", { category, amount, date });
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
  
      const response = await axios.post(
        "http://192.168.0.101:3000/expense/add",
        expensePayload,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
  
      if (response.status === 200 || response.status === 201) {
        Alert.alert("Success", "Expense is added!");
        closeAddExpenseModal();
        setCategory("");
        setAmount("");
        setDate(new Date());
      } else {
        console.warn("Unexpected response status:", response.status);
        Alert.alert("Error", "Failed to add expense. Please try again.");
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
        await axios.post("http://192.168.0.101:3000/auth/logout", {
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
            <TouchableOpacity onPress={() => {}} style={styles.dropdownItem}>
              <Text style={styles.dropdownText}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {}} style={styles.dropdownItem}>
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
        <DashboardHeader />
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
      <TouchableOpacity style={styles.fab} onPress={openAddExpenseModal}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

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
                flatListProps={{nestedScrollEnabled:true}}
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

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fdfdfd" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
  },

  dropdown: {
    position: "absolute",
    top: 50,
    right: 0,
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    zIndex: 10,
  },

  dropdownItem: {
    paddingVertical: 8,
  },

  dropdownText: {
    fontSize: 16,
    color: "#333",
  },

  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 8,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#444",
  },

  categoryCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginTop: 30,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },

  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },

  colorDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 10,
  },

  categoryName: {
    fontSize: 16,
    flex: 1,
  },

  categoryAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },

  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#007bff",
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },

  inputLabel: {
    fontSize: 16,
    marginTop: 12,
    fontWeight: "600",
    color: "#444",
  },

  dropdownWrapper: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginBottom: 12,
    overflow: "scroll",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    height: 50,
    paddingHorizontal: 10,
    marginBottom: 12,
  },

  dateInputWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    height: 50,
    justifyContent: "center",
    paddingHorizontal: 10,
  },

  dateInput: {
    fontSize: 16,
    color: "#444",
  },

  addBtn: {
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
});
