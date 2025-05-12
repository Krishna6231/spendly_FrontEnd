import { useEffect, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { ActivityIndicator, View, StyleSheet, StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import axios from 'axios';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { ThemeProvider } from '../theme/ThemeContext';
import base64 from 'base-64';

const decodeJwt = (token: string) => {
  try {
    const payload = token.split('.')[1];
    const base64Url = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decodedPayload = JSON.parse(base64.decode(base64Url));
    return decodedPayload;
  } catch (error) {
    console.error(error);
    return {};
  }
};

const isTokenExpired = (token: string): boolean => {
  const { exp } = decodeJwt(token);
  return Date.now() >= exp * 1000;
};

export default function Layout() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = async () => {

      try {
        const accessToken = await SecureStore.getItemAsync('accessToken');
        const refreshToken = await SecureStore.getItemAsync('refreshToken');
        const user = await SecureStore.getItemAsync('userData');
        const hasSeenLanding = await SecureStore.getItemAsync('hasSeenLanding');

        if (accessToken && user) {
          const expired = isTokenExpired(accessToken);

          if (expired && refreshToken) {
            const refreshResponse = await axios.post(
              'https://spendly-backend-5rgu.onrender.com/auth/refresh-token',
              { refreshToken }
            );
            await SecureStore.setItemAsync('accessToken', refreshResponse.data.accessToken);
          }

          if (!hasSeenLanding) {
            await SecureStore.setItemAsync('hasSeenLanding', 'true');
            router.replace('/landing');
          } else {
            router.replace('/');
          }
        } else {
          router.replace('/login');
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        router.replace('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider>
          <StatusBar barStyle="light-content" backgroundColor="black" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="landing" />
            <Stack.Screen name="login" />
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white', // or dark mode base
    zIndex: 999,
  },
});
