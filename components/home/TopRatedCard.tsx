import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createFavourite,
  favouriteList,
  removeFavourite,
} from "@/services/favourites";
import { Skeleton } from "moti/skeleton";
type topRatedCardProps = {
  id: number;
  name: string;
  url: string;
  availability: string;
  price: number;
  favRide?: boolean;
  isSkeleton?: boolean;
};
const TopRatedCard = ({
  name,
  url,
  availability,
  price,
  id,
  favRide,
  isSkeleton = false,
}: topRatedCardProps) => {
  const queryClient = useQueryClient();
  // Query to check if this vehicle is in favorites
  const { data: favorites } = useQuery({
    queryKey: ["fav-list"],
    queryFn: favouriteList,
  });

  // Compute isFavorite based on the favorites list
  const isFavorite =
    favorites?.some((fav: any) => fav.vehicle === id) || favRide || false;

  const { mutate, isPending } = useMutation({ mutationFn: createFavourite });
  const deleteFavourite = useMutation({ mutationFn: removeFavourite });
  const onClick = () => {
    if (!isFavorite) {
      mutate(id, {
        onSuccess: () => {
          // Only invalidate the favorite-related queries
          queryClient.invalidateQueries({
            queryKey: ["fav-list"],
          });
        },
      });
    } else {
      deleteFavourite.mutate(id, {
        onSuccess: () => {
          // Only invalidate the favorite-related queries
          queryClient.invalidateQueries({
            queryKey: ["fav-list"],
          });
        },
      });
    }
  };
  //use dimension to give height and width in future
  return (
    <View
      className=" mr-3 bg-white rounded-lg"
      style={{ width: Dimensions.get("window").width * 0.5, elevation: 5 }}
    >
      <TouchableOpacity
        className="absolute z-10 right-3 top-3"
        onPress={onClick}
      >
        <Ionicons
          name={isFavorite ? "heart" : "heart-outline"}
          size={24}
          color={"#FF6100"}
        />
      </TouchableOpacity>
      <Skeleton.Group show={isSkeleton}>
        <View className=" p-2">
          <Skeleton height={100} width={"100%"} colorMode="light">
            {url === null ? null : (
              <Image
                resizeMode="contain"
                source={{ uri: url }}
                style={{ height: 100, width: "100%" }}
              />
            )}
          </Skeleton>
        </View>
        <View
          style={styles.details}
          className=" bg-[#F6FAFF] py-3 px-2 rounded-b-lg"
        >
          <Skeleton width={"80%"} colorMode="light">
            <Text className=" font-medium text-sm">{name}</Text>
          </Skeleton>
          <View style={{ height: 5 }} />
          <Skeleton width={"70%"} colorMode="light">
            <View className=" flex-row mb-1 items-center">
              <Text className=" text-[8px] text-[#35dca1]">🟢</Text>
              <Text className=" text-[#116245]">
                Available in {availability} days
              </Text>
            </View>
          </Skeleton>
          <View style={{ height: 5 }} />

          <Skeleton colorMode="light">
            <View className=" flex-row">
              <View className=" mr-2">
                <Text className=" font-semibold text-sm">
                  Rs. {price}{" "}
                  <Text className=" text-gray-500 text-xs">per day</Text>
                </Text>
              </View>
              <View className=" flex-1" />
              {/* <Button title={"Book Now"} /> */}
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/screens/DetailsOfBike",
                    params: { id: id },
                  })
                }
                className="px-2 py-2 rounded-lg bg-primary justify-center items-center"
              >
                <Text className=" text-white font-medium ">Book Now</Text>
              </TouchableOpacity>
            </View>
          </Skeleton>
        </View>
      </Skeleton.Group>
    </View>
  );
};

export default TopRatedCard;
const styles = StyleSheet.create({
  details: {
    elevation: 5,
  },
});
