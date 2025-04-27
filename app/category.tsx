import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, Modal, TextInput, Alert } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { MaterialIcons } from "@expo/vector-icons";
import styles from "../styles/category.styles";
import * as SecureStore from "expo-secure-store";
import { addCategoryAsync, fetchExpensesAsync, editCategoryAsync } from "../redux/slices/expenseSlice";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";

const CATEGORY_COLORS = [
  "#FF5722", "#3F51B5", "#4CAF50", "#E91E63",
  "#8BC34A", "#9C27B0", "#FF9800", "#2196F3",
  "#673AB7", "#03A9F4", "#F44336",
];

interface CategoryItem {
  category: string;
  limit: number;
  color: string;
}

const Category = () => {
  const categoryList = useSelector((state: RootState) => state.expenses.categories) as CategoryItem[];
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [limitInput, setLimitInput] = useState("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [user, setUser] = useState<any>(null);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

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
    setModalVisible(true);
  };

  const openAddModal = () => {
    setEditingCategory(null);
    setNameInput("");
    setLimitInput("");
    setSelectedColor("");
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!nameInput || !limitInput || !selectedColor || !user?.id) {
      Alert.alert("Missing Fields", "Please fill in all fields including color.");
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
    <View style={{ flex: 1, padding: 16 }}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>Your Categories</Text>

      <FlatList
        data={categoryList}
        keyExtractor={(item) => item.category}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.textContainer}>
              <View style={[styles.colorIndicator, { backgroundColor: item.color }]} />
              <View>
                <Text style={styles.name}>{item.category}</Text>
                <Text style={styles.limit}>₹{item.limit}</Text>
              </View>
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
      <Modal transparent={true} visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingCategory ? "Edit Category" : "Add Category"}</Text>
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

            <Text style={styles.modalSubTitle}>Select a Color:</Text>

            {editingCategory ? (
              // If editing, just SHOW color — no selection
              <View style={styles.editColorPreviewContainer}>
                <View style={[styles.colorPreviewCircle, { backgroundColor: selectedColor }]} />
              </View>
            ) : (
              // If adding, ALLOW color selection
              <View style={styles.colorGrid}>
                {CATEGORY_COLORS.filter(color => !categoryList.some(cat => cat.color === color))
                  .map((color) => (
                    <TouchableOpacity
                      key={color}
                      style={[
                        styles.colorCircle,
                        { backgroundColor: color, borderWidth: selectedColor === color ? 2 : 0 }
                      ]}
                      onPress={() => setSelectedColor(color)}
                    />
                ))}
              </View>
            )}

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
