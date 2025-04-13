import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Animated,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { DashboardHeader } from '@/components/DashboardHeader';
import { PieChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

const screenWidth = Dimensions.get('window').width;

const expenseData = [
  { name: 'Food', amount: 1500, color: '#4caf50' },
  { name: 'Travel', amount: 1000, color: '#ff9800' },
  { name: 'Shopping', amount: 800, color: '#f44336' },
];

export default function Dashboard() {
  const router = useRouter();
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleLogout = async () => {
    try {
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      console.log("r",refreshToken);
      console.log('Logging out...');
  
      if (refreshToken) {
        await axios.post('http://192.168.0.101:3000/auth/logout', { refreshToken });
      }
  
      await SecureStore.deleteItemAsync('authToken');
      await SecureStore.deleteItemAsync('refreshToken');
      await SecureStore.deleteItemAsync('userData');
  
      console.log('All auth data deleted. Redirecting to login...');
      router.replace('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Logout Error', 'Something went wrong while logging out.');
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
            <TouchableOpacity onPress={handleLogout} style={styles.dropdownItem}>
              <Text style={[styles.dropdownText, { color: '#e53935' }]}>Logout</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Pie Chart */}
      <View style={{ alignItems: 'center', marginTop: 20 }}>
        <DashboardHeader />
        <PieChart
          data={expenseData.map(item => ({
            name: item.name,
            population: item.amount,
            color: item.color,
            legendFontColor: '#333',
            legendFontSize: 14,
          }))}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
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
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/add-expense')}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fdfdfd' },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
  },

  dropdown: {
    position: 'absolute',
    top: 50,
    right: 0,
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    shadowColor: '#000',
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
    color: '#333',
  },

  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 8,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#444',
  },

  categoryCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginTop: 30,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },

  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontWeight: 'bold',
    color: '#333',
  },

  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#007bff',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
});
