import { View, ScrollView, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import SearchBar from "@/components/Rides/SearchBar";
import RideFilter from "@/components/Rides/RideFilter";
import Ride from "@/components/Rides/Ride";
import axios from "axios";
import { isLoaded, isLoading } from "expo-font";
const RideSelectionScreen = () => {
  const { rideType } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const getVehicle = async () => {
      setIsLoading(true);
      const data = await axios.get(
        `https://chalao.pythonanywhere.com/api/vehicle?vehicle_type=${rideType}`,
      );
      console.log(data.data);
      if (rideType === "BIKE" || rideType === "SCOOTER") {
        if (data.data !== 0) {
          setRides(data.data);
          setIsLoading(false);
        }
      }
    };
    getVehicle();
  }, []);

  // these are to be fetched from api dummy rides
  const dummy_rides = [
    {
      available: true,
      bike_condition: null,
      category: null,
      chassis_number: 123,
      date_of_upload: "2024-11-12",
      discount: null,
      distance_travelled: 5000,
      duration: "DAY",
      engine_number: 13,
      fuel_type: "PETROL",
      id: 6,
      insurance_number: 132,
      last_service_date: null,
      next_service_date: null,
      next_service_distance: null,
      power: null,
      price: { Daily: 500, Monthly: 2000, Weekly: 1000 },
      registration_number: 123,
      theft_assurance: "COVERED",
      thumbnail_image:
        "https://chalao.pythonanywhere.com/media/vehicle/pulsar_150.jpg",
      vehicle_name: "Pusar 150",
      vehicle_type: "BIKE",
      vendor: 42,
    },
  ];

  //options for dropdown filtering
  const fuelOptions = ["Any", "PETROL", "ELECTRIC"];
  const brandOptions = ["Any", "Yamaha", "Ray", "Vespa"];
  const segmentOption = ["Any", "BUDGET", "Urban", "Luxury"];

  //states for dropdowns
  const [selectedFuel, setSelectedFuel] = useState<string | null>("Any");
  const [selectedBrand, setSelectedBrand] = useState<string | null>("Any");
  const [selectedSegment, setSelectedSegment] = useState<string | null>("Any");
  const [searchQuery, setSearchQuery] = useState("");

  //state to store initial data
  const [rides, setRides] = useState(dummy_rides);

  //function for filtering
  const filteredRides = rides?.filter((ride) => {
    const matchesSearch = ride.vehicle_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFuel =
      selectedFuel === "Any" || ride?.fuel_type === selectedFuel;
    // const matchesBrand = selectedBrand === "Any" || ride.brand === selectedBrand;
    const matchesSegment =
      selectedSegment === "Any" || ride.category === selectedSegment;
    return matchesSearch && matchesSegment && matchesFuel;
    // return matchesFuel && matchesBrand && matchesSegment; use this when all data from api
  });

  return (
    <ScrollView className="flex-1 p-4 pt-0 bg-white">
      <Stack.Screen options={{ title: `${rideType}`, headerShown: true }} />
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search vehicles..."
      />
      <View className="h-6" />
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ borderRadius: 0, overflow: "hidden" }}
          className="flex-row p-2 mb-2"
        >
          <RideFilter
            type={"Fuel"}
            items={fuelOptions}
            setSelected={setSelectedFuel}
          />
          <View className="mr-4" />
          <RideFilter
            type={"Brand"}
            items={brandOptions}
            setSelected={setSelectedBrand}
          />
          <View className="mr-4" />
          <RideFilter
            type={"Segment"}
            items={segmentOption}
            setSelected={setSelectedSegment}
          />
          <View className="mr-4" />
        </ScrollView>
      </View>
      {/* Replace this view with scrollview and remove top level scrollview if you want only the items to be scrollable */}
      {isLoading ? (
        <ActivityIndicator size={"small"} />
      ) : (
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          {filteredRides.map((ride, index) => {
            return (
              <View key={index} className="mb-6">
                <Ride
                  name={ride.vehicle_name}
                  id={ride.id}
                  url={ride.thumbnail_image}
                  availability={5}
                  price={ride.price.Daily}
                />
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
};

export default RideSelectionScreen;
