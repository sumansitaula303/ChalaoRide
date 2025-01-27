import { useAuth } from "@/context/AuthContext";
import { Redirect } from "expo-router";
import { useState, useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const { authState } = useAuth();
  console.log(authState?.authenticated + "hello");
  console.log(authState?.token);

  if (authState?.authenticated === undefined) {
    return (
      <SafeAreaProvider>
        <SafeAreaView>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }
  if (authState?.authenticated) {
    return (
      <SafeAreaProvider>
        <SafeAreaView>
          <Redirect href="/(root)" />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }
  if (authState?.authenticated === false) {
    return (
      <SafeAreaProvider>
        <SafeAreaView>
          <Redirect href="/(auth)/login" />
        </SafeAreaView>
      </SafeAreaProvider>
    );
    // <SafeAreaProvider><SafeAreaView><Redirect href="/(auth)/login" /></SafeAreaView></SafeAreaProvider>;
  }
}
