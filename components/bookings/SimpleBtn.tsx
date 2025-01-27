import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
type simpleBtnProps = {
  borderColor: string;
  title: string;
  onClick: () => void;
};
const SimpleBtn = ({ borderColor, title, onClick }: simpleBtnProps) => {
  const btnClass = `border-["${borderColor}"] bg-white border px-4 py-3 rounded-lg shadow-sm`;
  return (
    <TouchableOpacity onPress={onClick}>
      <View style={{ borderColor: borderColor }} className={btnClass}>
        <Text className=" text-sm font-medium">{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default SimpleBtn;
