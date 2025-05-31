import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Alert,
  Animated,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { MaterialIcons } from "@expo/vector-icons";
import categoryStyles from "../styles/category.styles";
import * as SecureStore from "expo-secure-store";
import {
  addCategoryAsync,
  fetchExpensesAsync,
  editCategoryAsync,
  deleteCategoryAsync,
  addSubscriptionAsync,
  editSubscriptionAsync,
  deleteSubscriptionAsync,
} from "../redux/slices/expenseSlice";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "@/theme/ThemeContext";
import { ScrollView } from "react-native-gesture-handler";

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

const Category = () => {
  const categoryList = useSelector(
    (state: RootState) => state.expenses.categories
  ) as CategoryItem[];
  const subscriptionList = useSelector(
    (state: RootState) => state.expenses.subscriptions
  ) as SubscriptionItem[];
  const expenses = useSelector((state: RootState) => state.expenses.expenses);
  const [modalVisible, setModalVisible] = useState(false);
  const [submodalVisible, setSubModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingSub, setEditingSub] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [subNameInput, setSubNameInput] = useState("");
  const [limitInput, setLimitInput] = useState("");
  const [subAmount, setSubAmount] = useState("");
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [aselectedColor, setASelectedColor] = useState<string>("");
  const [user, setUser] = useState<any>(null);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const styles = categoryStyles(isDark);
  const [subscriptionsExpanded, setSubscriptionsExpanded] = useState(false);
  const animatedHeight = useState(new Animated.Value(0))[0];

  useEffect(() => {
    const getUserDataAndExpenses = async () => {
      const userString = await SecureStore.getItemAsync("userData");
      if (userString) {
        const parsedUser = JSON.parse(userString);
        setUser(parsedUser);
        dispatch(fetchExpensesAsync(parsedUser.id));
      }
    };
    getUserDataAndExpenses();
  }, []);

  const openEditModal = (item: CategoryItem) => {
    setEditingCategory(item.category);
    setNameInput(item.category);
    setLimitInput(item.limit.toString());
    setSelectedColor(item.color);
    setASelectedColor(item.color);
    setModalVisible(true);
  };

  const openAddModal = () => {
    setEditingCategory(null);
    setNameInput("");
    setLimitInput("");
    setSelectedColor("");
    setModalVisible(true);
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

  const toggleSubscriptions = () => {
    const finalHeight =
      subscriptionList.length > 0 ? subscriptionList.length * 70 + 20 : 60;

    Animated.timing(animatedHeight, {
      toValue: subscriptionsExpanded ? 0 : finalHeight,
      duration: 300,
      useNativeDriver: false,
    }).start();

    setSubscriptionsExpanded(!subscriptionsExpanded);
  };

  const handleCategoryDelete = () => {
    if (!editingCategory || !user?.id) return;

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
                    user_id: user.id,
                    category: editingCategory,
                  })
                );

                if (deleteCategoryAsync.fulfilled.match(response)) {
                  Alert.alert("Success", "Category deleted successfully.");
                  setModalVisible(false);
                  dispatch(fetchExpensesAsync(user.id));
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
    if (!sub.subscription || !user?.id) return;

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
                  user_id: user.id,
                  subscription: sub.subscription,
                })
              );

              if (deleteSubscriptionAsync.fulfilled.match(response)) {
                Alert.alert("Success", "Subscription deleted successfully.");
                setModalVisible(false);
                dispatch(fetchExpensesAsync(user.id));
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

  const handleSubSave = async () => {
    if (!subNameInput || !subAmount || !selectedDate || !user?.id) {
      Alert.alert("Missing Fields", "Please fill in all fields.");
      return;
    }

    const payload = {
      user_id: user.id,
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
        dispatch(fetchExpensesAsync(user.id));
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

  const handleSave = async () => {
    if (!nameInput || !limitInput || !selectedColor || !user?.id) {
      Alert.alert(
        "Missing Fields",
        "Please fill in all fields including color."
      );
      return;
    }

    const payload = {
      user_id: user.id,
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
        dispatch(fetchExpensesAsync(user.id));
      } else {
        Alert.alert("Error", "Failed to save category.");
        console.error("Category operation failed:", action.payload);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      Alert.alert("Error", "Something went wrong.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons
          name="arrow-back"
          size={24}
          color={isDark ? "white" : "black"}
        />
      </TouchableOpacity>
      <Text style={styles.title}>Categories & Subscriptions</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
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
                <MaterialIcons name="edit" size={24} color="#555" />
              </TouchableOpacity>
            </View>
          )}
        />
        <View style={styles.partition} />

        <TouchableOpacity
          style={styles.toggleRow}
          onPress={toggleSubscriptions}
        >
          <Text style={styles.sectionTitle}>Subscriptions</Text>
          <Ionicons
            name={subscriptionsExpanded ? "chevron-up" : "chevron-down"}
            size={24}
            color={isDark ? "white" : "black"}
          />
        </TouchableOpacity>
        <Animated.View
          style={[styles.subscriptionContainer, { height: animatedHeight }]}
        >
          {subscriptionList.length === 0 ? (
            <Text style={styles.emptyText}>No Subscriptions Yet</Text>
          ) : (
            subscriptionList.map((sub, index) => (
              <View key={index} style={styles.subscriptionItem}>
                <View>
                  <Text style={styles.subName}>{sub.subscription}</Text>
                  <Text style={styles.subDetails}>
                    ₹{sub.amount} | Auto-pay: {sub.autopay_date} of every month
                  </Text>
                </View>
                <View style={styles.iconRow}>
                  <TouchableOpacity onPress={() => openSubEditModal(sub)}>
                    <MaterialIcons name="edit" size={22} color="#4CAF50" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ marginLeft: 16 }}
                    onPress={() => handleSubscriptionDelete(sub)}
                  >
                    <MaterialIcons name="delete" size={22} color="#F44336" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </Animated.View>
      </ScrollView>

      <View style={styles.bottom_buttons}>
        <TouchableOpacity style={styles.addBtn} onPress={openAddModal}>
          <Text style={styles.addBtnText}>Add Category</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addBtn} onPress={openSubAddModal}>
          <Text style={styles.addBtnText}>Add Subscription</Text>
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingCategory ? "Edit Category" : "Add Category"}
            </Text>
            <TextInput
              value={nameInput}
              onChangeText={setNameInput}
              placeholder="Category Name"
              style={styles.input}
              editable={!editingCategory} // Lock name if editing
            />
            <TextInput
              value={limitInput}
              onChangeText={setLimitInput}
              placeholder="Limit"
              keyboardType="numeric"
              style={styles.input}
            />
            {editingCategory && (
              <View style={styles.sc}>
                <View>
                  <Text style={styles.modalSubTitle2}>Current color:</Text>
                </View>
                <View
                  style={[styles.colorBar, { backgroundColor: aselectedColor }]}
                ></View>
              </View>
            )}
            <Text style={styles.modalSubTitle}>Select a Color:</Text>
            <View style={styles.colorGrid}>
              {CATEGORY_COLORS.filter(
                (color) => !categoryList.some((cat) => cat.color === color)
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
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={submodalVisible}
        animationType="slide"
        onRequestClose={() => setSubModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent2}>
            <Text style={styles.modalTitle}>
              {editingSub ? "Edit Subscription" : "Add Subscription"}
            </Text>
            <TextInput
              value={subNameInput}
              onChangeText={setSubNameInput}
              placeholder="Subscription Name"
              style={styles.input}
              editable={!editingSub} // Lock name if editing
            />
            <TextInput
              value={subAmount}
              onChangeText={setSubAmount}
              placeholder="Amount"
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
            <TouchableOpacity style={styles.okBtn} onPress={handleSubSave}>
              <Text style={styles.okBtnText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Category;