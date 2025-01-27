import React from "react";
import { View, Image, Text } from "react-native";
import { styled } from "nativewind";

const StyledView = styled(View);
const StyledImage = styled(Image);
const StyledText = styled(Text);

export default function SplashScreen() {
  return (
    <StyledView className="flex-1 items-center justify-center bg-white">
      <StyledView className="items-center z-10">
        <StyledImage
          source={require("../../assets/images/logo.png")}
          style={{ width: 350, height: 90 }} // Increased the logo size
          resizeMode="contain"
        />
        <StyledText className="mt-2 text-sm text-gray-700 font-bold">
          {" "}
          #rent, ride, revolutionize
        </StyledText>
      </StyledView>
      <StyledView className="absolute bottom-0 left-0 w-full h-40 bg-[#FFF5F0] rounded-t-[100%]" />
      <StyledView className="absolute top-8 right-8 w-32 h-32 bg-[#FFF5F0] rounded-full" />
      <StyledView className="absolute bottom-[-40] left-[-40] w-32 h-32 bg-primary-400 rounded-full" />
    </StyledView>
  );
}
