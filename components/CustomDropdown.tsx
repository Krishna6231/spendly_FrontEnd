import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { FlatList } from "react-native-gesture-handler";
import { useTheme } from "@/theme/ThemeContext";

type DropdownItem = {
  label: string;
  value: string;
};

type CustomDropdownProps = {
  items: DropdownItem[];
  selectedValue: string | null;
  onSelect: (value: string) => void;
};

const SCREEN_WIDTH = Dimensions.get("window").width;

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  items,
  selectedValue,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const animatedHeight = useRef(new Animated.Value(0)).current;

  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const styles = CDDstyles(isDark);

  const toggleDropdown = () => {
    if (isOpen) {
      Animated.timing(animatedHeight, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setIsOpen(false));
    } else {
      setIsOpen(true);
      Animated.timing(animatedHeight, {
        toValue: 200, // Fixed dropdown height
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleSelect = (item: DropdownItem) => {
    onSelect(item.value);
    toggleDropdown();
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={styles.selector} onPress={toggleDropdown}>
        <Text style={{color: isDark ? "white" : "black",}}>{selectedValue || "Select a category"}</Text>
        <AntDesign name={isOpen ? "up" : "down"} size={16} color={isDark ? "white" : "black"}/>
      </TouchableOpacity>

      {isOpen && (
        <Animated.View style={[styles.dropdown, { height: animatedHeight }]}>
        <FlatList
          data={items}
          keyExtractor={(item) => item.value}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => handleSelect(item)}
            >
              <Text style={{color: isDark ? "white" : "black",}}>{item.label}</Text>
            </TouchableOpacity>
          )}
          nestedScrollEnabled
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{ flexGrow: 1 }}
          style={{ maxHeight: 200 }}
        />
      </Animated.View>
      )}
    </View>
  );
};

const CDDstyles = (isDark : boolean) => StyleSheet.create({
  wrapper: {
    marginBottom: 10,
    zIndex: 10,
    color: isDark ? "white" : "black",
  },
  selector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: isDark ? "#475569" : "#ccc",
    borderRadius: 8,
    backgroundColor: isDark ? "transparent" : "#fff",
    color: isDark ? "white" : "black",
  },
  dropdown: {
    position: "absolute",
    top: 50, // adjust based on your selector height
    width: "100%",
    backgroundColor: isDark ? "#11151e" : "#fff",
    borderWidth: 1,
    color: isDark ? "white" : "black",
    borderColor: isDark ? "#475569" : "#ccc",
    borderRadius: 8,
    overflow: "hidden",
    zIndex: 1000,
  },
  item: {
    padding: 12,
    color: isDark ? "white" : "black",
    borderBottomWidth: 1,
    borderBottomColor: isDark ? "#333" : "#eee",
  },
});

export default CustomDropdown;
