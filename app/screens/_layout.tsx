import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const Layout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="RideSelectionScreen"
        options={{
          headerStyle: { backgroundColor: "white" },
          headerShadowVisible: false,
          headerShown: false,
          headerRight: () => (
            <Ionicons
              name="notifications-outline"
              size={24}
              color="black"
              onPress={() => null}
            />
          ),
        }}
      />
      <Stack.Screen
        name="CurrentSubscription"
        options={{
          headerStyle: { backgroundColor: "white" },
          headerShadowVisible: false,
          headerShown: false,
          title: "Current Subscription",
        }}
      />
       <Stack.Screen
        name="UserImage"
        options={{
          headerStyle: { backgroundColor: "white" },
          headerShadowVisible: false,
          headerShown: false,
          title: "Current Subscription",
        }}
      />
      <Stack.Screen
        name="Checkout"
        options={{
          headerStyle: { backgroundColor: "white" },
          headerShadowVisible: false,
          headerShown: false,
          title: "Current Subscription",
        }}
      />
      <Stack.Screen
        name="DetailsOfBike"
        options={{
          headerStyle: { backgroundColor: "white" },
          headerShadowVisible: false,
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ExtendBooking"
        options={{
          headerStyle: { backgroundColor: "white" },
          headerShadowVisible: false,
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="MyCitizenshipForm"
        options={{
          headerStyle: { backgroundColor: "white" },
          headerShadowVisible: false,
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="MyLicenseForm"
        options={{
          headerStyle: { backgroundColor: "white" },
          headerShadowVisible: false,
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ReasonForExtend"
        options={{
          headerStyle: { backgroundColor: "white" },
          headerShadowVisible: false,
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="CancelBooking"
        options={{
          headerStyle: { backgroundColor: "#F4F4F4" },
          headerShadowVisible: false,
          headerShown: true,
          title: "Cancel Booking",
        }}
      />
      <Stack.Screen
        name="RequestToBook"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="MyBookingScreen"
        options={{
          headerStyle: { backgroundColor: "white" },
          headerShadowVisible: false,
          headerShown: false,
          title: "Pickup",
          headerRight: () => (
            <Ionicons
              name="notifications-outline"
              size={24}
              color="black"
              onPress={() => null}
            />
          ),
        }}
      />
    </Stack>
  );
};

export default Layout;
