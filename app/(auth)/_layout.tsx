import React from "react";
import { View, Dimensions } from "react-native";
import { Stack } from "expo-router";
import Svg, { Path } from "react-native-svg";

const { width } = Dimensions.get("window");

const BottomWave = () => (
  <View style={{ position: "absolute", bottom: 0, left: 0, right: 0,zIndex:0 }}>
    <Svg height="80" width={width} viewBox={`0 0 ${width} 80`}>
      <Path
        d={`M0 80H${width}V20C${width * 0.7} 40 ${width * 0.3} 0 0 20V80Z`}
        fill="#FFFCEE"
      />
    </Svg>
  </View>
);

export default function AuthLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: "white", position: "relative" }}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="otp-verification" />
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="fg-pw-otp-verification" />
      </Stack>
      {/* <BottomWave /> */}
    </View>
  );
}
