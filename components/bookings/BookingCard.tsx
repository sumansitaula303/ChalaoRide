import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

type bookingCardProps = {
  name: string;
  image: string;
  start_date: string;
  end_date: string;
  isBooking: boolean;
  onClick: () => void;
  onClickPickup?: () => void;
};

const BookingCard = ({
  name,
  image,
  start_date,
  end_date,
  isBooking,
  onClick,
  onClickPickup,
}: bookingCardProps) => {
  return (
    <View className="bg-white rounded-xl shadow-md overflow-hidden">
      <LinearGradient colors={["#F6F8FF", "#FFFFFF"]} className="p-4">
        <View className="flex-row">
          <View className="bg-white p-2 rounded-xl shadow-sm">
            <Image
              resizeMode="contain"
              className="h-24 w-24"
              source={{ uri: image }}
            />
          </View>

          <View className="flex-1 ml-4">
            <Text className="text-lg font-bold mb-1">{name}</Text>
            <View className="flex-row items-center mb-2">
              <Ionicons name="calendar-outline" size={16} color="#666" />
              <Text className="text-sm text-gray-600 ml-1">
                {start_date} - {end_date}
              </Text>
            </View>

            <View className="flex-row space-x-2">
              <TouchableOpacity onPress={onClick} className="flex-1">
                <LinearGradient
                  colors={
                    isBooking ? ["#ECBE06", "#F7D355"] : ["#1552CC", "#4F80E1"]
                  }
                  className="py-2 px-4 rounded-lg"
                >
                  <Text className="text-white text-center font-medium">
                    {isBooking ? "Location" : "Extend Booking"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              {isBooking && (
                <TouchableOpacity onPress={onClickPickup} className="flex-1">
                  <LinearGradient
                    colors={["#ECBE06", "#F7D355"]}
                    className="py-2 px-4 rounded-lg"
                  >
                    <Text className="text-white text-center font-medium">
                      Pickup
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

export default BookingCard;
