import { useEffect, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { ActivityIndicator, View } from 'react-native';
import axios from 'axios';

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
          // Check if token is expired → if yes, try refresh
          const expired = isTokenExpired(accessToken); // Check if the token has expired
          
          if (expired && refreshToken) {
            // If expired and refreshToken exists, refresh the access token
            const refreshResponse = await axios.post(
              'http://192.168.0.101:3000/auth/refresh-token',
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
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
  );
}
