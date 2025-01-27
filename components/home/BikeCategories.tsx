import { router } from "expo-router";
import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const categories = [
  {
    name: "ELECTRIC",
    image: require("../../assets/images/electric.png"),
    onClick: false,
    icon: "battery-charging" as const,
    color: "#34D399",
    count: "25+",
  },
  {
    name: "SCOOTER",
    image: require("../../assets/images/scooter.png"),
    onClick: true,
    icon: "bicycle-outline" as const,
    color: "#F87171",
    count: "32+",
  },
  {
    name: "BIKE",
    image: require("../../assets/images/bike.png"),
    onClick: true,
    icon: "bicycle-sharp" as const,
    color: "#60A5FA",
    count: "28+",
  },
  {
    name: "CAB",
    image: require("../../assets/images/cab.png"),
    onClick: false,
    icon: "car-outline" as const,
    color: "#FBBF24",
    count: "15+",
  },
];

const BikeCategories = () => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className="flex-row justify-center items-center py-3">
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            onPress={() =>
              router.push({
                pathname: "/screens/RideSelectionScreen",
                params: { rideType: category.name },
              })
            }
            className="items-center mx-3"
          >
            <View className="relative">
              <View
                style={styles.containerShadow}
                className="w-[70px] h-[70px] rounded-full bg-[#F2F5FF] justify-center items-center"
              >
                <Image
                  source={category.image}
                  className="w-[70px] h-[70px] rounded-full"
                  resizeMode="cover"
                />
              </View>
              <View
                style={{ backgroundColor: category.color }}
                className="absolute -top-1 -right-1 w-6 h-6 rounded-full items-center justify-center"
              >
                <Ionicons name={category.icon} size={14} color="white" />
              </View>
            </View>
            <Text className="mt-2 text-sm font-semibold">{category.name}</Text>
            <View className="flex-row items-center mt-1">
              <Text
                // style={{ color: category.color }}
                className="text-xs font-medium"
              >
                {category.count} vehicles
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  containerShadow: {
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});

export default BikeCategories;
