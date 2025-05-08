import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Ionicons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import HorizontalBarChart from '@/components/VerticalBarChart';
import VerticalBarChart from '@/components/VerticalBarChart';

const AnalyticsScreen = () => {
  // Sample data - replace with your actual data
  const last7DaysExpenses = [120, 190, 150, 210, 180, 250, 200];
  const last7DaysLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const monthlyData = {
    totalSpent: 3250,
    highestCategory: { name: 'Food', amount: 1200 },
    avgDailySpend: 150,
    moneySaved: 450,
  };

  const spendingTrend = 12; // % increase

  return (
    <ScrollView style={styles.container}>
      {/* Header */}

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Spending Analytics</Text>
        <Ionicons name="analytics" size={24} color="#4b7bec" />
      </View>

      {/* Highlight Cards - 2 rows with 2 cards each */}
      <View style={styles.cardRow}>
        {/* Total Spent Card */}
        <View style={[styles.card, styles.cardPurple, styles.halfWidthCard]}>
          <MaterialCommunityIcons name="cash-multiple" size={24} color="#fff" />
          <Text style={styles.cardTitle}>Total Spent</Text>
          <Text style={styles.cardAmount}>₹{monthlyData.totalSpent}</Text>
          <Text style={styles.cardSubtext}>this month</Text>
        </View>

        {/* Highest Category Card */}
        <View style={[styles.card, styles.cardRed, styles.halfWidthCard]}>
          <Ionicons name="fast-food" size={24} color="#fff" />
          <Text style={styles.cardTitle}>Top Category</Text>
          <Text style={styles.cardAmount}>{monthlyData.highestCategory.name}</Text>
          <Text style={styles.cardSubtext}>₹{monthlyData.highestCategory.amount}</Text>
        </View>
      </View>

      <View style={styles.cardRow}>
        {/* Average Spend Card */}
        <View style={[styles.card, styles.cardBlue, styles.halfWidthCard]}>
          <FontAwesome name="bar-chart" size={20} color="#fff" />
          <Text style={styles.cardTitle}>Daily Average</Text>
          <Text style={styles.cardAmount}>₹{monthlyData.avgDailySpend}</Text>
          <Text style={[
            styles.cardTrend,
            { color: spendingTrend >= 0 ? '#ff4757' : '#2ed573' }
          ]}>
            {spendingTrend >= 0 ? '↑' : '↓'} {Math.abs(spendingTrend)}%
          </Text>
        </View>

        {/* Money Saved Card */}
        <View style={[styles.card, styles.cardGreen, styles.halfWidthCard]}>
          <MaterialCommunityIcons name="piggy-bank" size={24} color="#fff" />
          <Text style={styles.cardTitle}>Money Saved</Text>
          <Text style={styles.cardAmount}>₹{monthlyData.moneySaved}</Text>
          <Text style={styles.cardSubtext}>vs your budget</Text>
        </View>
      </View>

      {/* Weekly Spending Line Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>Last 7 Days Spending</Text>
        <LineChart
          data={{
            labels: last7DaysLabels,
            datasets: [
              {
                data: last7DaysExpenses,
                color: (opacity = 1) => `rgba(75, 123, 236, ${opacity})`,
                strokeWidth: 2
              }
            ]
          }}
          width={Dimensions.get('window').width - 40} // Adjusted width
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            propsForDots: {
              r: '4',
              strokeWidth: '2',
              stroke: '#4b7bec'
            },
            propsForLabels: {
              dx: -5 // Adjust label positioning
            }
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
            marginLeft: -15 // Pull chart slightly left
          }}
          withVerticalLines={false}
          withHorizontalLines={true}
          withHorizontalLabels={true}
          withVerticalLabels={true}
          yAxisInterval={1}
          xLabelsOffset={-5} // Adjust X-axis labels
        />

        {/* Insights */}
        <View style={styles.insightContainer}>
          <Text style={styles.insightText}>
            <Text style={{ fontWeight: 'bold' }}>Peak spending:</Text> ₹{Math.max(...last7DaysExpenses)} on {last7DaysLabels[last7DaysExpenses.indexOf(Math.max(...last7DaysExpenses))]}
          </Text>
          <Text style={styles.insightText}>
            <Text style={{ fontWeight: 'bold' }}>Total:</Text> ₹{last7DaysExpenses.reduce((a, b) => a + b, 0)} this week
          </Text>
        </View>

        



      </View>
      {/* Monthly Category Spend Bar Chart */}
      <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Top Categories This Month</Text>
          <VerticalBarChart
            data={[
              { name: 'Food', amount: 1200, color: '#ff7675' },
              { name: 'Transport', amount: 800, color: '#74b9ff' },
              { name: 'Shopping', amount: 650, color: '#55efc4' },
              { name: 'Bills', amount: 400, color: '#a29bfe' },
              { name: 'Entertainment', amount: 200, color: '#fab1a0' }
            ]}
          />

        </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2f3542'
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  card: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  halfWidthCard: {
    width: Dimensions.get('window').width / 2 - 20, // Half screen minus margins
  },
  cardPurple: {
    backgroundColor: '#6c5ce7'
  },
  cardRed: {
    backgroundColor: '#ff7675'
  },
  cardBlue: {
    backgroundColor: '#74b9ff'
  },
  cardGreen: {
    backgroundColor: '#00b386'
  },
  cardTitle: {
    color: '#fff',
    fontSize: 14,
    marginTop: 8,
    opacity: 0.9
  },
  cardAmount: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 4
  },
  cardSubtext: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
    opacity: 0.8
  },
  cardTrend: {
    position: 'absolute',
    top: 12,
    right: 12,
    fontSize: 12,
    fontWeight: 'bold'
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#2f3542'
  },
  insightContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#dfe6e9'
  },
  insightText: {
    fontSize: 14,
    color: '#636e72',
    marginBottom: 8
  }
});

export default AnalyticsScreen;