import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { G, Rect, Text as SvgText, Line } from 'react-native-svg';

const { width } = Dimensions.get('window');
const chartWidth = width - 40;
const chartHeight = 220;

type BarData = {
  name: string;
  amount: number;
  color: string;
};

type Props = {
  data: BarData[];
};

const VerticalBarChart: React.FC<Props> = ({ data }) => {
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
      </Svg>
    </View>
  );
};

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
