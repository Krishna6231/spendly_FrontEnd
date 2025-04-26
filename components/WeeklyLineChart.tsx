import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

interface WeeklyLineChartProps {
  // title?: string;
  expenseData: number[];
}

const WeeklyLineChart: React.FC<WeeklyLineChartProps> = ({ expenseData }) => {
  
  // Function to get last 7 days labels
  const getLast7Days = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(i === 0 ? 'Today' : days[date.getDay()]);
    }
    return dates;
  };

  return (
    <View style={{ marginVertical: 16 }}>
      {/* <Text style={{
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
        paddingHorizontal: 16,
      }}>
      </Text> */}

      <LineChart
        data={{
          labels: getLast7Days(),
          datasets: [
            {
              data: expenseData,
              color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // Line color
              strokeWidth: 2,
            }
          ]
        }}
        width={screenWidth - 28}
        height={240}
        yAxisLabel="₹"
        yLabelsOffset={10}
        xLabelsOffset={-5}
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '2',
            strokeWidth: '1',
            stroke: '#8641f4',
          }
        }}
        bezier
        style={{
          borderRadius: 16,
          alignSelf: 'center',
          marginTop: 10,
        }}
        withVerticalLines={false}
        withHorizontalLines={true}
        withHorizontalLabels={true}
        withVerticalLabels={true}
      />
    </View>
  );
};

export default WeeklyLineChart;
