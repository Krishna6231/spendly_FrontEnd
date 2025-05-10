import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome,
} from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "expo-router";
import moment from "moment"; // Ensure moment is installed
import analyticsStyles from "@/styles/analytics.styles";
import { useTheme } from "../theme/ThemeContext";

const AnalyticsScreen = () => {
  const analytics = useSelector(
    (state: RootState) => state.analytics.analytics
  );
  const router = useRouter();

  const { theme } = useTheme();
  const isDark = theme === "dark";
  const styles = analyticsStyles(isDark);

  const last7Days = Array.from({ length: 7 }).map((_, i) =>
    moment()
      .subtract(6 - i, "days")
      .format("YYYY-MM-DD")
  );

  const last7DaysExpenses = last7Days.map((date) => {
    const expense = analytics.dailyExpenses.find((e: any) => e.date === date);
    return expense ? expense.amount : 0;
  });

  const last7DaysLabels = last7Days.map((date) => moment(date).format("ddd"));

  return (
    <>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons
          name="arrow-back"
          size={24}
          color={isDark ? "white" : "#4b5563"}
        />
      </TouchableOpacity>
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
            <MaterialCommunityIcons
              name="cash-multiple"
              size={24}
              color="#fff"
            />
            <Text style={styles.cardTitle}>Total Spent</Text>
            <Text style={styles.cardAmount}>₹{analytics.totalSpent}</Text>
            <Text style={styles.cardSubtext}>overall</Text>
          </View>

          {/* Highest Category Card */}
          <View style={[styles.card, styles.cardRed, styles.halfWidthCard]}>
            <Ionicons name="fast-food" size={24} color="#fff" />
            <Text style={styles.cardTitle}>Top Category</Text>
            <Text style={styles.cardAmount}>
              {analytics.topCategory.category}
            </Text>
            <Text style={styles.cardSubtext}>
              ₹{analytics.topCategory.amount}
            </Text>
          </View>
        </View>

        <View style={styles.cardRow}>
          {/* Average Spend Card */}
          <View style={[styles.card, styles.cardBlue, styles.halfWidthCard]}>
            <FontAwesome name="bar-chart" size={20} color="#fff" />
            <Text style={styles.cardTitle}>Daily Average</Text>
            <Text style={styles.cardAmount}>
              ₹{analytics.averageDailyExpense}
            </Text>
          </View>

          {/* Money Saved Card */}
          <View style={[styles.card, styles.cardGreen, styles.halfWidthCard]}>
            <MaterialCommunityIcons name="basket" size={24} color="#fff" />
            <Text style={styles.cardTitle}>Least Category</Text>
            <Text style={styles.cardAmount}>
              {analytics.leastCategory.category}
            </Text>
            <Text style={styles.cardSubtext}>
              ₹{analytics.leastCategory.amount}
            </Text>
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
                  color: (opacity = 1) =>
                    isDark
                      ? `rgba(130, 177, 255, ${opacity})`
                      : `rgba(75, 123, 236, ${opacity})`, // blue for both themes
                  strokeWidth: 2,
                },
              ],
            }}
            width={Dimensions.get("window").width - 40}
            height={220}
            chartConfig={{
              backgroundColor: isDark ? "#1e1e1e" : "#ffffff",
              backgroundGradientFrom: isDark ? "#1e1e1e" : "#ffffff",
              backgroundGradientTo: isDark ? "#1e1e1e" : "#ffffff",
              decimalPlaces: 0,
              color: (opacity = 1) =>
                isDark
                  ? `rgba(255, 255, 255, ${opacity})`
                  : `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) =>
                isDark
                  ? `rgba(255, 255, 255, ${opacity})`
                  : `rgba(0, 0, 0, ${opacity})`,
              propsForDots: {
                r: "3",
                strokeWidth: "2",
                stroke: isDark ? "#82b1ff" : "#4b7bec", // lighter blue in dark mode
              },
              propsForLabels: {
                dx: -5,
              },
              fillShadowGradientFrom: isDark ? "#82b1ff" : "#4b7bec", // top color
              fillShadowGradientTo: isDark ? "#1e1e1e" : "#ffffff", // bottom color
              fillShadowGradientFromOpacity: 0.3,
              fillShadowGradientToOpacity: 0.05,
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
              marginLeft: -15,
            }}
            withVerticalLines={false}
            withHorizontalLines={true}
            withHorizontalLabels={true}
            withVerticalLabels={true}
            yAxisInterval={1}
            xLabelsOffset={-5}
          />

          {/* Insights */}
          <View style={styles.insightContainer}>
            <Text style={styles.insightText}>
              <Text style={{ fontWeight: "bold" }}>Peak spending:</Text> ₹
              {Math.max(...last7DaysExpenses)} on{" "}
              {
                last7DaysLabels[
                  last7DaysExpenses.indexOf(Math.max(...last7DaysExpenses))
                ]
              }
            </Text>
            <Text style={styles.insightText}>
              <Text style={{ fontWeight: "bold" }}>Total:</Text> ₹
              {last7DaysExpenses.reduce((a, b) => a + b, 0)} this week
            </Text>
          </View>
        </View>

        {/* <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Top Categories This Month</Text>
          <ChartWithNavigation/>
        </View>  */}
      </ScrollView>
    </>
  );
};

export default AnalyticsScreen;
