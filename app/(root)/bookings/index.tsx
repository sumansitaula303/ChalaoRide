import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import BookingCard from "@/components/bookings/BookingCard";
import SmallCard from "@/components/bookings/SmallCard";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import getBookingList from "@/services/getBookingList";
import { Ionicons } from "@expo/vector-icons";
import RatingModal from "@/components/RateAndReview";
import EmptyBooking from "@/components/bookings/EmptyBooking";

const previousBooking = [
  {
    image: require("../../../assets/bikesimage/scooty3.png"),
    title: "Ray ZR",
    date: "Dec 29 2023",
    cost: "500",
    last_date: "2 days",
  },
  {
    image: require("../../../assets/bikesimage/scooty4.png"),
    title: "Hero Destiny 125",
    date: "Dec 15 2023",
    cost: "1000",
    last_date: "12 days",
  },
  {
    image: require("../../../assets/bikesimage/scooty1.png"),
    title: "Ray ZR",
    date: "Dec 13 2023",
    cost: "500",
    last_date: "24 days",
  },
  {
    image: require("../../../assets/bikesimage/scooty2.png"),
    title: "Hero ZR",
    date: "Dec 29 2023",
    cost: "800",
    last_date: "2 days",
  },
];
const MyBooking = () => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["bookingList"],
    queryFn: getBookingList,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
  });
  const [rating, setRating] = useState(true);
  // if (!isLoading) console.log(data[0]?.vehicle.vechile_name);
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 px-4 mt-0 bg-white">
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }
  if (data?.length === 0) {
    return (
      <SafeAreaView className="  flex-1 ">
        <Text className=" self-center font-medium text-lg">Bookings</Text>
        <View className=" flex-1 justify-center items-center">
          <EmptyBooking
            title="Pending Bookings"
            onExplore={() => router.push("/(root)/")}
          />
        </View>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView className=" flex-1 px-4 mt-0 bg-white">
      <ScrollView showsVerticalScrollIndicator={false} className=" flex-1">
        {/* this is only for testing purpose this will be later moved to a different place */}
        <RatingModal
          isVisible={false}
          onClose={() => setRating(false)}
          onSubmit={() => null}
          vehicleName={data[0]?.vehicle?.vehicle_name || ""}
        />
        <View
          style={{
            backgroundColor: "#fff",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 5,
          }}
        >
          <TouchableOpacity onPress={router.back}>
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: "600" }}>My Booking</Text>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <Text className=" text-base font-medium mb-[14]">Pending Booking</Text>
        {data?.length > 0
          ? data?.map((booking: any, index: number) => {
              return (
                <View key={index} className=" mb-3">
                  <BookingCard
                    name={booking?.vehicle.vehicle_name}
                    start_date={booking?.start_date}
                    image={`https://chalao.pythonanywhere.com${booking?.vehicle.thumbnail_image}`}
                    end_date={booking?.end_date}
                    isBooking={true}
                    onClick={() =>
                      router.push({
                        pathname: "/screens/MyBookingScreen",
                        params: {
                          booking_id: booking?.id,
                          vehicle_id: booking?.vehicle.id,
                        },
                      })
                    }
                    onClickPickup={() =>
                      router.push({
                        pathname: "/screens/VerifyPickup",
                        params: { booking_id: booking?.id },
                      })
                    }
                  />
                </View>
              );
            })
          : null}
        <Text className=" text-base font-medium mt-4 mb-[14]">
          Current Booking
        </Text>
        {/** the name of the vechile should be present */}
        {data?.length > 0
          ? data?.map((booking: any, index: number) => {
              return (
                <View key={index} className=" mb-3">
                  <BookingCard
                    name={booking?.vehicle.vehicle_name}
                    image={`https://chalao.pythonanywhere.com${booking?.vehicle.thumbnail_image}`}
                    start_date={booking?.start_date}
                    end_date={booking?.end_date}
                    isBooking={false}
                    onClick={() =>
                      router.push({
                        pathname: "/screens/CurrentSubscription",
                        params: {
                          bookingId: booking?.id,
                          vehicleId: booking?.vehicle.id,
                        },
                      })
                    }
                  />
                </View>
              );
            })
          : null}
        {}
        <Text className=" text-base font-medium mt-4 mb-[14]">
          Previous Booking
        </Text>
        {previousBooking.map((booking, index) => (
          <View key={index} className=" mb-3">
            <SmallCard
              image={booking.image}
              title={booking.title}
              date={booking.date}
              cost={booking.cost}
              last_date={booking.last_date}
            />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyBooking;
