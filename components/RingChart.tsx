import RingStyles from "@/styles/ringchart.styles";
import { useTheme } from "@/context/ThemeContext";
import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from "react-native";
import Svg, { G, Circle, Path } from "react-native-svg";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const AnimatedPath = Animated.createAnimatedComponent(Path);

const screenWidth = Dimensions.get("window").width;

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
  if (startAngle === 0 && endAngle === 360) {
    return `M ${x},${y} m ${radius}, 0 a ${radius},${radius} 0 1,0 -${
      2 * radius
    },0 a ${radius},${radius} 0 1,0 ${2 * radius},0`;
  }
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
  ].join(" ");
};

const MemoizedPath = React.memo(
  ({
    path,
    color,
    strokeWidth,
    opacity,
    onPress,
    accessibilityLabel,
  }: {
    path: string;
    color: string;
    strokeWidth: number;
    opacity: number;
    onPress: () => void;
    accessibilityLabel: string;
  }) => {
    const animatedStrokeWidth = useSharedValue(strokeWidth);
    const animatedOpacity = useSharedValue(opacity);

    useEffect(() => {
      animatedStrokeWidth.value = withTiming(strokeWidth, { duration: 300 });
      animatedOpacity.value = withTiming(opacity, { duration: 300 });
    }, [strokeWidth, opacity]);

    const animatedProps = useAnimatedProps(() => ({
      strokeWidth: animatedStrokeWidth.value,
      opacity: animatedOpacity.value,
    }));

    return (
      <AnimatedPath
        d={path}
        stroke={color}
        fill="none"
        strokeLinecap="butt"
        animatedProps={animatedProps}
        onPress={onPress}
        accessible
        accessibilityLabel={accessibilityLabel}
      />
    );
  }
);

const RingChart: React.FC<Props> = ({
  data,
  size = 220,
  strokeWidth = 60,
  onSegmentPress,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const listRef = useRef<FlatList>(null);

  const { theme } = useTheme();
  const isDark = theme === "dark";
  const styles = RingStyles(isDark);

  useEffect(() => {
    if (data.length > 0) {
      setIsLoading(false);
    }
  }, [data]);

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
      chartSegments: segments,
    };
  }, [data, size, strokeWidth]);

  const handleSegmentPress = (index: number) => {
    setActiveIndex(index);
    onSegmentPress?.(index, chartSegments[index]);
    listRef.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.5,
    });
  };

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

            {chartSegments.map((seg, index) => {
              const isActive = activeIndex === index;
              const expandedStroke = isActive ? strokeWidth + 6 : strokeWidth;
              const opacity = activeIndex === null || isActive ? 1 : 0.4;

              return (
                <MemoizedPath
                  key={`${index}-${seg.key}`}
                  path={seg.path}
                  color={seg.color}
                  strokeWidth={expandedStroke}
                  opacity={opacity}
                  onPress={() => handleSegmentPress(index)}
                  accessibilityLabel={`${seg.key}: ${Math.round(
                    (seg.value / total) * 100
                  )}%`}
                />
              );
            })}

            <Circle
              cx={0}
              cy={0}
              r={radius - strokeWidth / 2}
              fill={isDark ? "black" : "white"}
            />
          </G>
        </Svg>
      </Pressable>

      <FlatList
        ref={listRef}
        data={chartSegments}
        horizontal
        keyExtractor={(item, index) => `${index}-${item.key}`}
        showsHorizontalScrollIndicator={false}
        style={{ width: screenWidth }}
        contentContainerStyle={styles.categoryScrollContainer}
        renderItem={({ item, index }) => {
          const isActive = index === activeIndex;
          return (
            <Pressable
              onPress={() => handleSegmentPress(index)}
              style={[styles.categoryItem, isActive && styles.activeItem]}
            >
              <View
                style={[styles.squareColor, { backgroundColor: item.color }]}
              />
              <Text style={styles.label}>
                {item.key}: {Math.round((item.value / total) * 100)}%
              </Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
};

export default React.memo(RingChart);
