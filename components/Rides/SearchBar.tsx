import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = "Search vehicles...",
}) => {
  return (
    <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2">
      <Ionicons name="search-outline" size={20} color="#666" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        className="flex-1 ml-2 text-base"
        placeholderTextColor="#666"
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText("")}>
          <Ionicons name="close-circle" size={20} color="#666" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBar;
