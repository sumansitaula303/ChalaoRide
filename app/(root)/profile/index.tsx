import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  useWindowDimensions,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

import NotificationList from "../../../components/profile/notificationList";
import Support from "../../../components/profile/support/Support";
import MyInformation from "@/components/profile/my_information/myinfoform";
import { api_url, useAuth } from "@/context/AuthContext";

import { getUserProfile, updateUserProfileImage } from "@/constants/apiService"; // Import update function


const ProfileScreen = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [showMyInformation, setShowMyInformation] = useState(false);
  const [profile_picture, setProfileImage] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [phonenumber, setphonenumber] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const { width } = useWindowDimensions();
  const { authState, onLogout } = useAuth();

 

  
  useEffect(() => {
    const loadProfileData = async () => {
      if (!authState?.token) return; // Check if the user is authenticated

      setLoading(true);
      try {
        // Fetch profile data directly from API without SecureStore
        const profileData = await getUserProfile(authState?.token);
        console.log("profileData", profileData?.data);
        if (profileData) {
                
          const profilePicture = profileData.data.user.profile_picture || "https://via.placeholder.com/100";
          
        
        // Concatenate BASE_URL with the profile image path
        const fullImageUrl = profilePicture.startsWith("https")
          ? profilePicture  // Already a full URL, no need to prepend BASE_URL
          : `${api_url}${profilePicture}`;
         console.log("fullImageUrl", fullImageUrl);

        setProfileImage(fullImageUrl); // Update the profile picture state with the full URL
   

        setName(profileData.data.user.full_name);
        setphonenumber(profileData.data.user.phonenumber);
        } else {
          console.warn("No profile data found.");
        }
      } catch (error) {
        console.error("Failed to load profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (authState?.token) {
      loadProfileData();
    }
  }, [authState]);
 

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: () => {
          onLogout?.();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  const handleImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission required", "Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImageUri = result.assets[0].uri;
      setProfileImage(selectedImageUri);
   

      // Upload image to the server
      try {
        const formData = new FormData();
        const response = await fetch(selectedImageUri);
        const blob = await response.blob();
        formData.append("user[profile_picture]", blob, "profile.jpg");

        // Call API to update profile picture
        if (authState?.token) {
          const updatedProfile = await updateUserProfileImage(authState.token, selectedImageUri);
            
        
       

        // Assuming the server returns the updated profile picture URL (adjust if necessary)
        const newProfilePictureUrl = updatedProfile?.user?.profile_picture || selectedImageUri;
      
        setProfileImage(newProfilePictureUrl);
        } else {
          console.error("Token is not available");
          Alert.alert("Error", "Token is not available.");
        }
      } catch (error) {
        console.error("Failed to update profile picture:", error);
        Alert.alert("Error", "Failed to update profile picture.");
      }
    }
  };

  interface MenuItemProps {
    icon: string;
    title: string;
    subtitle: string;
    onPress: () => void;
  }

  const MenuItem: React.FC<MenuItemProps> = ({
    icon,
    title,
    subtitle,
    onPress,
  }) => (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
      }}
      onPress={onPress}
    >
      <Ionicons
        name={icon as any}
        size={22}
        color="#6B7280"
        style={{ marginRight: 16 }}
      />
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16, fontWeight: "500", color: "#1F2937" }}>
          {title}
        </Text>
        <Text style={{ fontSize: 14, color: "#6B7280" }}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={22} color="#6B7280" />
    </TouchableOpacity>
  );

  if (showNotifications) {
    return <NotificationList onClose={() => setShowNotifications(false)} />;
  }

  if (showSupport) {
    return <Support onClose={() => setShowSupport(false)} />;
  }

  if (showMyInformation) {
    return <MyInformation onClose={() => setShowMyInformation(false)} />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView>
        <View style={{ paddingHorizontal: 16 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 24,
            }}
          >
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color="#6B7280" />
            </TouchableOpacity>
            <Text style={{ fontSize: 20, fontWeight: "600", color: "#1F2937" }}>
              Profile
            </Text>
            <TouchableOpacity onPress={() => setShowNotifications(true)}>
              <Ionicons name="notifications-outline" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={{ alignItems: "center", marginBottom: 24 }}>
            <TouchableOpacity onPress={handleImagePicker}>
              
              <Image
                source={{ uri: profile_picture || "https://via.placeholder.com/100" 
                 
                }}
                style={{
                  width: width * 0.2,
                  height: width * 0.2,
                  borderRadius: width * 0.1,
                }}
              />
            </TouchableOpacity>
            <Text style={{ marginTop: 8, fontSize: 18, fontWeight: "600", color: "#1F2937" }}>
              {name || "N/A"}
            </Text>
            <Text style={{ color: "#6B7280" }}>{phonenumber || "N/A"}</Text>
          </View>
        </View>

        <MenuItem icon="person-outline" title="My Information" subtitle="View your personal details" onPress={() => setShowMyInformation(true)} />
        <MenuItem icon="document-text-outline" title="KYC Information" subtitle="Update KYC" onPress={() => setShowMyInformation(true)} />
        <MenuItem icon="heart-outline" title="Favorite Bikes" subtitle="View your favorite bikes" onPress={() => {}} />
        <MenuItem icon="headset-outline" title="Support" subtitle="Refunds & Replacement" onPress={() => setShowSupport(true)} />
        <MenuItem icon="document-outline" title="Terms & Conditions" subtitle="Insurance and Coverage" onPress={() => {}} />
        <MenuItem icon="calendar-outline" title="My Subscription" subtitle="View your rides" onPress={() => {}} />

        <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", paddingVertical: 16, paddingHorizontal: 16, marginTop: 16 }} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#6B7280" style={{ marginRight: 16 }} />
          <Text style={{ fontSize: 16, fontWeight: "500", color: "#1F2937" }}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
