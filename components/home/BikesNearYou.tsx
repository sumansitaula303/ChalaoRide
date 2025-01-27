import React from "react";
import { ScrollView, Dimensions, ActivityIndicator, Text } from "react-native";
import TopRatedCard from "./TopRatedCard";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { favouriteList } from "@/services/favourites";
import getSingleVechile from "@/services/getSingleVechile";

const { width } = Dimensions.get("window");
const cardWidth = width * 0.7;

export const FavouriteRides = () => {
  const { onRefreshToken } = useAuth();

  // First query to get favorite list
  const {
    data: favorites,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["fav-list"],
    queryFn: favouriteList,
  });

  // Second query to get vehicle details for each favorite
  const { data: vehicles, isLoading: isLoadingVehicles } = useQuery({
    queryKey: ["fav-vehicles", favorites],
    queryFn: async () => {
      if (!favorites) return [];
      const vehiclePromises = favorites.map((fav: any) =>
        getSingleVechile(fav.vehicle),
      );
      return Promise.all(vehiclePromises);
    },
    enabled: !!favorites && favorites.length > 0,
  });

  if (isLoading || isLoadingVehicles) {
    return <ActivityIndicator size="large" />;
  }

  if (isError) {
    // onRefreshToken();
    return null;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingVertical: 10 }}
    >
      {vehicles ? (
        vehicles.map((vehicle: any) => {
          console.log(vehicle);
          const img_url = vehicle?.thumbnail_image
            ? vehicle.thumbnail_image
            : "https://bike-zone.co.uk/wp-content/uploads/2023/07/bike-placeholder-gn.png";
          return (
            <TopRatedCard
              key={vehicle.id}
              name={vehicle.vehicle_name}
              id={vehicle.id}
              url={img_url}
              availability={"2"}
              price={vehicle.price?.Daily || 0}
              favRide={true}
            />
          );
        })
      ) : (
        <Text>No favorite rides available</Text>
      )}
    </ScrollView>
  );
};
