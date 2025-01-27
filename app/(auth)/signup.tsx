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
  Dimensions,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import { useAuth } from "@/context/AuthContext";

// Updated schema using a cleaner approach
const schema = z
  .object({
    full_name: z
      .string()
      .min(1, { message: "Name is required!" })
      .min(3, { message: "Username must be at least 3 characters" }),
    email: z
      .string()
      .min(1, { message: "Email is required!" })
      .email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(1, { message: "Password is required!" })
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm password is required!" }),
    phonenumber: z
      .string()
      .min(1, { message: "Phone Number is required!" })
      .min(10, { message: "please enter a valid number" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollView: {
    flexGrow: 1,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
    padding: width * 0.05,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: height * 0.05,
  },
  logo: {
    width: width * 0.8,
    height: height * 0.1,
    maxWidth: 310,
    maxHeight: 80,
  },
  formContainer: {
    width: "100%",
    marginTop: height * 0.02,
  },
  input: {
    backgroundColor: "#f3f3f3",
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  errorText: {
    color: "red",
    marginBottom: 8,
  },
  registerButton: {
    backgroundColor: "#ff6100",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: height * 0.02,
    marginBottom: height * 0.03,
  },
  loginContainer: {
    alignItems: "center",
    marginBottom: height * 0.04,
  },
  loginButton: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 32,
    marginTop: 8,
  },
  termsContainer: {
    alignItems: "center",
    marginBottom: height * 0.07,
  },
  termsText: {
    textAlign: "center",
    color: "#6b7280",
  },
  linkText: {
    color: "#ff6100",
    textDecorationLine: "underline",
  },
  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f3f3",
    borderRadius: 8,
    marginBottom: 8,
  },
  passwordInput: {
    flex: 1,
    padding: 16,
  },
  passwordToggle: {
    padding: 10,
  },
});

export default function SignupScreen() {
  const [showPasswords, setShowPasswords] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { onRegister } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!onRegister) {
        throw new Error("Registration function not available");
      }

      const response = await onRegister(
        data.full_name,
        data.password,
        data.confirmPassword,
        data.email,
        data.phonenumber,
      );
      console.log(response.token.access);

      if ("error" in response) {
        setError(response.msg);
      } else {
        router.push({
          pathname: "/otp-verification",
          params: {
            email: data.email,
            access_token: response.token.access,
            refresh_token: response.token.refresh,
          },
        });
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPasswords(!showPasswords);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.logoContainer}>
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.logo}
              resizeMode="contain"
              accessibilityLabel="App Logo"
            />
          </View>

          <View style={styles.formContainer}>
            <Controller
              control={control}
              name="full_name"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Enter Full Name"
                  onChangeText={onChange}
                  value={value}
                  accessibilityLabel="Username Input"
                  placeholderTextColor="#999"
                />
              )}
            />
            {errors.full_name && (
              <Text style={styles.errorText}>{errors.full_name.message}</Text>
            )}

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Enter Email"
                  keyboardType="email-address"
                  onChangeText={(text) => onChange(text.toLowerCase())}
                  value={value}
                  accessibilityLabel="Email Input"
                  placeholderTextColor="#999"
                />
              )}
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email.message}</Text>
            )}
            <Controller
              control={control}
              name="phonenumber"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Phone Number"
                  keyboardType="number-pad"
                  onChangeText={onChange}
                  value={value}
                  accessibilityLabel="Phone Number Input"
                  placeholderTextColor="#999"
                />
              )}
            />
            {errors.phonenumber && (
              <Text style={styles.errorText}>{errors.phonenumber.message}</Text>
            )}

            <View style={styles.passwordInputContainer}>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Enter Password"
                    secureTextEntry={!showPasswords}
                    onChangeText={onChange}
                    value={value}
                    accessibilityLabel="Password Input"
                    placeholderTextColor="#999"
                  />
                )}
              />
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={togglePasswordVisibility}
                accessibilityRole="button"
                accessibilityLabel="Toggle Password Visibility"
              >
                {showPasswords ? (
                  <EyeOff size={24} color="gray" />
                ) : (
                  <Eye size={24} color="gray" />
                )}
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text style={styles.errorText}>{errors.password.message}</Text>
            )}

            <View style={styles.passwordInputContainer}>
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Confirm Password"
                    secureTextEntry={!showPasswords}
                    onChangeText={onChange}
                    value={value}
                    accessibilityLabel="Confirm Password Input"
                    placeholderTextColor="#999"
                  />
                )}
              />
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={togglePasswordVisibility}
                accessibilityRole="button"
                accessibilityLabel="Toggle Password Visibility"
              >
                {showPasswords ? (
                  <EyeOff size={24} color="gray" />
                ) : (
                  <Eye size={24} color="gray" />
                )}
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && (
              <Text style={styles.errorText}>
                {errors.confirmPassword.message}
              </Text>
            )}

            {error && <Text style={styles.errorText}>{error}</Text>}

            <TouchableOpacity
              style={[styles.registerButton, isLoading && { opacity: 0.7 }]}
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
              accessibilityRole="button"
              accessibilityLabel="Register Button"
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  Register
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.loginContainer}>
            <Text>
              Already have an Account?{" "}
              <Text
                style={styles.linkText}
                onPress={() => router.push("/(auth)/login")}
              >
                Login
              </Text>
            </Text>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => router.push("/(auth)/login")}
              accessibilityRole="button"
              accessibilityLabel="Login Button"
            >
              <Text>Login</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              By Signing up, you are agreeing to our{" "}
              <Text style={styles.linkText}>Terms of Use</Text>
              {"\n"}and <Text style={styles.linkText}>Privacy Policy.</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
