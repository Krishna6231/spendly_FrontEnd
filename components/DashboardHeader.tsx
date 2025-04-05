import { View, Text } from 'react-native';

export const DashboardHeader = () => (
  <View style={{ marginBottom: 16 }}>
    <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Welcome, Vivek</Text>
    <Text style={{ fontSize: 16, marginTop: 4 }}>Total Spent: ₹2,500</Text>
  </View>
);