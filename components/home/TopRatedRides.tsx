import React from "react";
import {
  FlatList,
  Dimensions,
  ActivityIndicator,
  Text,
  View,
} from "react-native";
import TopRatedCard from "./TopRatedCard";
import { useQuery } from "@tanstack/react-query";
import getAllRides from "@/services/getAllRides";
import { useAuth } from "@/context/AuthContext";

export const TopRatedRides = () => {
  const { onRefreshToken } = useAuth();
  const { data, isError, isLoading } = useQuery({
    queryKey: ["data"],
    queryFn: getAllRides,
  });
  if (isError) {
    onRefreshToken;
    return null;
  }
  // if (data) {
  //   return null;
  //   console.log(data);
  // }
  if (isLoading) {
    return (
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 10 }}
        data={[...Array(3)]} // Show 3 skeletons
        keyExtractor={(item, index) => index.toString()}
        renderItem={() => (
          <TopRatedCard
            id={1}
            name={"dummy"}
            url={
              "https://bike-zone.co.uk/wp-content/uploads/2023/07/bike-placeholder-gn.png"
            }
            availability={"2"}
            price={0}
            isSkeleton={true}
          />
        )}
      />
    );
  }
  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingVertical: 10 }}
      data={data}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => {
        const img_url = item?.thumbnail_image
          ? item?.thumbnail_image
          : "https://bike-zone.co.uk/wp-content/uploads/2023/07/bike-placeholder-gn.png";
        return (
          <TopRatedCard
            key={item.id}
            name={item.vehicle_name}
            id={item.id}
            url={img_url}
            availability={"2"}
            price={item.price.Daily}
          />
        );
      }}
      ListEmptyComponent={<Text>All rides have been booked</Text>}
    />
  );
};
