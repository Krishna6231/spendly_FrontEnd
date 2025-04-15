import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Modal, TextInput, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store"; // adjust if your path is different
import { MaterialIcons } from "@expo/vector-icons";

const Category = () => {
  const categoryNames = useSelector((state: RootState) => state.expenses.categories);

  // Generate fake limits for display
  const [limits, setLimits] = useState<{ [key: string]: number }>(() => {
    const initialLimits: { [key: string]: number } = {};
    categoryNames.forEach((cat) => {
      initialLimits[cat] = Math.floor(Math.random() * 2000) + 500;
    });
    return initialLimits;
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [limitInput, setLimitInput] = useState("");

  const openEditModal = (category: string) => {
    setEditingCategory(category);
    setNameInput(category);
    setLimitInput(limits[category]?.toString() || "0");
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
    const newLimit = parseInt(limitInput);

    if (editingCategory) {
      // editing existing
      const updated = { ...limits };
      delete updated[editingCategory];
      updated[nameInput] = newLimit;
      setLimits(updated);
    } else {
      // adding new
      setLimits((prev) => ({
        ...prev,
        [nameInput]: newLimit,
      }));
    }

    setModalVisible(false);
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
    <Text style={styles.heading}>Your Categories</Text>
      <FlatList
        data={categoryNames}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item}</Text>
            <Text style={styles.limit}>₹{limits[item] ?? 0}</Text>
            <TouchableOpacity onPress={() => openEditModal(item)}>
              <MaterialIcons name="edit" size={20} color="#555" />
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

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f5f5f5",
    borderColor: "#987aaa",
    borderWidth: 1,
    padding: 18,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    justifyContent: "space-between",
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    marginVertical: 16,
    color: "#333",
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
  },
  limit: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 12,
  },
  addBtn: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  addBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  okBtn: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  okBtnText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default Category;
