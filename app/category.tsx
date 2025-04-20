import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, Modal, TextInput, Alert } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { MaterialIcons } from "@expo/vector-icons";
import styles from "../styles/category.styles";
import * as SecureStore from "expo-secure-store";
import { addCategoryAsync, fetchExpensesAsync, editCategoryAsync } from "../redux/slices/expenseSlice";

interface CategoryItem {
  category: string;
  limit: number;
}

const Category = () => {
  const categoryList = useSelector((state: RootState) => state.expenses.categories) as CategoryItem[];
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [limitInput, setLimitInput] = useState("");
  const [user, setUser] = useState<any>(null);
  const dispatch = useDispatch<AppDispatch>();

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
    setModalVisible(true);
  };

  const openAddModal = () => {
    setEditingCategory(null);
    setNameInput("");
    setLimitInput("");
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!nameInput || !limitInput || !user?.id) {
      Alert.alert("Missing Fields", "Please fill in all fields.");
      return;
    }

    const payload = {
      user_id: user.id,
      category: nameInput,
      limit: parseFloat(limitInput),
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
        setEditingCategory(null);
        dispatch(fetchExpensesAsync(user.id)); // Refresh list
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
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={styles.heading}>Your Categories</Text>

      <FlatList
        data={categoryList}
        keyExtractor={(item) => item.category}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.textContainer}>
              <Text style={styles.name}>{item.category}</Text>
              <Text style={styles.limit}>₹{item.limit}</Text>
            </View>
            <TouchableOpacity style={styles.editIconContainer} onPress={() => openEditModal(item)}>
              <MaterialIcons name="edit" size={24} color="#555" />
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity style={styles.addBtn} onPress={openAddModal}>
        <Text style={styles.addBtnText}>Add Category</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal transparent={true} visible={modalVisible} animationType="slide"  onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingCategory ? "Edit Category" : "Add Category"}</Text>
            <TextInput
              value={nameInput}
              onChangeText={setNameInput}
              placeholder="Category Name"
              style={styles.input}
              editable={!editingCategory}
            />
            <TextInput
              value={limitInput}
              onChangeText={setLimitInput}
              placeholder="Limit"
              keyboardType="numeric"
              style={styles.input}
            />
            <TouchableOpacity style={styles.okBtn} onPress={handleSave}>
              <Text style={styles.okBtnText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Category;
