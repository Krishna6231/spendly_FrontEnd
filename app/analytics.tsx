import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { PieChart, LineChart, BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const AnalyticsScreen = () => {
  // Sample data
  const highlightCards = [
    { id: 1, label: "Most Spent On", value: "Food 🍔", amount: "₹5,000", icon: "🏆" },
    { id: 2, label: "Total Spent", value: "₹15,000", icon: "💸" },
    { id: 3, label: "Biggest Day", value: "21st April", icon: "📅" }
  ];

  const pieData = [
    { name: "Food", amount: 5000, color: "#FF9AA2", legendFontColor: "#7F7F7F" },
    { name: "Travel", amount: 3750, color: "#FFB7B2", legendFontColor: "#7F7F7F" },
    { name: "Shopping", amount: 2500, color: "#FFDAC1", legendFontColor: "#7F7F7F" },
    { name: "Others", amount: 1250, color: "#E2F0CB", legendFontColor: "#7F7F7F" }
  ];

  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr"],
    datasets: [
      {
        data: [3000, 4500, 2800, 1500],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 2
      }
    ]
  };

  const barData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [500, 300, 800, 600, 1200, 2000, 1800]
      }
    ]
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Analytics</Text>

      {/* Highlight Cards */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardContainer}>
        {highlightCards.map(card => (
          <TouchableOpacity key={card.id} style={styles.card}>
            <Text style={styles.cardIcon}>{card.icon}</Text>
            <Text style={styles.cardLabel}>{card.label}</Text>
            <Text style={styles.cardValue}>{card.value}</Text>
            {card.amount && <Text style={styles.cardAmount}>{card.amount}</Text>}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Pie Chart */}
      {/* <Text style={styles.sectionTitle}>Spending Breakdown</Text>
      <PieChart
        data={pieData}
        width={screenWidth - 40}
        height={220}
        chartConfig={{
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor="amount"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
        style={styles.chart}
      /> */}

      {/* Line Chart */}
      <Text style={styles.sectionTitle}>Monthly Spending Trend</Text>
      <LineChart
        data={lineData}
        width={screenWidth - 20}
        height={220}
        chartConfig={{
          backgroundColor: "#ffffff",
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16
          },
          propsForDots: {
            r: "4",
            strokeWidth: "2",
            stroke: "#8641f4"
          }
        }}
        bezier
        style={styles.chart}
      />
      <Text style={styles.insightText}>You spent 10% less than last month.</Text>

      {/* Bar Chart */}
      <Text style={styles.sectionTitle}>Daily Spending</Text>
      <BarChart
        data={barData}
        width={screenWidth - 20}
        height={220}
        fromZero
        chartConfig={{
          backgroundColor: "#ffffff",
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          barPercentage: 0.5,
          propsForBackgroundLines: {
            strokeDasharray: "",
            stroke: "#e0e0e0"
          }
        }}
        style={styles.chart}
      />

      {/* Insights */}
      <View style={styles.insightsContainer}>
        <Text style={styles.insightText}>You spend most on weekends 🎉</Text>
        <Text style={styles.insightText}>Your calmest day was Tuesday — only ₹100 spent!</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3748',
    textAlign: 'center',
    marginBottom: 20,
  },
  cardContainer: {
    marginBottom: 30,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: 160,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardIcon: {
    fontSize: 24,
    marginBottom: 10,
  },
  cardLabel: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 5,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  cardAmount: {
    fontSize: 16,
    color: '#4A5568',
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 15,
    marginLeft: 10,
  },
  chart: {
    borderRadius: 16,
    marginBottom: 30,
  },
  insightsContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  insightText: {
    fontSize: 16,
    color: '#4A5568',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default AnalyticsScreen;