import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";

export default function TabsLayout() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home";

          switch (route.name) {
            case "index":
              iconName = "home";
              break;
            case "category":
              iconName = "list";
              break;
            case "history":
              iconName = "time";
              break;
            case "analytics":
              iconName = "bar-chart";
              break;
            case "profile":
              iconName = "person";
              break;
          }

          return <Ionicons name={iconName} size={size * 0.85} color={color} />;
        },
        tabBarShowLabel: false,
        headerShown: false,
        tabBarActiveTintColor: isDark ? "#6EE7B7" : "#10B981",
        tabBarInactiveTintColor: isDark ? "#A1A1AA" : "#6B7280",
        tabBarStyle: {
          backgroundColor: isDark ? "#141414" : "#F9FAFB",
          height: 50,
          paddingBottom: 3,
          paddingTop: 5,
        },
      })}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="category" />
      <Tabs.Screen name="history" />
      <Tabs.Screen name="analytics" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
