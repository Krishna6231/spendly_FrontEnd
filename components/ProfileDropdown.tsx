import { useState } from 'react';
import { View, TouchableOpacity, Text, Animated, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export const ProfileDropdown = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const router = useRouter();

  const toggleMenu = () => {
    if (showMenu) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start(() => setShowMenu(false));
    } else {
      setShowMenu(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleLogout = () => {
    setShowMenu(false);
    router.replace('/login');
  };

  return (
    <View style={{ position: 'absolute', top: 20, right: 20, zIndex: 10 }}>
      <TouchableOpacity
        style={styles.profileButton}
        onPress={toggleMenu}
      >
        <FontAwesome name="user" size={20} color="#fff" />
      </TouchableOpacity>

      {showMenu && (
        <Animated.View style={[styles.dropdownMenu, { opacity: fadeAnim }]}>
          <TouchableOpacity style={styles.dropdownItem}>
            <Text>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownItem}>
            <Text>Settings</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider} />

          <TouchableOpacity style={styles.dropdownItem} onPress={handleLogout}>
            <Text style={{ color: 'red' }}>Logout</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  profileButton: {
    width: 40,
    height: 40,
    backgroundColor: '#007bff',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 50,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    width: 150,
  },
  dropdownItem: {
    paddingVertical: 6,
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 6,
  },
});
