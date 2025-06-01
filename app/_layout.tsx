import { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { ActivityIndicator, View, StyleSheet, StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import { ThemeProvider } from "../theme/ThemeContext";
import base64 from "base-64";
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: true,  // ✅ new
      shouldShowList: true,    // ✅ new
    };
  },
});



const decodeJwt = (token: string) => {
  try {
    const payload = token?.split?.(".")[1];
    if (!payload) return {};

    const base64Url = payload.replace(/-/g, "+").replace(/_/g, "/");

    const decoded = base64.decode(base64Url);
    return JSON.parse(decoded);
  } catch (error) {
    console.error("JWT decode error:", error);
    return {};
  }
};

const isTokenExpired = (token: string): boolean => {
  const { exp } = decodeJwt(token) || {};
  if (!exp) return true;
  return Date.now() >= exp * 1000;
};

export default function Layout() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
  const subscriptionReceived = Notifications.addNotificationReceivedListener(notification => {
    console.log('Notification Received:', notification);
    // You can update state, trigger sounds, etc.
  });

  const subscriptionResponse = Notifications.addNotificationResponseReceivedListener(response => {
    console.log('User interacted with notification:', response);
    // You can navigate based on data, etc.
  });

  return () => {
    subscriptionReceived.remove();
    subscriptionResponse.remove();
  };
}, []);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        const user = await SecureStore.getItemAsync("userData");

        let expired = true;
        try {
          expired = isTokenExpired(token || "");
        } catch (e) {
          console.error("Token check failed:", e);
        }

        if (token && user && !expired) {
          router.replace("/");
        } else {
          router.replace("/landing");
        }
      } catch (error) {
        console.error("Login status error:", error);
        router.replace("/landing");
      } finally {
        setIsLoading(false);
      }
    };

    try {
      checkLoginStatus();
    } catch (e) {
      console.error("Critical app init failure:", e);
      setIsLoading(false);
    }
  }, []);
  
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider>
          <StatusBar barStyle="light-content" backgroundColor="black" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="landing" />
          </Stack>

          {isLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#000" />
            </View>
          )}
        </ThemeProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white", // or dark mode base
    zIndex: 999,
  },
});