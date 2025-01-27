import { View, Image, TouchableOpacity } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";

const CustomHeader = () => {
  return (
    <View className="flex-row justify-between items-center bg-gray-100 shadow-sm">
      <Image
        source={require("../../assets/images/logo2.png")}
        className="w-36 h-10"
        resizeMode="contain"
      />
      <TouchableOpacity
        className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
        onPress={() => router.push("/screens/NotificationScreen")}
      >
        <Ionicons name="notifications-outline" size={24} color="#374151" />
      </TouchableOpacity>
    </View>
  );
};

export default CustomHeader;
