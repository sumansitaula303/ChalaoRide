import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const HomeSearchBar = () => {
  const handlePress = () => {
    router.push("/screens/SearchScreen");
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View className="flex-row items-center bg-white border-gray-200 px-3 py-3 shadow rounded-full border">
        <Ionicons name="search" size={20} color="gray" />
        <TextInput
          className="flex-1 ml-2"
          placeholder="Search 'TVS Ntorq 125 BS6 Scooter'"
          placeholderTextColor="gray"
          editable={false}
        />
        <Ionicons name="mic" size={20} color="gray" />
      </View>
    </TouchableOpacity>
  );
};
export default HomeSearchBar;
