import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import SearchBar from "@/components/Rides/SearchBar";
import { router } from "expo-router";

interface Vehicle {
  id: number;
  vehicle_name: string;
  thumbnail_image: string;
  price: {
    Daily: number;
  };
  category: string;
  vehicle_type: string;
}

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "Royal Enfield",
    "Honda Activa",
    "TVS Jupiter",
  ]);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://chalao.pythonanywhere.com/api/vehicle",
      );
      const data = await response.json();
      setVehicles(data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredVehicles = vehicles.filter((vehicle) =>
    vehicle.vehicle_name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleVehiclePress = (id: number) => {
    router.push({
      pathname: "/screens/RequestToBook",
      params: { id },
    });
  };

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View className="pt-12 px-4 bg-white">
        <View className="flex-row items-center bg-white">
          <TouchableOpacity onPress={() => router.back()} className="mr-3 p-2">
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <View className=" flex-1">
            <SearchBar
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                if (text && !recentSearches.includes(text)) {
                  setRecentSearches((prev) => [text, ...prev].slice(0, 5));
                }
              }}
              placeholder="Search vehicles..."
            />
          </View>
        </View>
      </View>

      <ScrollView className="flex-1">
        {searchQuery === "" ? (
          <View className="p-4">
            <Text className="text-lg font-semibold mb-4">Recent Searches</Text>
            {recentSearches.map((search, index) => (
              <TouchableOpacity
                key={index}
                className="flex-row items-center py-3 border-b border-gray-100"
                onPress={() => setSearchQuery(search)}
              >
                <Ionicons name="time-outline" size={20} color="#666" />
                <Text className="ml-3 text-gray-700">{search}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : isLoading ? (
          <ActivityIndicator size="large" className="mt-8" />
        ) : (
          <View className="p-4">
            {filteredVehicles.map((vehicle, index) => (
              <TouchableOpacity
                key={index}
                className="flex-row items-center mb-4 bg-white rounded-lg p-3 border border-gray-100"
                onPress={() => handleVehiclePress(vehicle.id)}
              >
                <Image
                  source={{ uri: vehicle.thumbnail_image }}
                  className="w-20 h-20 rounded-lg"
                  resizeMode="cover"
                />
                <View className="flex-1 ml-4">
                  <Text className="font-semibold text-base">
                    {vehicle.vehicle_name}
                  </Text>
                  <Text className="text-gray-500 text-sm">
                    {vehicle.vehicle_type}
                  </Text>
                  <Text className="text-primary font-semibold mt-1">
                    Rs. {vehicle.price.Daily}/day
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#666" />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default SearchScreen;
