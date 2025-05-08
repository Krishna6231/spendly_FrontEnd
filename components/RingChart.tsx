import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import Svg, { G, Circle, Path } from 'react-native-svg';

type ChartData = {
  key: string;
  value: number;
  color: string;
};

type Props = {
  data: ChartData[];
  size?: number;
  strokeWidth?: number;
  onSegmentPress?: (index: number, item: ChartData) => void;
};

const polarToCartesian = (
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};

const describeArc = (
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number
) => {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return [
    'M', start.x, start.y,
    'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y
  ].join(' ');
};

const MemoizedPath = React.memo(({
  path,
  color,
  strokeWidth,
  opacity,
  onPress
}: {
  path: string;
  color: string;
  strokeWidth: number;
  opacity: number;
  onPress: () => void;
}) => (
  <Path
    d={path}
    stroke={color}
    strokeWidth={strokeWidth}
    fill="none"
    strokeLinecap="butt"
    opacity={opacity}
    onPress={onPress}
  />
));

const RingChart: React.FC<Props> = ({ 
  data, 
  size = 220, 
  strokeWidth = 60, // Increased thickness
  onSegmentPress 
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Pre-calculate all expensive computations
  const { total, radius, center, chartSegments } = useMemo(() => {
    const totalValue = data.reduce((sum, d) => sum + d.value, 0);
    const chartRadius = (size - strokeWidth) / 2.5;
    const chartCenter = size / 2;
    
    let cumulativeAngle = 0;
    const segments = data.map((item) => {
      const valueAngle = (item.value / totalValue) * 360;
      const startAngle = cumulativeAngle;
      const endAngle = cumulativeAngle + valueAngle;
      cumulativeAngle += valueAngle;
      return {
        ...item,
        path: describeArc(0, 0, chartRadius, startAngle, endAngle),
      };
    });

    return {
      total: totalValue,
      radius: chartRadius,
      center: chartCenter,
      chartSegments: segments
    };
  }, [data, size, strokeWidth]);

  useEffect(() => {
    // Simulate loading for complex charts
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#00bcd4" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Pressable
        onPressIn={() => setActiveIndex(null)}
        style={styles.chartContainer}
      >
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <G x={center} y={center}>
            <Circle
              cx={0}
              cy={0}
              r={radius}
              stroke="#f0f0f0"
              strokeWidth={strokeWidth}
              fill="transparent"
            />

            {chartSegments.map((seg, index) => (
              <MemoizedPath
                key={`${index}-${seg.key}`}
                path={seg.path}
                color={seg.color}
                strokeWidth={strokeWidth}
                opacity={activeIndex === null || activeIndex === index ? 1 : 0.5}
                onPress={() => {
                  setActiveIndex(prev => prev === index ? null : index);
                  onSegmentPress?.(index, seg);
                }}
              />
            ))}

            <Circle
              cx={0}
              cy={0}
              r={radius - strokeWidth / 2}
              fill="white"
            />
          </G>
        </Svg>
      </Pressable>

      {activeIndex !== null && (
        <View style={styles.categoryContainer}>
          <View style={[styles.colorIndicator, { backgroundColor: data[activeIndex].color }]} />
          <Text style={styles.categoryText}>
            {data[activeIndex].key}: {Math.round(data[activeIndex].value / total * 100)}%
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  loadingContainer: {
    height: 300,
    justifyContent: 'center',
  },
  chartContainer: {
    position: 'relative',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  colorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default React.memo(RingChart);