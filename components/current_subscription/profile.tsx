import { View, Text, Image } from "react-native";
import React from "react";
type props = {
  uri: string;
};
const ProfileImage = ({ uri }: props) => {
  return (
    <View className=" border border-primary rounded-full">
      <Image className=" h-12 w-12 rounded-full" source={{ uri: uri }} />
    </View>
  );
};

export default ProfileImage;
