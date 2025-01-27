import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const SearchBar = () => {
  return (
    <View className="flex-row items-center bg-white border-gray-200 px-3 py-4 shadow rounded-lg border">
      <Ionicons name="search" size={20} color="gray" />
      <TextInput
        className="flex-1 ml-2"
        placeholder="Search 'TVS Ntorq 125 BS6 Scooter'"
        placeholderTextColor="gray"
      />
      <TouchableOpacity>
        <Ionicons name="mic" size={20} color="gray" />
      </TouchableOpacity>
    </View>
  );
};
