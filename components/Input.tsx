import React from "react";
import { View, TextInput, Text, TextInputProps } from "react-native";

interface InputProps extends TextInputProps {
  error?: string;
}

const Input: React.FC<InputProps> = ({ error, ...props }) => {
  return (
    <View className="mb-4">
      <TextInput
        className="border border-gray-300 rounded-md p-2 bg-white"
        {...props}
      />
      {error && <Text className="text-red-500 mt-1">{error}</Text>}
    </View>
  );
};

export default Input;
