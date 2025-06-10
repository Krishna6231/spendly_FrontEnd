import React, { useState } from "react";
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
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
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

interface CategoryItem {
  category: string;
  limit: number;
  color: string;
}

interface SubscriptionItem {
  subscription: string;
  amount: number;
  autopay_date: number;
}

const tabs = ["Categories", "Subscriptions", "Loans"] as const;
type TabType = (typeof tabs)[number];

const TopTabs = () => {
  const [activeTab, setActiveTab] = useState<TabType>("Categories");
  const translateX = useSharedValue(0);
  const underlineOffset = useSharedValue(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [submodalVisible, setSubModalVisible] = useState(false);
  const [editingSub, setEditingSub] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [subNameInput, setSubNameInput] = useState("");
  const [subAmount, setSubAmount] = useState("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [limitInput, setLimitInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [aselectedColor, setASelectedColor] = useState<string>("");
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const expenses = useSelector((state: RootState) => state.expenses.expenses);
  const categoryList = useSelector(
    (state: RootState) => state.expenses.categories
  ) as CategoryItem[];
  const subscriptionList = useSelector(
    (state: RootState) => state.expenses.subscriptions
  ) as SubscriptionItem[];
  const [loanList, setLoanList] = useState([
    {
      name: "Rahul Sharma",
      amount: 2000,
      type: "borrow", // or "lend"
      dueDate: "2025-06-15",
    },
    {
      name: "Ananya Singh",
      amount: 3500,
      type: "lend",
      dueDate: "2025-06-25",
    },
    {
      name: "Zomato Refund",
      amount: 450,
      type: "borrow",
      dueDate: "2025-06-10",
    },
  ]);

  const { theme } = useTheme();
  const isDark = theme === "dark";
  const styles = categoryStyles(isDark);

  const handleSave = async () => {
    if (
      !nameInput ||
      !limitInput ||
      !selectedColor
    ) {
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
    if (
      !subNameInput ||
      !subAmount ||
      !selectedDate
    ) {
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

  const openSubEditModal = (item: SubscriptionItem) => {
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

  const openEditModal = (item: CategoryItem) => {
    setEditingCategory(item.category);
    setNameInput(item.category);
    setLimitInput(item.limit.toString());
    setSelectedColor(item.color);
    setASelectedColor(item.color);
    setModalVisible(true);
  };

  const openLoanAddModal = () => {
    console.log("Loan Add Modal");
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
            {loanList.length === 0 ? (
              <Text style={styles.emptyText}>No Loans Yet</Text>
            ) : (
              loanList.map((loan, index) => (
                <View key={index} style={styles.loanItem}>
                  <View>
                    <Text style={styles.loanName}>
                      <Text style={styles.italicLabel}>
                        {loan.type === "borrow" ? "From " : "To "}
                      </Text>
                      {loan.name}
                    </Text>
                    <Text style={styles.loanDetails}>
                      {loan.type === "borrow" ? "Borrowed" : "Lent"} ₹
                      {loan.amount} | Due: {loan.dueDate}
                    </Text>
                  </View>
                  <View style={styles.iconRow}>
                    <TouchableOpacity>
                      <MaterialIcons name="edit" size={22} color="#555" />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginLeft: 16 }}>
                      <MaterialIcons name="delete" size={22} color="#555" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

export default TopTabs;
