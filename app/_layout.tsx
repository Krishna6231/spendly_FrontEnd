import { useEffect, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import axios from 'axios';
import { Provider } from 'react-redux';
import { store } from '../redux/store'; // Adjust path if needed

// Decode JWT manually
const decodeJwt = (token: string) => {
  const payload = token.split('.')[1];
  const base64Url = payload.replace('-', '+').replace('_', '/'); 
  const decodedPayload = JSON.parse(atob(base64Url));
  return decodedPayload;
};

// Check if the token is expired
const isTokenExpired = (token: string): boolean => {
  const { exp } = decodeJwt(token); 
  return Date.now() >= exp * 1000; 
};

export default function Layout() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const accessToken = await SecureStore.getItemAsync('accessToken');
        const refreshToken = await SecureStore.getItemAsync('refreshToken');
        const user = await SecureStore.getItemAsync('userData');

        if (accessToken && user) {
          const expired = isTokenExpired(accessToken);
          
          if (expired && refreshToken) {
            const refreshResponse = await axios.post(

              'http://10.142.20.242:3000/auth/refresh-token',
              { refreshToken }
            );
            await SecureStore.setItemAsync(
              'accessToken',
              refreshResponse.data.accessToken
            );
          }

          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (isLoggedIn) {
        router.replace('/');
      } else {
        router.replace('/login');
      }
    }
  }, [isLoading, isLoggedIn, router]);

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
      <Stack screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          <>
            <Stack.Screen name="login" />
            <Stack.Screen name="signup" />
          </>
        ) : (
          <Stack.Screen name="index" />
        )}
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
