import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import Svg, { G, Rect, Text as SvgText, Line } from "react-native-svg";
import { useTheme } from "../theme/ThemeContext";
import AntDesign from "@expo/vector-icons/AntDesign";

const { width: screenWidth } = Dimensions.get("window");
const chartHeight = 220;
const topPadding = 20;
const xAxisHeight = 60;
const yAxisLabelWidth = 40;
const numTicks = 5;

type BarData = {
  name: string;
  amount: number;
  color: string;
};

<<<<<<< HEAD
=======
type MonthData = {
  [key: string]: BarData[];
};

// Dummy data for several months
const dataForMonths: MonthData = {
  April: [
    { name: "Food", amount: 1200, color: "#ff7675" },
    { name: "Transport", amount: 800, color: "#74b9ff" },
    { name: "Shopping", amount: 650, color: "#55efc4" },
    { name: "Bills", amount: 400, color: "#a29bfe" },
    { name: "Entertainment", amount: 200, color: "#fab1a0" },
    { name: "Medicine", amount: 200, color: "#aabfa0" },
    { name: "Drinks", amount: 300, color: "#aabfa9" },
    { name: "Cigar", amount: 30, color: "#aabf19" },
    { name: "Drinks", amount: 300, color: "#11bfa9" },
  ],
  March: [
    { name: "Food", amount: 1500, color: "#e74c3c" },
    { name: "Bills", amount: 600, color: "#9b59b6" },
    { name: "Transport", amount: 1000, color: "#3498db" },
  ],
  February: [
    { name: "Shopping", amount: 400, color: "#2ecc71" },
    { name: "Entertainment", amount: 350, color: "#f39c12" },
    { name: "Transport", amount: 300, color: "#16a085" },
    { name: "Medicine", amount: 250, color: "#f1c40f" },
  ],
  January: [
    { name: "Food", amount: 1800, color: "#9b59b6" },
    { name: "Bills", amount: 700, color: "#ff6347" },
    { name: "Shopping", amount: 1000, color: "#ff99cc" },
  ],
};

>>>>>>> e3825ad4bb63dc2a97f23441cc2cc67d1ece6f05
type Props = {
  data: BarData[];
};

const VerticalBarChart: React.FC<Props> = ({ data }) => {
<<<<<<< HEAD
  const maxAmount = Math.max(...data.map(item => item.amount));
  const barWidth = 30;
  const spacing = 30;
  const xAxisHeight = 20;
  const yAxisLabelWidth = 30;
  const numTicks = 4;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Category Breakdown</Text>
      <Svg width={chartWidth} height={chartHeight + xAxisHeight}>
        {/* Y-Axis Lines and Labels */}
        {Array.from({ length: numTicks + 1 }).map((_, i) => {
          const y = (chartHeight / numTicks) * i;
          const value = Math.round(maxAmount - (maxAmount / numTicks) * i);

          return (
            <G key={i}>
              <SvgText
                x={0}
                y={y + 5}
                fontSize="10"
                fill="#636e72"
              >
                ₹{value}
              </SvgText>
              <Line
                x1={yAxisLabelWidth}
                y1={y}
                x2={chartWidth}
                y2={y}
                stroke="#dfe6e9"
                strokeWidth="1"
              />
            </G>
          );
        })}

        {/* Bars */}
        {data.map((item, index) => {
          const x = yAxisLabelWidth + index * (barWidth + spacing);
          const barHeight = (item.amount / maxAmount) * chartHeight;
          const y = chartHeight - barHeight;

          return (
            <G key={index}>
              <Rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={item.color}
                rx={4}
              />
              {/* Value on top of bar */}
              <SvgText
                x={x + barWidth / 2}
                y={y - 6}
                fontSize="10"
                fill="#2d3436"
                textAnchor="middle"
              >
                ₹{item.amount}
              </SvgText>
              {/* X-Axis category name */}
              <SvgText
                x={x + barWidth / 2}
                y={chartHeight + 14}
                fontSize="10"
                fill="#636e72"
                textAnchor="middle"
              >
                {item.name}
              </SvgText>
            </G>
          );
        })}
=======
  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (!data || data.length === 0) return null;

  const maxAmount = Math.max(...data.map((item) => item.amount), 1);
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  const totalUsableWidth = screenWidth - 5 * 16 - yAxisLabelWidth; // Space left for bars
  const minBarWidth = 15;
  const maxBarWidth = 40;
  const maxBarsToFit = 12;

  const dynamicBarWidth = Math.max(
    minBarWidth,
    Math.min(
      maxBarWidth,
      ((maxBarsToFit - data.length) / (maxBarsToFit - 1)) *
        (maxBarWidth - minBarWidth) +
        minBarWidth
    )
  );

  const spacing =
    (totalUsableWidth - dynamicBarWidth * data.length) / (data.length + 1); // Add spacing between bars
  const svgHeight = chartHeight + xAxisHeight + topPadding;

  const axisColor = isDark ? "#636e72" : "#636e72";
  const textColor = isDark ? "#dfe6e9" : "#2d3436";
  const lineColor = isDark ? "#444" : "#dfe6e9";
  const backgroundColor = isDark ? "#1e272e" : "#fff";

  return (
    <View style={[styles.container, { backgroundColor }]}>

      <Svg width={screenWidth - 80} height={svgHeight}>
        <G y={topPadding}>
          {/* Y-axis lines and labels */}
          {Array.from({ length: numTicks + 1 }).map((_, i) => {
            const y = (chartHeight / numTicks) * i;
            const value = Math.round(maxAmount - (maxAmount / numTicks) * i);

            return (
              <G key={i}>
                <SvgText
                  x={yAxisLabelWidth - 10}
                  y={y + 5}
                  fontSize="10"
                  fill={axisColor}
                  textAnchor="end"
                >
                  {formatCurrency(value)}
                </SvgText>
                <Line
                  x1={yAxisLabelWidth}
                  y1={y}
                  x2={screenWidth - 32}
                  y2={y}
                  stroke={lineColor}
                  strokeWidth="1"
                />
              </G>
            );
          })}

          {/* Bars and Labels */}
          {data.map((item, index) => {
            const x =
              yAxisLabelWidth + spacing + index * (dynamicBarWidth + spacing); // Equally distribute
            const barHeight = (item.amount / maxAmount) * chartHeight;
            const y = chartHeight - barHeight;

            return (
              <G key={index}>
                <Rect
                  x={x}
                  y={y}
                  width={dynamicBarWidth}
                  height={barHeight}
                  fill={item.color}
                />
                <SvgText
                  x={x + dynamicBarWidth / 2}
                  y={y - 6}
                  fontSize="10"
                  fill={textColor}
                  textAnchor="middle"
                >
                  {formatCurrency(item.amount)}
                </SvgText>
                <SvgText
                  x={x + dynamicBarWidth / 1.5}
                  y={chartHeight + 15}
                  fontSize="10"
                  fill={axisColor}
                  textAnchor="end"
                  transform={`rotate(-45, ${x + dynamicBarWidth / 2}, ${
                    chartHeight + 15
                  })`}
                >
                  {item.name}
                </SvgText>
              </G>
            );
          })}
        </G>
>>>>>>> e3825ad4bb63dc2a97f23441cc2cc67d1ece6f05
      </Svg>
    </View>
  );
};

