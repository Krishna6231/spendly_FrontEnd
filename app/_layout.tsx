import { useEffect, useState } from 'react';
import { Stack, useRouter, Slot } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { ActivityIndicator, View, StyleSheet, StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import axios from 'axios';
import { Provider } from 'react-redux';
import { store } from '../redux/store';

const decodeJwt = (token: string) => {
  const payload = token.split('.')[1];
  const base64Url = payload.replace('-', '+').replace('_', '/'); 
  const decodedPayload = JSON.parse(atob(base64Url));
  return decodedPayload;
};

const isTokenExpired = (token: string): boolean => {
  const { exp } = decodeJwt(token); 
  return Date.now() >= exp * 1000; 
};

export default function Layout() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState<string | null>(null);
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
              'http://10.142.22.27:3000/auth/refresh-token',
              { refreshToken }
            );
            await SecureStore.setItemAsync('accessToken', refreshResponse.data.accessToken);
          }

          if (!hasSeenLanding) {
            await SecureStore.setItemAsync('hasSeenLanding', 'true');
            setInitialRoute('/landing');
          } else {
            setInitialRoute('/');
          }
        } else {
          setInitialRoute('/login');
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        setInitialRoute('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
    if (!isLoading && initialRoute) {
      router.replace(initialRoute);
    }
  }, [isLoading, initialRoute]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" backgroundColor="black" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="landing" />
          <Stack.Screen name="login" />
          <Stack.Screen name="signup" />
        </Stack>
      </GestureHandlerRootView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
