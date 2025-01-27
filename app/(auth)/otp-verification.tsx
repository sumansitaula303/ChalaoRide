import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";

export default function OTPVerification() {
  const { access_token, email } = useLocalSearchParams();
  // console.log(token);
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const [showVerifiedModal, setShowVerifiedModal] = useState(false);
  const [redirectTimer, setRedirectTimer] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let interval: any;
    if (showVerifiedModal) {
      interval = setInterval(() => {
        setRedirectTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(interval);
            setShowVerifiedModal(false);
            router.push("/(auth)/login");
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showVerifiedModal]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleVerify = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const otpString = otp.join(""); // Combine OTP digits

      if (otpString.length !== 6) {
        setError("Please enter complete OTP");
        return;
      }

      const response = await axios.post(
        "https://chalao.pythonanywhere.com/api/auth/verify-otp/",
        { otp: otpString },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
        },
      );
      console.log(response.data);

      if (response.data.detail === "Email verified successfully") {
        setShowVerifiedModal(true);
        setRedirectTimer(5);
        console.log("a", response.data);
      }
      if (response.data.detail !== "Email verified successfully") {
        setError("OTP didn't match");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to verify OTP");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
      console.log(error);
    }
  };

  const handleResend = () => {
    if (timer > 0) {
      Alert.alert(
        "Please wait",
        `Please wait ${timer} seconds before requesting a new code.`,
      );
    } else {
      // Implement resend logic here
      setTimer(60);
      Alert.alert(
        "Code Sent",
        "A new verification code has been sent to your email.",
      );
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
        <View className="w-full mt-4">
          <Text className="text-gray-500 text-center font-sans-light">
            Didn't get the code?
            <Text className="text-black" onPress={handleResend}>
              {" "}
              Send Again
            </Text>
          </Text>
          <Text className="text-gray-500 text-center mt-1 font-sans-light">
            {`${Math.floor(timer / 60)
              .toString()
              .padStart(2, "0")}:${(timer % 60).toString().padStart(2, "0")}`}
          </Text>
        </View>
        <TouchableOpacity
          className="bg-primary rounded-lg p-4 items-center w-full mt-6"
          onPress={handleVerify}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-sans-medium">Verify OTP</Text>
          )}
        </TouchableOpacity>
        {error && (
          <Text className="text-red-500 text-center mt-2">{error}</Text>
        )}
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
        <View className="mt-6">
          <Text className="text-center text-gray-500 text-xs font-sans-light">
            By Signing in, you are agreeing to our{" "}
            <Text className="text-primary underline">Terms of use</Text> and{" "}
            <Text className="text-primary underline">Privacy Policy</Text>.
          </Text>
        </View>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={showVerifiedModal}
        onRequestClose={() => setShowVerifiedModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-70">
          <View className="bg-white p-6 rounded-lg items-center">
            <Image
              source={require("../../assets/images/otpverified.png")}
              className="w-40 h-40"
              resizeMode="contain"
            />
            <Text className="text-xl font-sans-medium mt-4">
              OTP Verification Successful
            </Text>
            <Text className="text-sm text-gray-500 mt-2 text-center">
              Redirecting to login in {redirectTimer} seconds...
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
