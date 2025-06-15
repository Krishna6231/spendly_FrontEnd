import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Modal,
  FlatList,
  TextInput,
  Alert,
  Pressable,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import {
  addCategoryAsync,
  fetchExpensesAsync,
  editCategoryAsync,
  deleteCategoryAsync,
  addSubscriptionAsync,
  editSubscriptionAsync,
  deleteSubscriptionAsync,
} from "@/redux/slices/expenseSlice";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { useRouter } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import categoryStyles from "@/styles/category.styles";
import LoanScreen from "@/components/LoanScreen";
import { addLentBorrowAsync, fetchAllLentBorrowAsync, updateLentBorrowAsync } from "@/redux/slices/lentborrowSlice";

const { width } = Dimensions.get("window");

const CATEGORY_COLORS = [
  "#FF5722",
  "#3F51B5",
  "#4CAF50",
  "#E91E63",
  "#8BC34A",
  "#9C27B0",
  "#FF9800",
  "#2196F3",
  "#673AB7",
  "#03A9F4",
  "#F44336",
];

const tabs = ["Categories", "Subscriptions", "Loans"] as const;
type TabType = (typeof tabs)[number];

type Installment = {
  amount: number;
  date: string;
};

type Loan = {
  id: string;
  amount: number;
  name: string;
  type: "Lent" | "Borrow";
  date: string;
  installments: Installment[];
};

