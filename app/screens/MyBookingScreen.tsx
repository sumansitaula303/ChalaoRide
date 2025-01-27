import React, { useState, useRef, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WebView } from "react-native-webview";
import LeafletMapHTML from "../../constants/LeafLeatHtml.js";
import * as Location from "expo-location";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import getSingleBooking from "../../services/getSingleBooking";
import { useQuery } from "@tanstack/react-query";
import getSingleVechile from "../../services/getSingleVechile";

export default function BookingScreen() {
  const { booking_id, vehicle_id } = useLocalSearchParams();
  console.log(booking_id);
  console.log(vehicle_id);
  const bookindId = parseInt(
    Array.isArray(booking_id) ? booking_id[0] : booking_id,
  );
  const vehicleId = parseInt(
    Array.isArray(vehicle_id) ? vehicle_id[0] : vehicle_id,
  );
  const { data, isError, isLoading } = useQuery({
    queryKey: ["singleVechile", vehicle_id],
    queryFn: () => getSingleVechile(vehicleId),
  });
  const {
    data: bookingData,
    isError: bookingError,
    isLoading: bookingLoading,
  } = useQuery({
    queryKey: ["singleBooking", booking_id],
    queryFn: () => getSingleBooking(bookindId),
  });
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const webViewRef = useRef<WebView>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  const mapHTML = currentLocation
    ? LeafletMapHTML.replace(
        "LOCATION_PLACEHOLDER",
        `${currentLocation.latitude},${currentLocation.longitude}`,
      ).replace("MARKER_PLACEHOLDER", "26.6427,87.7209")
    : LeafletMapHTML;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white p-4 flex-row items-center border-b border-gray-100">
        <TouchableOpacity onPress={router.back} className="mr-4">
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold">Pickup Details</Text>
      </View>

      <ScrollView className="flex-1">
        {/* Vehicle Details Card */}
        <View className="bg-white m-4 p-4 rounded-2xl shadow-sm">
          <View className="flex-row items-center">
            <Image
              source={{ uri: data?.thumbnail_image }}
              resizeMode="contain"
              className="w-24 h-24 rounded-xl"
            />
            <View className="ml-4 flex-1">
              <Text className="text-xl font-bold text-gray-800">
                {data?.vehicle_name}
              </Text>
              <Text className="text-sm text-gray-500 mb-2">
                {data?.vehicle_type}
              </Text>
              <View className="flex-row items-center">
                <Ionicons name="time-outline" size={16} color="#4B5563" />
                <Text className="ml-1 text-gray-600">Ready for pickup</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Map Section */}
        <View className="mx-4 mb-6">
          <Text className="text-gray-700 font-medium mb-2">
            Pickup Location
          </Text>
          <View className="bg-white rounded-xl overflow-hidden shadow-sm">
            <View className="h-72">
              <WebView
                ref={webViewRef}
                originWhitelist={["*"]}
                source={{ html: mapHTML }}
                style={{ flex: 1 }}
                onLoadEnd={() => setMapLoaded(true)}
                scrollEnabled={false}
                nestedScrollEnabled={true}
                javaScriptEnabled={true}
                domStorageEnabled={true}
              />
            </View>
            <View className="p-4 border-t border-gray-100">
              <View className="flex-row items-center mb-2">
                <Ionicons name="location" size={20} color="#FF4500" />
                <Text className="ml-2 text-gray-700 font-medium">
                  {bookingData?.pickup_location}
                </Text>
              </View>
              <Text className="text-gray-500 text-sm ml-7">
                Please arrive at the pickup location during your scheduled time
              </Text>
            </View>
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          className="bg-orange-500 mx-4 rounded-xl py-4 mb-6 items-center shadow-sm"
          activeOpacity={0.8}
        >
          <Text className="text-white font-bold text-lg">Start Navigation</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
