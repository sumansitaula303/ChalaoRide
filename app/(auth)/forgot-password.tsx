import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "expo-router";
import axios from "axios";
import { api_url } from "@/context/AuthContext";

const schema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required!" })
    .email({ message: "Please enter a valid email address!" }),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      // Send a POST request to the password reset endpoint
      const response = await axios.post(`${api_url}/api/auth/password-reset/`, {
        email: data.email,
      });

      // Check if the request was successful
      if (response.status === 200) {
        console.log("Password reset requested for:", data.email);
        alert("Check your mail for the OTP.");
        router.push({
          pathname: "/fg-pw-otp-verification",
          params: {
            email: data.email,
          },
        });
          
        
      }
    } catch (error: any) {
      // Check if the error response indicates the email does not exist
      if (error.response && error.response.status === 404) {
        alert("The email address does not exist.");
      } else {
        console.error("Error requesting password reset:", error);
        alert("An error occurred. Please try again.");
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1, justifyContent: "flex-start", padding: 20 }}>
          <View style={{ alignItems: "center", marginTop: 30 }}>
            <Image
              source={require("../../assets/images/logo.png")}
              style={{
                width: "80%",
                height: 80,
                maxWidth: 310,
              }}
              resizeMode="contain"
              accessibilityLabel="App Logo"
            />
          </View>

          <View style={{ width: "100%", marginTop: 100 }}>
            <Text
              style={{ fontSize: 24, fontWeight: "bold", marginBottom: 12 }}
            >
              Forgot Password
            </Text>
            <Text style={{ color: "#6B7280", marginBottom: 24 }}>
              Enter your email address and we'll send you instructions to reset
              your password.
            </Text>

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={{
                    backgroundColor: "#f3f4f6",
                    borderRadius: 8,
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    marginBottom: 12,
                    fontSize: 16,
                    color: "#333",
                  }}
                  placeholder="Enter Email Address"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onChangeText={onChange}
                  value={value}
                  accessibilityLabel="Email Input Field"
                />
              )}
            />
            {errors.email && (
              <Text style={{ color: "#ef4444", marginBottom: 12 }}>
                {errors.email.message}
              </Text>
            )}

            <TouchableOpacity
              style={{
                backgroundColor: "#FF6F20",
                borderRadius: 8,
                paddingVertical: 14,
                alignItems: "center",
                marginBottom: 24,
              }}
              onPress={handleSubmit(onSubmit)}
              accessibilityRole="button"
              accessibilityLabel="Reset Password Button"
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>
                Send Reset Instructions
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