const TopTabs = () => {
  const [activeTab, setActiveTab] = useState<TabType>("Categories");
  const translateX = useSharedValue(0);
  const underlineOffset = useSharedValue(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [submodalVisible, setSubModalVisible] = useState(false);
  const [loanModalVisible, setLoanModalVisible] = useState(false);
  const [editingSub, setEditingSub] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [subNameInput, setSubNameInput] = useState("");
  const [subAmount, setSubAmount] = useState("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [limitInput, setLimitInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingLoan, setEditingLoan] = useState<string | null>(null);
  const [aselectedColor, setASelectedColor] = useState<string>("");
  const [lname, setLname] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [loantype, setLoanType] = useState<"Lent" | "Borrow">("Lent");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const expenses = useSelector((state: RootState) => state.expenses.expenses);
  const categoryList = useSelector(
    (state: RootState) => state.expenses.categories
  );
  const subscriptionList = useSelector(
    (state: RootState) => state.expenses.subscriptions
  );
  const loanList = useSelector(
    (state: RootState) => state.lentBorrow.data
  );
  
useEffect(() => {
  dispatch(fetchAllLentBorrowAsync());
}, []);
  

  const { theme } = useTheme();
  const isDark = theme === "dark";
  const styles = categoryStyles(isDark);
  const[id,setId]=useState("");
  const handleSave = async () => {
    if (!nameInput || !limitInput || !selectedColor) {
      Alert.alert(
        "Missing Fields",
        "Please fill in all fields including color."
      );
      return;
    }

    const payload = {
      category: nameInput,
      limit: parseFloat(limitInput),
      color: selectedColor,
    };

    try {
      let action;
      if (editingCategory) {
        action = await dispatch(editCategoryAsync(payload));
      } else {
        action = await dispatch(addCategoryAsync(payload));
      }

      const isSuccess = editingCategory
        ? editCategoryAsync.fulfilled.match(action)
        : addCategoryAsync.fulfilled.match(action);

      if (isSuccess) {
        setModalVisible(false);
        setNameInput("");
        setLimitInput("");
        setSelectedColor("");
        setEditingCategory(null);
        await dispatch(fetchExpensesAsync());
      } else {
        Alert.alert("Error", "Failed to save category.");
        console.error("Category operation failed:", action.payload);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      Alert.alert("Error", "Something went wrong.");
    }
  };

  const handleSubSave = async () => {
    if (!subNameInput || !subAmount || !selectedDate) {
      Alert.alert("Missing Fields", "Please fill in all fields.");
      return;
    }

    const payload = {
      subscription: subNameInput,
      amount: parseFloat(subAmount),
      autopay_date: selectedDate,
    };

    try {
      let action;
      if (editingSub) {
        action = await dispatch(editSubscriptionAsync(payload));
      } else {
        action = await dispatch(addSubscriptionAsync(payload));
      }

      const isSuccess = editingSub
        ? editSubscriptionAsync.fulfilled.match(action)
        : addSubscriptionAsync.fulfilled.match(action);

      if (isSuccess) {
        setEditingSub(null);
        setSubNameInput("");
        setSubAmount("");
        setSelectedDate(null);
        setSubModalVisible(false);
        await dispatch(fetchExpensesAsync());
      } else {
        Alert.alert("Error", "Failed to save subscription.");
        console.error("Subscription operation failed:", action.payload);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      Alert.alert("Error", "Something went wrong.");
    }

    Alert.alert(
      "Subscription Saved",
      `${subNameInput} - ${subAmount} - ${selectedDate}`
    );
  };
const handleLoanSave = async () => {
    if (!lname || !loanAmount || !date) {
      Alert.alert("Missing Fields", "Please fill in all fields.");
      return;
    }

    const payload = {
      id: id,
      name: lname,
      amount: parseFloat(loanAmount),
      date: date,
      type: loantype
    };

    try {
      let action;
      if (editingLoan) {
        action = await dispatch(updateLentBorrowAsync(payload));
      } else {
        action = await dispatch(addLentBorrowAsync(payload));
      }

      const isSuccess = editingLoan
        ? updateLentBorrowAsync.fulfilled.match(action)
        : addLentBorrowAsync.fulfilled.match(action);

      if (isSuccess) {
        setEditingLoan(null);
        setLname("");
        setLoanAmount("");
        setDate(new Date());
        setLoanModalVisible(false);
        setLoanType("Lent");
        await dispatch(fetchAllLentBorrowAsync());
      } else {
        Alert.alert("Error", "Failed to save loan.");
        console.error("Loan operation failed:", action.payload);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      Alert.alert("Error", "Something went wrong.");
    }

    Alert.alert(
      "Loan Saved"
    );
  };
  


  const handleTabPress = (tab: TabType) => {
    const index = tabs.indexOf(tab);
    setActiveTab(tab);
    translateX.value = withTiming(-index * width, { duration: 300 });
    underlineOffset.value = withTiming(index * (width / tabs.length), {
      duration: 300,
    });
  };

  const handleCategoryDelete = () => {
    if (!editingCategory) return;

    const categoryExpenses = expenses.filter(
      (exp) => exp.category === editingCategory
    );

    if (categoryExpenses.length > 0) {
      Alert.alert(
        "Can't Delete",
        "You have expenses in this category. Please reassign or delete them first."
      );
    } else {
      Alert.alert(
        "Confirm Delete",
        `Are you sure you want to delete the "${editingCategory}" category?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              try {
                const response = await dispatch(
                  deleteCategoryAsync({
                    category: editingCategory,
                  })
                );

                if (deleteCategoryAsync.fulfilled.match(response)) {
                  Alert.alert("Success", "Category deleted successfully.");
                  setModalVisible(false);
                  await dispatch(fetchExpensesAsync());
                } else {
                  Alert.alert("Error", "Failed to delete category.");
                }
              } catch (err) {
                console.error("Delete Error:", err);
                Alert.alert("Error", "An unexpected error occurred.");
              }
            },
          },
        ]
      );
    }
  };

  const handleSubscriptionDelete = (sub: any) => {
    if (!sub.subscription) return;

    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to delete the "${sub.subscription}" Subscription?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await dispatch(
                deleteSubscriptionAsync({
                  subscription: sub.subscription,
                })
              );

              if (deleteSubscriptionAsync.fulfilled.match(response)) {
                Alert.alert("Success", "Subscription deleted successfully.");
                setModalVisible(false);
                await dispatch(fetchExpensesAsync());
              } else {
                Alert.alert("Error", "Failed to delete subscription.");
              }
            } catch (err) {
              console.error("Delete Error:", err);
              Alert.alert("Error", "An unexpected error occurred.");
            }
          },
        },
      ]
    );
  };

  const openSubAddModal = () => {
    setEditingSub(null);
    setSubNameInput("");
    setSubAmount("");
    setSelectedDate(null);
    setSubModalVisible(true);
  };

  const openSubEditModal = (item: any) => {
    setEditingSub(item.subscription);
    setSubNameInput(item.subscription);
    setSubAmount(item.amount.toString());
    setSelectedDate(item.autopay_date);
    setSubModalVisible(true);
  };

  const openAddModal = () => {
    setEditingCategory(null);
    setNameInput("");
    setLimitInput("");
    setSelectedColor("");
    setModalVisible(true);
  };

  const openEditModal = (item: any) => {
    setEditingCategory(item.category);
    setNameInput(item.category);
    setLimitInput(item.limit.toString());
    setSelectedColor(item.color);
    setASelectedColor(item.color);
    setModalVisible(true);
  };

  const openLoanAddModal = () => {
    setLname("");
    setLoanAmount("");
    setLoanType("Lent");
    setDate(new Date());
    setLoanModalVisible(true);
  };

  const openLoanEditModal = (item: any) => {
    setId(item.id);
    setEditingLoan(item);
    setLname(item.name);
    setLoanAmount(item.amount);
    setDate(new Date(item.date));
    setLoanModalVisible(true);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const animatedUnderlineStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: underlineOffset.value }],
  }));

  return (
    <View style={styles.container}>
      {/*FAB*/}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          if (activeTab === "Categories") openAddModal();
          else if (activeTab === "Subscriptions") openSubAddModal();
          else if (activeTab === "Loans") openLoanAddModal();
        }}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
      {/* Header */}
      <View style={styles.heading}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={isDark ? "white" : "#4b5563"}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Categories</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => handleTabPress(tab)}
              style={styles.tabButton}
            >
              <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
        <Animated.View style={[styles.underline, animatedUnderlineStyle]} />
      </View>

      {/* Slideable Content */}
      <View style={{ overflow: "hidden", flex: 1 }}>
        <Animated.View
          style={[{ flexDirection: "row", width: width * 3 }, animatedStyle]}
        >
          <View style={styles.screen}>
            <FlatList
              data={categoryList}
              keyExtractor={(item) => item.category}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <View style={styles.textContainer}>
                    <View
                      style={[
                        styles.colorIndicator,
                        { backgroundColor: item.color },
                      ]}
                    />
                    <View>
                      <Text style={styles.name}>{item.category}</Text>
                      <Text style={styles.limit}>₹{item.limit}</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.editIconContainer}
                    onPress={() => openEditModal(item)}
                  >
                    <MaterialIcons name="edit" size={22} color="#555" />
                  </TouchableOpacity>
                </View>
              )}
            />
            <Modal
              transparent={true}
              visible={modalVisible}
              animationType="fade"
              onRequestClose={() => setModalVisible(false)}
            >
              <Pressable
                style={styles.modalOverlay}
                onPress={() => setModalVisible(false)}
              >
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>
                    {editingCategory ? "Edit Category" : "Add Category"}
                  </Text>
                  <TextInput
                    value={nameInput}
                    onChangeText={setNameInput}
                    placeholder="Category Name"
                    placeholderTextColor={isDark ? "#9ca3af" : "#888"}
                    style={styles.input}
                    editable={!editingCategory} // Lock name if editing
                  />
                  <TextInput
                    value={limitInput}
                    onChangeText={setLimitInput}
                    placeholder="Limit"
                    placeholderTextColor={isDark ? "#9ca3af" : "#888"}
                    keyboardType="numeric"
                    style={styles.input}
                  />
                  {editingCategory && (
                    <View style={styles.sc}>
                      <View>
                        <Text style={styles.modalSubTitle2}>
                          Current color:
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.colorBar,
                          { backgroundColor: aselectedColor },
                        ]}
                      ></View>
                    </View>
                  )}
                  <Text style={styles.modalSubTitle}>Select a Color:</Text>
                  <View style={styles.colorGrid}>
                    {CATEGORY_COLORS.filter(
                      (color) =>
                        !categoryList.some((cat) => cat.color === color)
                    ).map((color) => (
                      <TouchableOpacity
                        key={color}
                        style={[
                          styles.colorCircle,
                          {
                            backgroundColor: color,
                            borderWidth: selectedColor === color ? 2 : 0,
                          },
                        ]}
                        onPress={() => setSelectedColor(color)}
                      />
                    ))}
                  </View>
                  <TouchableOpacity style={styles.okBtn} onPress={handleSave}>
                    <Text style={styles.okBtnText}>OK</Text>
                  </TouchableOpacity>
                  {editingCategory && (
                    <TouchableOpacity
                      onPress={handleCategoryDelete}
                      style={styles.delcat}
                    >
                      <MaterialIcons
                        name="delete"
                        size={20}
                        color="red"
                        style={{ marginRight: 6 }}
                      />
                      <Text style={styles.delcatText}>Delete</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </Pressable>
            </Modal>
          </View>
          <View style={styles.screen}>
            {subscriptionList.length === 0 ? (
              <Text style={styles.emptyText}>No Subscriptions Yet</Text>
            ) : (
              subscriptionList.map((sub, index) => (
                <View key={index} style={styles.subscriptionItem}>
                  <View>
                    <Text style={styles.subName}>{sub.subscription}</Text>
                    <Text style={styles.subDetails}>
                      ₹{sub.amount} | Auto-pay: {sub.autopay_date} of every
                      month
                    </Text>
                  </View>
                  <View style={styles.iconRow}>
                    <TouchableOpacity onPress={() => openSubEditModal(sub)}>
                      <MaterialIcons name="edit" size={22} color="#555" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{ marginLeft: 16 }}
                      onPress={() => handleSubscriptionDelete(sub)}
                    >
                      <MaterialIcons name="delete" size={22} color="#555" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
            <Modal
              transparent={true}
              visible={submodalVisible}
              animationType="fade"
              onRequestClose={() => setSubModalVisible(false)}
            >
              <Pressable
                style={styles.modalOverlay}
                onPress={() => setSubModalVisible(false)}
              >
                <View style={styles.modalContent2}>
                  <Text style={styles.modalTitle}>
                    {editingSub ? "Edit Subscription" : "Add Subscription"}
                  </Text>
                  <TextInput
                    value={subNameInput}
                    onChangeText={setSubNameInput}
                    placeholder="Subscription Name"
                    placeholderTextColor={isDark ? "#9ca3af" : "#888"}
                    style={styles.input}
                    editable={!editingSub}
                  />
                  <TextInput
                    value={subAmount}
                    onChangeText={setSubAmount}
                    placeholder="Amount"
                    placeholderTextColor={isDark ? "#9ca3af" : "#888"}
                    keyboardType="numeric"
                    style={styles.input}
                  />
                  <Text style={styles.modalSubTitle}>Select Autopay Date</Text>
                  <View style={styles.dateGrid}>
                    {Array.from({ length: 28 }, (_, i) => i + 1).map((date) => (
                      <TouchableOpacity
                        key={date}
                        style={[
                          styles.dateCircle,
                          selectedDate === date && styles.selectedDateCircle,
                        ]}
                        onPress={() => setSelectedDate(date)}
                      >
                        <Text
                          style={[
                            styles.dateText,
                            selectedDate === date && styles.selectedDateText,
                          ]}
                        >
                          {date}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <TouchableOpacity
                    style={styles.okBtn}
                    onPress={handleSubSave}
                  >
                    <Text style={styles.okBtnText}>OK</Text>
                  </TouchableOpacity>
                </View>
              </Pressable>
            </Modal>
          </View>
          <View style={styles.screen}>
            <LoanScreen loanList={loanList} openLoanEditModal = {openLoanEditModal} />
            <Modal
              transparent={true}
              visible={loanModalVisible}
              animationType="fade"
              onRequestClose={() => setLoanModalVisible(false)}
            >
              <Pressable
                style={styles.modalOverlay}
                onPress={() => setLoanModalVisible(false)}
              >
                <View style={styles.modalContent2}>
                  <Text style={styles.modalTitle}>{editingLoan ? "Editing loan" : "Add loan"}</Text>
                  <TextInput
                    value={lname}
                    onChangeText={setLname}
                    placeholder="Person Name"
                    placeholderTextColor={isDark ? "#9ca3af" : "#888"}
                    style={styles.input}
                  />
                  <TextInput
                    value={loanAmount}
                    onChangeText={setLoanAmount}
                    placeholder="Amount"
                    placeholderTextColor={isDark ? "#9ca3af" : "#888"}
                    keyboardType="numeric"
                    style={styles.input}
                  />
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    style={styles.input}
                  >
                    <Text style={styles.dateInput}>
                      {date.toLocaleDateString()}
                    </Text>
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

                  <View style={styles.radioGroup}>
                    {["Lent", "Borrow"].map((type) => (
                      <TouchableOpacity
                        key={type}
                        style={styles.radioOption}
                        onPress={() => setLoanType(type as "Lent" | "Borrow")}
                        disabled={editingLoan? true : false }
                      >
                        <View style={styles.radioCircle}>
                          {loantype === type && (
                            <View style={styles.radioSelected} />
                          )}
                        </View>
                        <Text style={styles.radioLabel}>{type}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <TouchableOpacity
                    style={styles.okBtn}
                    onPress={handleLoanSave}
                  >
                    <Text style={styles.okBtnText}>OK</Text>
                  </TouchableOpacity>
                </View>
              </Pressable>
            </Modal>
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

export default TopTabs;
