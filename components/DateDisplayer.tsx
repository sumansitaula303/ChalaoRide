import { View, Text } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
type dateDisplayerProps = {
  date: string;
};
const DateDisplayer = ({ date }: dateDisplayerProps) => {
  return (
    <View className="flex-row items-center mb-2">
      <Ionicons name="calendar-outline" size={16} color="#666" />
      <Text className="text-sm text-gray-600 ml-1">{date}</Text>
    </View>
  );
};

export default DateDisplayer;
