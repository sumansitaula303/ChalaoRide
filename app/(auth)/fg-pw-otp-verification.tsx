import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";

export default function OTPVerification() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [new_password, setNewPassword] = useState(""); // Store new password
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const [showVerifiedModal, setShowVerifiedModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { email } = useLocalSearchParams();

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleVerify = async () => {
    console.log("Starting OTP verification process");

    const otpString = otp.join(""); // Combine OTP digits
    console.log("OTP String:", otpString);

    // Check OTP validity
    if (otpString.length !== 5) {  // Ensure OTP is complete (5 digits)
      setError("Please enter complete OTP");
      console.log("OTP length is invalid");
      return;
    }

    // Check if new password is provided
    if (!new_password) {
      setError("Please enter a new password");
      console.log("No new password provided");
      return;
    }

    console.log("OTP and password are valid, proceeding to verification...");

    try {
      // Create FormData
      const formData = new FormData();
      formData.append('otp', otpString);  // Append OTP
      formData.append('email', Array.isArray(email) ? email[0] : email);  // Append email
      formData.append('new_password', new_password);  // Append new password

      

      // After OTP verification, reset the password
      const passwordResponse = await axios.post(
        "https://chalao.pythonanywhere.com/api/auth/password-reset-confirm/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",  // Ensure FormData is used for password reset as well
          },
        }
      );

      console.log("Password Reset Response:", passwordResponse.data);

      if (passwordResponse.data.detail === "Password reset successful") {
        setShowVerifiedModal(true);
        router.push("/(auth)/login");  // Navigate to login after successful reset
      } else {
        setError("Failed to reset password");
        console.log("Password reset failed");
      }
      
    } catch (err) {
      console.error("Error occurred:", err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to verify OTP");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };
  

  

  return (
    <SafeAreaView className="flex-1 bg-white items-center">
      <View className="w-[90%] items-center mt-12">
        <Image
          source={require("../../assets/images/logo.png")}
          className="w-full h-[90px] max-w-[310px]"
          resizeMode="contain"
          accessibilityLabel="Chaloo Logo"
        />
        <Text className="text-2xl font-sans mt-11">OTP Verification</Text>
        <Text className="text-center mt-4 text-gray-500 font-sans-light">
          We have sent an OTP to your mail{"\n"}
          {email}
        </Text>

        {/* Email Input */}
        <TextInput
          placeholder="Enter your email"
          className="w-full h-12 border border-gray-300 rounded-lg p-3 mt-4"
          editable={false}
          value={Array.isArray(email) ? email[0] : email}
        />

        {/* New Password Input */}
        <TextInput
          placeholder="Enter your new password"
          secureTextEntry
          className="w-full h-12 border border-gray-300 rounded-lg p-3 mt-4"
          value={new_password}
          onChangeText={setNewPassword}
        />

        {/* OTP Inputs */}
        <View className="flex-row justify-between w-full mt-7">
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              className="w-10 h-10 border border-primary rounded-lg text-center text-sm"
              maxLength={1}
              keyboardType="numeric"
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
            />
          ))}
        </View>

        {/* <View className="w-full mt-4">
          <Text className="text-gray-500 text-center font-sans-light">
            Didn't get the code?
            <Text className="text-black" onPress={handleResend}>
              {" "}
              Send Again
            </Text>
          </Text>
        </View> */}

        <TouchableOpacity
          className="bg-primary rounded-lg p-4 items-center w-full mt-6"
          onPress={()=>handleVerify()}
          disabled={isLoading}
        >
          <Text className="text-white font-sans-medium">
            {isLoading ? "Verifying..." : "Confirm change password"}
          </Text>
        </TouchableOpacity>

        <View className="mt-6">
          <Text className="text-center font-sans-light">
            Already have an Account?{" "}
            <Text
              className="text-primary font-sans-medium"
              onPress={() => router.push("/(auth)/login")}
            >
              Login
            </Text>
          </Text>
        </View>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={showVerifiedModal}
        onRequestClose={() => setShowVerifiedModal(false)}
      >
        {/* Modal content goes here */}
      </Modal>
    </SafeAreaView>
  );
}
