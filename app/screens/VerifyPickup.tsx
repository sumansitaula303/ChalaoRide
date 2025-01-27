import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

interface VehicleImages {
  vehicle_image_front: string | null;
  vehicle_image_back: string | null;
  vehicle_image_left: string | null;
  vehicle_image_right: string | null;
  vehicle_image_speedometer: string | null;
}

export default function UploadImagesScreen() {
  const { booking_id } = useLocalSearchParams();
  const b_id = Array.isArray(booking_id) ? booking_id[0] : booking_id;

  console.log(booking_id);
  const router = useRouter();
  const { authState } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showImagePickerModal, setShowImagePickerModal] = useState(false);
  const [selectedImageType, setSelectedImageType] = useState<
    keyof VehicleImages | null
  >(null);
  const [images, setImages] = useState<VehicleImages>({
    vehicle_image_front: null,
    vehicle_image_back: null,
    vehicle_image_left: null,
    vehicle_image_right: null,
    vehicle_image_speedometer: null,
  });

  const requestPermissions = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const galleryPermission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!cameraPermission.granted || !galleryPermission.granted) {
      Alert.alert(
        "Permission required",
        "Camera and gallery permissions are required to use this feature",
      );
      return false;
    }
    return true;
  };

  const handleImageFromCamera = async () => {
    if (!selectedImageType) return;

    try {
      const hasPermissions = await requestPermissions();
      if (!hasPermissions) return;

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled) {
        setImages((prev) => ({
          ...prev,
          [selectedImageType]: result.assets[0].uri,
        }));
      }
    } catch (error) {
      console.error("Error capturing image:", error);
      Alert.alert("Error", "Failed to capture image");
    } finally {
      setShowImagePickerModal(false);
      setSelectedImageType(null);
    }
  };

  const handleImageFromGallery = async () => {
    if (!selectedImageType) return;

    try {
      const hasPermissions = await requestPermissions();
      if (!hasPermissions) return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled) {
        setImages((prev) => ({
          ...prev,
          [selectedImageType]: result.assets[0].uri,
        }));
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    } finally {
      setShowImagePickerModal(false);
      setSelectedImageType(null);
    }
  };

  const showImageOptions = (imageType: keyof VehicleImages) => {
    setSelectedImageType(imageType);
    setShowImagePickerModal(true);
  };

  const uploadImages = async () => {
    // if (!authState?.token) {
    //   Alert.alert("Error", "You must be logged in to upload images");
    //   return;
    // }

    // Check if all images are selected
    const missingImages = Object.entries(images).filter(([_, value]) => !value);
    if (missingImages.length > 0) {
      Alert.alert("Missing Images", "Please select all required images");
      return;
    }

    setLoading(true);
    const formData = new FormData();

    // Add booking ID (you'll need to get this from your app's state or navigation params)
    formData.append("booking_id", b_id); // Replace with actual booking ID

    // Append each image to formData
    for (const [key, uri] of Object.entries(images)) {
      if (uri) {
        const uriParts = uri.split(".");
        const fileType = uriParts[uriParts.length - 1];

        formData.append(key, {
          uri,
          name: `${key}.${fileType}`,
          type: `image/${fileType}`,
        } as any);
      }
    }

    try {
      const response = await axios.post(
        "https://chalao.pythonanywhere.com/api/booking/upload-images/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            // Authorization: `Bearer ${authState.token}`,
          },
        },
      );
      //   console.log(response);
      Alert.alert("Success", "Images uploaded successfully");
      console.log(response.data);
      router.back();
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert("Error", "Failed to upload images");
    } finally {
      setLoading(false);
    }
  };

  const ImagePickerModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showImagePickerModal}
      onRequestClose={() => setShowImagePickerModal(false)}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-3xl p-4">
          <Text className="text-xl font-semibold text-center mb-4">
            Choose Image Source
          </Text>

          <TouchableOpacity
            className="flex-row items-center p-4 border-b border-gray-200"
            onPress={handleImageFromCamera}
          >
            <Ionicons name="camera-outline" size={24} color="#6B7280" />
            <Text className="ml-4 text-lg">Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center p-4 border-b border-gray-200"
            onPress={handleImageFromGallery}
          >
            <Ionicons name="images-outline" size={24} color="#6B7280" />
            <Text className="ml-4 text-lg">Choose from Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="p-4 mt-2"
            onPress={() => setShowImagePickerModal(false)}
          >
            <Text className="text-center text-primary text-lg">Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const ImageUploadCard = ({
    title,
    imageUri,
    onPress,
  }: {
    title: string;
    imageUri: string | null;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      className="bg-gray-100 rounded-lg p-4 mb-4"
      onPress={onPress}
    >
      <Text className="text-gray-700 mb-2 font-semibold">{title}</Text>
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          className="w-full h-48 rounded-lg"
          resizeMode="cover"
        />
      ) : (
        <View className="w-full h-48 bg-gray-200 rounded-lg items-center justify-center">
          <Ionicons name="camera-outline" size={48} color="#6B7280" />
          <Text className="text-gray-500 mt-2">
            Tap to capture or select image
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#6B7280" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold">Upload Vehicle Images</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView className="flex-1 p-4">
        <ImageUploadCard
          title="Front View"
          imageUri={images.vehicle_image_front}
          onPress={() => showImageOptions("vehicle_image_front")}
        />
        <ImageUploadCard
          title="Back View"
          imageUri={images.vehicle_image_back}
          onPress={() => showImageOptions("vehicle_image_back")}
        />
        <ImageUploadCard
          title="Left Side"
          imageUri={images.vehicle_image_left}
          onPress={() => showImageOptions("vehicle_image_left")}
        />
        <ImageUploadCard
          title="Right Side"
          imageUri={images.vehicle_image_right}
          onPress={() => showImageOptions("vehicle_image_right")}
        />
        <ImageUploadCard
          title="Speedometer"
          imageUri={images.vehicle_image_speedometer}
          onPress={() => showImageOptions("vehicle_image_speedometer")}
        />

        <TouchableOpacity
          className="bg-primary rounded-lg p-4 items-center mb-6"
          onPress={uploadImages}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-semibold">Upload Images</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      <ImagePickerModal />
    </SafeAreaView>
  );
}
