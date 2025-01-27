import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

type EmptyBookingProps = {
  title: string;
  onExplore?: () => void;
};

const EmptyBooking = ({ title, onExplore }: EmptyBookingProps) => {
  return (
    <View className="bg-white rounded-2xl shadow-sm overflow-hidden my-2">
      <LinearGradient colors={["#F6F8FF", "#FFFFFF"]} className="p-6">
        <View className="items-center">
          <Image
            source={require("../../assets/images/EmptyBookings.png")}
            className="h-48 w-48"
            resizeMode="contain"
          />
          <Text className="text-lg font-bold text-gray-800 mt-4 text-center">
            No Bookings Yet
          </Text>
          <Text className="text-sm text-gray-500 mt-2 text-center">
            Explore our collection of vehicles and start your journey today!
          </Text>

          {onExplore && (
            <TouchableOpacity onPress={onExplore} className="mt-4">
              <LinearGradient
                colors={["#FF6100", "#FF6100"]}
                className="py-3 px-6 rounded-full"
              >
                <View className="flex-row items-center">
                  <Text className="text-white font-medium mr-2">
                    Explore Vehicles
                  </Text>
                  <Ionicons name="arrow-forward" size={18} color="#fff" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    </View>
  );
};

export default EmptyBooking;
