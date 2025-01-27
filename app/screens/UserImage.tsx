import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { getUserProfile, userImage } from "@/constants/apiService"; // Assuming there's a function to fetch the profile
import { api_url, useAuth } from "@/context/AuthContext";
import axios from "axios"; // Import axios

const MyPhotoUploadScreen: React.FC = () => {
  const { authState } = useAuth();

  const [capturedImages, setCapturedImages] = useState<{
    user_image_top: string | null;
    user_image_left: string | null;
    user_image_right: string | null;
  }>({
    user_image_top: null,
    user_image_left: null,
    user_image_right: null,
  });


  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchImagesFromAPI();
  }, []);

  const fetchImagesFromAPI = async () => {
    try {
      if (!authState?.token) {
        setErrorMessage("Authentication token is missing. Please log in again.");
        return;
      }

      const response = await getUserProfile(authState.token as string);
 
      if (!response) {
        setErrorMessage("Failed to fetch user profile. Please try again.");
        return;
      }

      const images = {
        user_image_top: response.data.user_image_top ? `${api_url}${response.data.user_image_top}` : null,
        user_image_left: response.data.user_image_left ? `${api_url}${response.data.user_image_left}` : null,
        user_image_right: response.data.user_image_right ? `${api_url}${response.data.user_image_right}` : null,
      };

      setCapturedImages(images);
      // Check if any of the images are missing and show an error if needed
     
      if (!images.user_image_top || !images.user_image_left || !images.user_image_right) {
        setErrorMessage("Please capture all required images (Front, Left, and Right) before proceeding.");
      } else {
        setErrorMessage(""); // Clear any previous error if all images are present
      }
    } catch (error) {
      console.error("Error fetching images:", error);
      setErrorMessage("Failed to fetch user images. Please try again.");
    }
  };

  const openCamera = async (label: "user_image_top" | "user_image_left" | "user_image_right") => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      alert("Permission to access camera is required!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 0.5,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;

      setCapturedImages((prev) => ({ ...prev, [label]: uri }));
    }
  };

  const handleNext = async () => {
    const { user_image_top, user_image_left, user_image_right } = capturedImages;
  
    // Check if all images are captured
    if (!user_image_top || !user_image_left || !user_image_right) {
      setErrorMessage("Please capture all required images (Front, Left, and Right) before proceeding.");
      return;
    }
  
    // Clear error message
    setErrorMessage("");
  
    try {
      // Ensure we pass the correct tokens and image data
      const response = await userImage(authState?.token ?? '', authState?.refreshToken ?? '', {
        user_image_top,
        user_image_left,
        user_image_right
      });
  console.log("Image Response from API", response);
      // After successful upload, navigate to next screen
      router.push({
        pathname: "/screens/MyCitizenshipForm",
        params: {
          user_image_top,
          user_image_left,
          user_image_right,
        },
      });
    } catch (error) {
      console.error("Error uploading images:", error);
      setErrorMessage("Failed to upload images. Please try again.");
    }
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={router.back}>
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>User Photos</Text>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Image Capture Sections */}
        {["user_image_top", "user_image_left", "user_image_right"].map((label) => (
          <View key={label} style={styles.photoHolder}>
            <Text style={styles.uploadTitle}>
              {label === "user_image_top" ? "Front Photo" : label === "user_image_left" ? "Left Side Photo" : "Right Side Photo"}
            </Text>
            <View style={styles.uploadBox}>
              <TouchableOpacity
                style={styles.iconHolder}
                onPress={() => openCamera(label as "user_image_top" | "user_image_left" | "user_image_right")}
              >
                {capturedImages[label as keyof typeof capturedImages] ? (
  <Image
    source={{
      uri: `${capturedImages[label as keyof typeof capturedImages]}`, // Prepend base URL
    }}
    style={styles.image} // Ensure styles.image sets the dimensions and style of your image
  />
) : (
  <Ionicons name="camera-outline" size={60} color="#FF6100" />
)}
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Error Message */}
        {errorMessage ? (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        ) : null}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.prevButton} onPress={router.back}>
            <Text style={styles.prevbuttonText}>Previous</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext} // Call handleNext instead of direct navigation
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:5,
    backgroundColor: "#F2F2F2",
  },
  header: {
    backgroundColor: "#F2F2F2",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  photoHolder: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
    marginBottom: 20,
    width: "95%",
    marginHorizontal: 10,
  },
  uploadTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  uploadBox: {
    borderRadius: 8,
    width: "60%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 5,
  },
  iconHolder: {
    backgroundColor: "#F8F8F8",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  nextButton: {
    backgroundColor: "#FF6100",
    paddingVertical: 10,
    width: "45%",
    borderRadius: 8,
    alignItems: "center",
  },
  prevButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    width: "45%",
    borderRadius: 8,
    borderColor: "#FF6100",
    borderWidth: 1,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
  },
  prevbuttonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FF6100",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  errorMessage: {
    color: "red",
    fontSize: 16,
    marginBottom: 15,
    textAlign: "center",
  },
});

export default MyPhotoUploadScreen;
