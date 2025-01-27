import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import axiosInstance from "@/services/axiosInstance";

import { Alert } from "react-native";

interface authProps {
  authState?: {
    token: string | null;
    authenticated: boolean | null;
    refreshToken: string | null;
  };
  onRegister?: (
    full_name: string,
    phonenumber: string,
    password: string,
    confirm_password: string,
    email: string,
  ) => Promise<any>;
  onLogin?: (login_field: string, password: string) => Promise<any>;
  onLogout?: () => Promise<any>;
  onRefreshToken?: () => Promise<any>;
}

const TOKEN_KEY = "jwt";
const REF_TOKEN_KEY = "refjwt";
export const api_url = "https://chalao.pythonanywhere.com";

const AuthContext = createContext<authProps>({});

export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<{
    token: string | null;
    authenticated: boolean | null;
    refreshToken: string | null;
  }>();

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      const refToken = await SecureStore.getItemAsync(REF_TOKEN_KEY);

      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
        setAuthState({
          token: token,
          authenticated: true,
          refreshToken: refToken,
        });
      } else {
        setAuthState({
          token: null,
          authenticated: false,
          refreshToken: null,
        });
      }
    };
    loadToken();
  }, []);

  const register = async (
    full_name: string,
    password: string,
    confirm_password: string,
    email: string,
    phone_number: string,
  ) => {
    //add logic here
    console.log("im here");
    try {
      const result = await axios.post(`${api_url}/api/auth/signup/`, {
        full_name,
        password,
        confirm_password,
        email,
        phone_number,
        user_type: "USER",
      });
      console.log(result.data);
      return result.data;
    } catch (e) {}
  };

  const login = async (login_field: string, password: string) => {
    try {
      const result = await axios.post(`${api_url}/api/auth/login/`, {
        login_field,
        password,
      });
      console.log(result);
      // Set authentication state with tokens
      setAuthState({
        token: result.data.token.access,
        authenticated: true,
        refreshToken: result.data.token.refresh,
      });

      // Set Axios default authorization headers
      axios.defaults.headers.common["Authorization"] =
        `Bearer ${result.data.token.access}`;
      axiosInstance.defaults.headers.common["Authorization"] =
        `Bearer ${result.data.token.access}`;

      // Store tokens in SecureStore
      await SecureStore.setItemAsync(TOKEN_KEY, result.data.token.access);
      await SecureStore.setItemAsync(REF_TOKEN_KEY, result.data.token.refresh);

      return result; // Return the result in case you need it for further processing
    } catch (e) {
      console.error("Login failed:", e);
      return { error: true, msg: (e as any)?.message || "Unknown error" };
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(REF_TOKEN_KEY);

    axios.defaults.headers.common["Authorization"] = "";
    axiosInstance.defaults.headers.common["Authorization"] = "";

    setAuthState({
      token: null,
      authenticated: false,
      refreshToken: null,
    });
  };

  const refreshToken = async () => {
    try {
      const refToken = await SecureStore.getItemAsync(REF_TOKEN_KEY);
      if (!refToken) throw new Error("No refresh token found");

      const response = await axiosInstance.post("/api/auth/token/refresh/", {
        refresh: refToken,
      });

      const { access } = response.data;
      console.log(access);
      await SecureStore.setItemAsync(TOKEN_KEY, access);

      setAuthState((prev) => ({
        ...prev!,
        token: access,
        authenticated: true,
      }));

      axios.defaults.headers.common["Authorization"] =` Bearer ${access}`;
      axiosInstance.defaults.headers.common["Authorization"] =
        `Bearer ${access}`;

      return response;
    } catch (e) {
      await logout();
      return { error: true, msg: e };
    }
  };

  const value = {
    onRegister: register,
    onLogin: login,
    onLogout: logout,
    onRefreshToken: refreshToken,
    authState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};