import React from "react";
import { TouchableOpacity, Text, TouchableOpacityProps } from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
}

const Button: React.FC<ButtonProps> = ({ title, ...props }) => {
  return (
    <TouchableOpacity
      className="bg-primary-500 rounded-md p-3 items-center"
      {...props}
    >
      <Text className="text-white font-bold">{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;
