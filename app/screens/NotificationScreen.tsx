import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";

const notifications = [
  {
    id: "1",
    title: "New bike available",
    message: "Check out our latest model!",
    time: "2h ago",
  },
  {
    id: "2",
    title: "Maintenance reminder",
    message: "Your bike is due for a check-up",
    time: "1d ago",
  },
  {
    id: "3",
    title: "Special offer",
    message: "Get 20% off on your next ride",
    time: "3d ago",
  },
];
type NotificationItemProps = {
  title: string;
  message: string;
  time: string;
};
const NotificationItem = ({ title, message, time }: NotificationItemProps) => (
  <View
    style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: "#E5E7EB" }}
  >
    <Text style={{ fontSize: 16, fontWeight: "600", color: "#1F2937" }}>
      {title}
    </Text>
    <Text style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>
      {message}
    </Text>
    <Text style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>{time}</Text>
  </View>
);

const NotificationScreen = () => {
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <Stack.Screen
        options={{
          title: "Notifications",
          headerShown: true,
          headerShadowVisible: false,
        }}
      />
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NotificationItem {...item} />}
      />
    </View>
  );
};

export default NotificationScreen;
