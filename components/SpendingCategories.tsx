import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { Animated } from "react-native";
import indexStyles from "@/styles/index.styles";
import { useTheme } from "@/theme/ThemeContext";

interface SpendingCategoriesProps {
  loading: boolean;
  thisMonthExpenseData: Array<{ name: string; amount: number }>;
  categoryLimitMap: { [key: string]: number };
  blinkingBorder: Animated.Value;
}

const SpendingCategories: React.FC<SpendingCategoriesProps> = ({
  loading,
  thisMonthExpenseData,
  categoryLimitMap,
  blinkingBorder,
}) => {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const styles = indexStyles(isDark);

  return (
    <View style={styles.categoryCard}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={styles.sectionTitle}>Spending Categories</Text>

        <TouchableOpacity
          onPress={() => router.push("/history")}
          style={{ flexDirection: "row", alignItems: "center" }}
          activeOpacity={0.5}
        >
          <FontAwesome
            name="history"
            size={16}
            color={isDark ? "#cbd5e1" : "#333"}
            style={{ marginRight: 4, marginBottom: 10 }}
          />
          <Text style={[styles.sectionTitle, { fontSize: 16 }]}>History</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 12 }}
        style={{ marginTop: 8 }}
      >
        {loading ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 16, color: "#666" }}>
              Loading categories...
            </Text>
          </View>
        ) : thisMonthExpenseData.length === 0 ? (
          <View style={{ alignItems: "center", marginTop: 40 }}>
            <Text style={{ fontSize: 16, color: "#555", textAlign: "center" }}>
              Looks like your wallet’s been on vacation this month! 🏖️{"\n\n"}
              No expenses yet — saving pro or just broke? 😄
            </Text>
          </View>
        ) : (
          thisMonthExpenseData
            .map((item) => {
              const limit = categoryLimitMap[item.name] || 0;
              const percentage = limit > 0 ? (item.amount / limit) * 100 : 0;
              return { ...item, percentage };
            })
            .sort((a, b) => b.percentage - a.percentage)
            .map((item, index) => {
              const limit = categoryLimitMap[item.name] || 0;
              const isOverspent = item.amount > limit;
              const percentage = limit > 0 ? (item.amount / limit) * 100 : 0;

              let barColor = "#4CAF50"; // green by default
              if (isOverspent) barColor = "#B71C1C";
              else if (percentage >= 90) barColor = "#F44336"; // red
              else if (percentage >= 70) barColor = "#FF9800"; // orange
              else if (percentage >= 40) barColor = "#FFEB3B"; // yellow

              const borderColor = blinkingBorder.interpolate({
                inputRange: [0, 1],
                outputRange: ["#ccc", barColor],
              });

              return (
                <Pressable
                  key={index}
                  onPress={() =>
                    router.push({
                      pathname: `/expenses/[name]`,
                      params: { name: item.name },
                    })
                  }
                >
                  <Animated.View
                    style={[
                      {
                        borderWidth: 0,
                        borderRadius: 10,
                        padding: 10,
                        marginVertical: 8,
                        borderColor: percentage >= 70 ? borderColor : "#ccc",
                        shadowColor: barColor,
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: blinkingBorder,
                        shadowRadius: blinkingBorder.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 10],
                        }),
                        backgroundColor: isDark ? "#4e5971" : "#fff",
                        elevation:
                          percentage >= 70
                            ? blinkingBorder.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, 10],
                              })
                            : 0,
                      },
                    ]}
                  >
                    {/* Top Row */}
                    <View style={styles.cat_top_row}>
                      <View>
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: "600",
                            color: isDark ? "#cbd5e1" : "black",
                          }}
                        >
                          {item.name}
                        </Text>
                      </View>
                      <Text
                        style={{
                          fontSize: 16,
                          color: isDark ? "#cbd5e1" : "black",
                        }}
                      >
                        ₹{item.amount}
                      </Text>
                    </View>

                    {item.name !== "Subscriptions" && (
                      <>
                        {/* Progress Bar */}
                        <View style={styles.progressBarOut}>
                          <View
                            style={{
                              width: `${Math.min(percentage, 100)}%`,
                              backgroundColor: barColor,
                              height: "100%",
                              borderRadius: 5,
                            }}
                          />
                        </View>

                        {/* Limit Statement */}
                        {isOverspent ? (
                          <Text
                            style={{
                              marginTop: 4,
                              fontSize: 12,
                              color: "#B71C1C",
                            }}
                          >
                            Whoa! You overspent 🚨
                          </Text>
                        ) : (
                          <Text
                            style={{
                              marginTop: 4,
                              fontSize: 12,
                              color: isDark ? "#cbd5e1" : "#666",
                            }}
                          >
                            Limit: ₹{limit} ({Math.floor(percentage)}%)
                          </Text>
                        )}
                      </>
                    )}
                  </Animated.View>
                </Pressable>
              );
            })
        )}
      </ScrollView>
    </View>
  );
};

export default SpendingCategories;
