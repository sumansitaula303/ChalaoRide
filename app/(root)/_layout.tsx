import React from "react";
import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { View, useWindowDimensions } from "react-native";
import { styled } from "nativewind";

const StyledView = styled(View);

function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
}) {
  return (
    <StyledView className="items-center justify-center">
      <Ionicons size={24} {...props} />
    </StyledView>
  );
}

export default function RootLayout() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const isSmallDevice = width < 375;

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "#FF6100",
        tabBarInactiveTintColor: "#666666",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#E5E5E5",
          height: isLandscape ? 60 : isSmallDevice ? 60 : 65,
          // paddingBottom: isLandscape ? 5 : isSmallDevice ? 5 : 5,
          // paddingTop: 0,
        },
        headerShown: false,
        tabBarItemStyle: {
          paddingVertical: isLandscape ? 5 : isSmallDevice ? 5 : 12,
        },
        tabBarLabelStyle: {
          fontFamily: "Poppins-Medium",
          fontSize: isLandscape ? 10 : isSmallDevice ? 10 : 12,
          // marginTop: isLandscape ? 0 : isSmallDevice ? 2 : 2,
        },
        tabBarIcon: ({ color, focused }) => {
          let iconName: React.ComponentProps<typeof Ionicons>["name"] =
            "information-circle-outline"; // default value

          if (route.name === "index") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "bookings/index") {
            iconName = focused ? "calendar" : "calendar-outline";
          } else if (route.name === "offers/index") {
            iconName = focused ? "pricetag" : "pricetag-outline";
          } else if (route.name === "profile/index") {
            iconName = focused ? "person" : "person-outline";
          }

          return <TabBarIcon name={iconName} color={color} />;
        },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarLabel: "Home",
        }}
      />
      <Tabs.Screen
        name="bookings/index"
        options={{
          title: "My Booking",
          tabBarLabel: "My Booking",
        }}
      />

      <Tabs.Screen
        name="offers/index"
        options={{
          title: "Offers",
          tabBarLabel: "Offers",
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: "Profile",
          tabBarLabel: "Profile",
        }}
      />
    </Tabs>
  );
}
