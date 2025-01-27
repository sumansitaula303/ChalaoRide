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
      // Here you would implement the password reset request
      console.log("Password reset requested for:", data.email);
      // Show success message and navigate back to login
      alert("If an account exists with this email, you will receive reset instructions.");
      router.back();
    } catch (error) {
      console.error("Error requesting password reset:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ flex: 1, justifyContent: "space-between", padding: 20 }}>
            <TouchableOpacity
              style={{ marginTop: 10 }}
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Go Back"
            >
              <Text style={{ color: "#3b82f6" }}>← Back to Login</Text>
            </TouchableOpacity>

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

            <View style={{ width: "100%", marginTop: 30 }}>
              <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 12 }}>
                Forgot Password
              </Text>
              <Text style={{ color: "#6B7280", marginBottom: 24 }}>
                Enter your email address and we'll send you instructions to reset your password.
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
                  backgroundColor: "#3b82f6",
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
