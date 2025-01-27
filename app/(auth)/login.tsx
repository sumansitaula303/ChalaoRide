import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import { useAuth } from "@/context/AuthContext";

// Updated schema using similar approach to SignUpSchema
const schema = z.object({
  usernameOrEmail: z
    .string()
    .min(1, { message: "Username or email is required!" })
    .refine(
      (value) => {
        // Check if the input is either a valid email or username
        const isEmail = z.string().email().safeParse(value).success;
        const isUsername = /^[a-zA-Z0-9_]{3,}$/.test(value);
        return isEmail || isUsername;
      },
      { message: "Please enter a valid username or email address!" },
    )
    .transform((value) => {
      // If it's a valid email, transform to lowercase
      const isEmail = z.string().email().safeParse(value).success;
      if (isEmail) {
        return value.toLowerCase();
      }
      return value; // Return username as is
    }),
  password: z
    .string()
    .min(1, { message: "Password is required!" })
    .min(6, { message: "Password must be at least 6 characters!" }),
});


type FormData = z.infer<typeof schema>;

export default function LoginScreen() {
  const { onLogin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    if (onLogin) {
      setIsLoading(true);
      try {
        const loginResult = await onLogin(data.usernameOrEmail, data.password);

        if (loginResult?.error) {
          alert("Login failed: " + loginResult.msg);
        } else {
          router.push("/(root)");
        }
      } catch (error) {
        console.error("Unexpected error during login:", error);
        alert("An unexpected error occurred. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView className="flex-1">
          <View className="flex-1 justify-between p-5" style={{ zIndex: 10 }}>
            <View className="items-center mt-10">
              <Image
                source={require("../../assets/images/logo.png")}
                className="w-4/5 h-20 max-w-[310px]"
                resizeMode="contain"
                accessibilityLabel="App Logo"
              />
            </View>

            <View className="w-full mt-10">
              <Controller
                control={control}
                name="usernameOrEmail"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className="bg-gray-100 rounded-lg p-4 mb-4"
                    placeholder="Enter Username or Email"
                    placeholderTextColor="#999" // Ensures placeholder is visible
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onChangeText={onChange}
                    value={value}
                    accessibilityLabel="Username or Email InputField"
                  />
                )}
              />
              {errors.usernameOrEmail && (
                <Text className="text-red-500 mb-2">
                  {errors.usernameOrEmail.message}
                </Text>
              )}

              <View className="relative">
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      className="bg-gray-100 rounded-lg p-4 mb-4 pr-12"
                      placeholder="Enter Password"
                      placeholderTextColor="#999" // Ensures placeholder is visible
                      secureTextEntry={!showPassword}
                      onChangeText={onChange}
                      value={value}
                      accessibilityLabel="Password InputField"
                    />
                  )}
                />
                <TouchableOpacity
                  className="absolute right-4 top-4"
                  onPress={togglePasswordVisibility}
                  accessibilityRole="button"
                  accessibilityLabel="Toggle Password Visibility"
                >
                  {showPassword ? (
                    <EyeOff size={24} color="gray" />
                  ) : (
                    <Eye size={24} color="gray" />
                  )}
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text className="text-red-500 mb-2">
                  {errors.password.message}
                </Text>
              )}

              <TouchableOpacity
                className="self-end mb-4"
                onPress={() => router.push("./forgot-password")}
                accessibilityRole="button"
                accessibilityLabel="Forgot Password Button"
              >
                <Text className="text-gray-500">Forgot Password?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-primary rounded-lg p-4 items-center mb-10"
                onPress={handleSubmit(onSubmit)}
                disabled={isLoading}
                accessibilityRole="button"
                accessibilityLabel="Login Button"
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-sans-bold">Login</Text>
                )}
              </TouchableOpacity>

              <View className="items-center mb-4">
                <Text className="font-sans">New User? Create Account</Text>
                <TouchableOpacity
                  className="border border-gray-300 rounded-lg py-2 px-8 mt-2"
                  onPress={() => router.push("/(auth)/signup")}
                  accessibilityRole="button"
                  accessibilityLabel="Signup Button"
                >
                  <Text className="font-sans">Signup</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="items-center mt-4">
              <Text className="text-center text-gray-500 font-sans">
                By Signing in, you are agreeing to our{" "}
                <Text className="text-primary underline">Terms of use</Text> and{" "}
                <Text className="text-primary underline">Privacy Policy.</Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
