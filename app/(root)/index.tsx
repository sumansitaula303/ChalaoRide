import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BikeCategories from "@/components/home/BikeCategories";
import { TopRatedRides } from "@/components/home/TopRatedRides";
import CustomHeader from "@/components/home/CustomHeader";
import { useAuth } from "@/context/AuthContext";
import HomeSearchBar from "@/components/home/HomeSearchBar";
import { FavouriteRides } from "@/components/home/BikesNearYou";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProfile } from "@/services/profile-api";

export default function HomeScreen() {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["profile-info"],
    queryFn: getProfile,
  });

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    // Invalidate and refetch relevant queries
    queryClient.invalidateQueries();
    setRefreshing(false);
  }, [queryClient]);
  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView
        className=" flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <CustomHeader />
        <View className="px-4 flex-1">
          {/* Welcome Section */}
          <View className="mb-4">
            <Text className="text-gray-600 text-base">Welcome,</Text>
            <Text className="text-lg font-bold">
              {data?.user.full_name || "User"}
            </Text>
          </View>

          {/* Main Heading */}
          <Text className=" text-lg font-semibold mb-4">
            Rent Premium bike & Enjoy the Ride
          </Text>

          {/* SearchBar Component */}
          <HomeSearchBar />

          {/* Bike Categories */}
          <View className="flex-row items-center justify-between mt-6 mb-2">
            <Text className="text-lg font-bold">Select Ride you Prefer</Text>
          </View>
          <BikeCategories />

          {/* Top Rated Rides */}
          <View className="flex-row items-center justify-between mt-6 mb-2">
            <View>
              <Text className="text-lg font-bold">Top Rated Rides</Text>
              <Text className="text-sm text-gray-500">
                Most popular choices
              </Text>
            </View>
          </View>
          <TopRatedRides />

          {/* Bikes Near You */}
          <View className="flex-row items-center justify-between mt-6 mb-2">
            <View>
              <Text className="text-lg font-bold">Favourite Rides</Text>
              {/* <Text className="text-sm text-gray-500">Within 5 km radius</Text> */}
            </View>
            {/* <TouchableOpacity
              onPress={() => router.push("/screens/NearbyRides")}
              className="flex-row items-center"
            >
              <Text className="text-primary mr-1 text-sm">View All</Text>
              <Ionicons name="chevron-forward" size={16} color="#FF385C" />
            </TouchableOpacity> */}
          </View>
          <FavouriteRides />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
