import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { router } from "expo-router";
type rideProps = {
  name: string;
  url: string;
  availability: number;
  price: number;
  id: number;
};
const Ride = ({ name, url, availability, price, id }: rideProps) => {
  //use dimension to give height and width in future
  return (
    <View>
      <View className=" border rounded-t-xl  border-gray-200">
        <Image
          resizeMode="contain"
          source={{ uri: url }}
          className=" h-[130] w-[170]"
        />
      </View>
      <View
        style={styles.details}
        className=" bg-[#F6FAFF] py-3 px-2 rounded-b-lg"
      >
        <Text className=" font-medium text-sm">{name}</Text>
        <View className=" flex-row items-center">
          <Text className=" text-[8px] text-[#35dca1]">🟢</Text>
          <Text className=" text-[#116245]">Available Now</Text>
        </View>
        <Text className=" font-semibold text-sm mt-1 mb-1">
          Rs. {price} <Text className=" text-gray-500 text-xs">per day</Text>
        </Text>
        {/* I couldn't get the book now button with desirable spacing to be on the same row as it was too large */}
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/screens/DetailsOfBike",
              params: { id: id },
            })
          }
          className=" py-2 px-4 rounded-lg bg-primary justify-center items-center"
        >
          <Text className=" text-white font-medium ">Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Ride;
const styles = StyleSheet.create({
  details: {
    elevation: 10,
  },
});
