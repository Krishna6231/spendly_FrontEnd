import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

interface UserData {
  id: string;
  name: string;
  email: string;
}

interface AuthContextProps {
  accessToken: string | null;
  refreshToken: string | null;
  userData: UserData | null;
  setUserData: (data: UserData) => void;
  login: (
    accessToken: string,
    refreshToken: string,
    userData: UserData
  ) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextProps>({
  accessToken: null,
  refreshToken: null,
  userData: null,
  setUserData: () => {},
  login: async () => {},
  logout: async () => {},
  isLoading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadAuthData = async () => {
    try {
      const storedRefreshToken = await AsyncStorage.getItem("refreshToken");
      const storedUserData = await AsyncStorage.getItem("userData");

      if (storedRefreshToken) {
        const response = await axios.post(
          "http://192.168.0.105:3000/auth/refresh",
          { refreshToken: storedRefreshToken }
        );

        const newAccessToken = response.data.accessToken;
        const user = JSON.parse(storedUserData || "{}");

        setAccessToken(newAccessToken);
        setRefreshToken(storedRefreshToken);
        setUserData(user);

        await AsyncStorage.setItem("accessToken", newAccessToken);
      } else {
        await logout();
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      await logout();
    } finally {
      await SplashScreen.hideAsync();
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAuthData();
  }, []);

  const login = async (
    newAccessToken: string,
    newRefreshToken: string,
    newUserData: UserData
  ) => {
    try {
      await AsyncStorage.setItem("accessToken", newAccessToken);
      await AsyncStorage.setItem("refreshToken", newRefreshToken);
      await AsyncStorage.setItem("userData", JSON.stringify(newUserData));

      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);
      setUserData(newUserData);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove([
        "accessToken",
        "refreshToken",
        "userData",
      ]);
      setAccessToken(null);
      setRefreshToken(null);
      setUserData(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        userData,
        setUserData,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
