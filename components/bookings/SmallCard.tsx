import { View, Text, Image } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

type smallCardProps = {
  image: Object;
  title: string;
  date: string;
  cost: string;
  last_date: string;
};

const SmallCard = ({ image, title, date, cost, last_date }: smallCardProps) => {
  return (
    <View className="bg-white rounded-xl shadow-sm overflow-hidden">
      <LinearGradient colors={["#F6F8FF", "#FFFFFF"]} className="p-3">
        <View className="flex-row items-center">
          <View className="bg-white p-2 rounded-xl shadow-sm border border-gray-100">
            <Image resizeMode="contain" source={image} className="h-16 w-16" />
          </View>

          <View className="ml-3 flex-1">
            <Text className="font-bold text-base text-gray-800">{title}</Text>
            <View className="flex-row items-center mt-1">
              <Ionicons name="calendar-outline" size={14} color="#666" />
              <Text className="text-sm text-gray-500 ml-1">{date}</Text>
            </View>
          </View>

          <View className="items-end">
            <Text className="font-bold text-secondary text-base">
              Rs {cost}
            </Text>
            <View className="flex-row items-center mt-1">
              <Ionicons name="time-outline" size={14} color="#666" />
              <Text className="text-sm text-gray-600 ml-1">{last_date}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

export default SmallCard;
