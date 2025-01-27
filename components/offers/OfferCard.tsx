import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface OfferCardProps {
  description: string;
  expiryDate: string;
  onPress: () => void;
}

const OfferCard: React.FC<OfferCardProps> = ({
  description,
  expiryDate,
  onPress,
}) => (
  <TouchableOpacity onPress={onPress}>
    <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
      <View className="flex-row justify-between">
        <Text className="text-base flex-1">{description}</Text>
        <Text className="text-blue-500 ml-2">{expiryDate}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

export default OfferCard;