<<<<<<< HEAD
const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 16,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 20,
    color: '#2f3542',
  },
});

export default VerticalBarChart;
=======
const ChartWithNavigation: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState<string>("April");
  const [transition] = useState(new Animated.Value(1)); // Start visible
  const [direction, setDirection] = useState<"left" | "right">("right"); // Track animation direction
  const firstRender = React.useRef(true); // Track initial render

  const navigateToPreviousMonth = () => {
    const months = Object.keys(dataForMonths);
    const currentIndex = months.indexOf(currentMonth);
    const prevMonth =
      months[(currentIndex - 1 + months.length) % months.length];
    setDirection("left"); // Animation from left
    setCurrentMonth(prevMonth);
    animateChartTransition();
  };

  const navigateToNextMonth = () => {
    const months = Object.keys(dataForMonths);
    const currentIndex = months.indexOf(currentMonth);
    const nextMonth = months[(currentIndex + 1) % months.length];
    setDirection("right"); // Animation from right
    setCurrentMonth(nextMonth);
    animateChartTransition();
  };

  const animateChartTransition = () => {
    firstRender.current = false;
    transition.setValue(0); // Reset to start
    Animated.timing(transition, {
      toValue: 1, // Animate to 1 (fully visible)
      duration: 100, // Duration of the animation (in milliseconds)
      easing: Easing.linear, // Use a linear easing function for a smooth transition
      useNativeDriver: true, // Enable hardware acceleration for better performance
    }).start();
  };

  const currentData = dataForMonths[currentMonth];
  const currentMonthDisplay = `${currentMonth.slice(0, 3)}'25`;

  return (
    <View style={{ alignItems: "center", marginTop: 20 }}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={navigateToPreviousMonth}>
          <AntDesign name="left" size={22} color="white" />
        </TouchableOpacity>
        <Text style={styles.heading}>{currentMonthDisplay}</Text>
        <TouchableOpacity onPress={navigateToNextMonth}>
          <AntDesign name="right" size={22} color="white" />
        </TouchableOpacity>
      </View>

      {firstRender.current ? (
        <VerticalBarChart data={currentData} />
      ) : (
        <Animated.View
          style={{
            opacity: transition,
            transform: [
              {
                translateX: transition.interpolate({
                  inputRange: [0, 1],
                  outputRange: direction === "right" ? [200, 0] : [-200, 0], // Adjust direction
                }),
              },
            ],
          }}
        >
          <VerticalBarChart data={currentData} />
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  headerContainer: {
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: screenWidth - 60,
  },
  arrow: {
    fontSize: 24,
    color: "#2d3436",
  },
});

export default ChartWithNavigation;
>>>>>>> e3825ad4bb63dc2a97f23441cc2cc67d1ece6f05
