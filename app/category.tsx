import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Modal, TextInput } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { MaterialIcons } from "@expo/vector-icons";
import styles from '../styles/category.styles';

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

  const handleSave = () => {
    if (!nameInput || !limitInput) return;
    // You can dispatch here to update Redux or backend
    setModalVisible(false);
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
      <Modal transparent={true} visible={modalVisible} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingCategory ? "Edit Category" : "Add Category"}</Text>
            <TextInput
              value={nameInput}
              onChangeText={setNameInput}
              placeholder="Category Name"
              style={styles.input}
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
