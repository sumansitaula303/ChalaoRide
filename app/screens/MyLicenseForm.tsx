import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Modal,
  TouchableWithoutFeedback,
  Switch,
  KeyboardTypeOptions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { submitUserProfile,  getUserProfile, updateLicenseData } from "@/constants/apiService";
import { api_url, useAuth } from "@/context/AuthContext";


interface MyInformationProps {
  onClose: () => void;
}

const InputField = ({
  label,
  value,
  onChange,
  keyboardType,
}: {
  label: string;
  value: string;
  onChange: (text: string) => void;
  keyboardType?: KeyboardTypeOptions;
}) => (
  <View style={styles.inputContainer}>
    <TextInput
      style={styles.input}
      keyboardType={keyboardType}
      value={value}
      placeholderTextColor="#A0AEC0"
      onChangeText={onChange}
    />
  </View>
);

const MyLicenseInformation: React.FC<MyInformationProps> = () => {
  // Load data from the API if available
  const loadUserProfile = async () => {
    try {
      if (!authState?.token) {
        setErrorMessage("Authentication token is missing. Please log in again.");
        return;
      }
      const incomingUserProfile = await getUserProfile(authState.token as string); // Fetch data from the API
      if (incomingUserProfile) {
        console.log("License Profile:", incomingUserProfile.data); // Log the profile data for debugging
      }
      
      if (incomingUserProfile) {
        setlicense_number(incomingUserProfile.data.license_number);
        setexpiry_date(incomingUserProfile.data.expiry_date);
        setissued_district(incomingUserProfile.data.issued_district);

        const FrontPicture = incomingUserProfile.data.driving_license_front;
          
        
        const frontfullImageUrl = FrontPicture && FrontPicture.startsWith("https")
  ? FrontPicture  // Already a full URL, no need to prepend BASE_URL
  : `${api_url}${FrontPicture}`;
  console.log("Front Image URL:", frontfullImageUrl);

setFrontImage(frontfullImageUrl);

       
      } else {
        setErrorMessage("No data found. Please enter your details.");
      }
    } catch (error) {
      console.error("Error loading license info from API:", error);
    }
  };

  useEffect(() => {
    loadUserProfile(); // Load data on component mount
  }, []);

  
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [imageType, setImageType] = useState<"front" | "back" | null>(null);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState<boolean>(false);
  const [allowEditing, setAllowEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const toggleEdit = () => {
    setAllowEditing(!allowEditing);
  };

  const { authState } = useAuth();
  const user = useLocalSearchParams() as {
    full_name: string;
    phonenumber: string;
    address: string;
    dateofbirth: string;
    gender: string;
    occupation: string;
    citizenship_number: string;
    nid_number: string;
    issued_district: string;
    issued_date: string;
    citizenship_front: string;
    citizenship_back: string;

  }
 

  const [license_number, setlicense_number] = useState<number | null>(null);
  const [expiry_date, setexpiry_date] = useState("");
  const [issued_district, setissued_district] = useState("");
  const [driving_license_front, setFrontImage] = useState("");

  const openImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: allowEditing,
      quality: 1,
    });

    if (!result.canceled) {
      if (imageType === "front") {
        setFrontImage(result.assets[0].uri);
        setModalVisible(false);
      }
    }
  };

  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access camera is required!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: allowEditing,
      quality: 1,
    });

    if (!result.canceled) {
      if (imageType === "front") {
        setFrontImage(result.assets[0].uri);
        setModalVisible(false);
      }
    }
  };

  const handleUpload = (type: "front") => {
    setImageType(type);
    setModalVisible(true);
  };

 


  const handleNext = async () => {
    if (!license_number || !expiry_date || !issued_district) {
      setErrorMessage("Please fill all fields before proceeding.");
      return;
    }
    if (!driving_license_front) {
      setErrorMessage("Please upload front image.");
      return;
    }

    const LicenseInfo = {
      license_number: license_number,
      expiry_date: expiry_date,
      issuedDistrict: issued_district,
      licenseFront: driving_license_front,
    };

    try {
      if (!authState?.token || !authState?.refreshToken) {
        setErrorMessage("Authentication tokens are missing. Please log in again.");
        return;
      }
    
      // Pass token and refreshToken to submitUserProfile
      const response = await updateLicenseData( authState.token, authState.refreshToken, LicenseInfo);
      console.log("Final Response API :", response.data);
    
      if (response) {
        console.log("User Profile Submitted:", response);
    
        setErrorMessage(""); // Clear any previous error messages
        setIsSuccessModalVisible(true); // Show success modal
        router.push("/(root)"); // Redirect to the root page
      } else {
        throw new Error("Failed to push user profile data to the API.");
      }
    
    } catch (error) {
      console.error("Error submitting or updating user profile:", error);
      setErrorMessage("Failed to submit or update user profile. Please try again.");
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
          <Text style={styles.headerTitle}>My Information</Text>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Citizenship Details Section */}
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Driving License</Text>
          <InputField label="License Number" keyboardType="numeric" value={license_number ? license_number.toString() : ""} onChange={(text) => setlicense_number(Number(text))} />
          <InputField label="Expiry Date" keyboardType="numeric" value={expiry_date} onChange={setexpiry_date} />
          <InputField label="Issued District" value={issued_district} onChange={setissued_district} />
          {errorMessage ? (
            <View style={styles.errorMessageContainer}>
              <Ionicons
                name="warning-outline"
                size={22}
                color="red"
                style={styles.errorIcon}
              />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}
        </View>

        {/* Upload Photo Section */}
        <View style={styles.photoHolder}>
          <Text style={styles.uploadTitle}>Upload Your Driving License Photo</Text>

          <View
            style={driving_license_front ? styles.afterUploadContainer : styles.uploadContainer}
          >
            <View
              style={driving_license_front ? styles.afterUploadBox : styles.uploadBox}
            >
              <TouchableOpacity
                style={styles.iconHolder}
                onPress={() => handleUpload("front")}
              >
                {driving_license_front ? (
                  <Image
                    source={{ uri: driving_license_front }}
                    style={styles.image}
                  />
                ) : (
                  <Ionicons name="camera-outline" size={60} color="#FF6100" />
                )}
              </TouchableOpacity>
              <Text style={styles.uploadText}>
                Upload Front Part Of Your License
              </Text>
            </View></View>
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleLabel}>Allow Editing</Text>
            <Switch
              value={allowEditing}
              onValueChange={toggleEdit}
              trackColor={{ false: "#767577", true: "#FF6100" }}
              thumbColor={allowEditing ? "#FF6100" : "#f4f3f4"}
            />
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.prevButton} onPress={router.back}>
            <Text style={styles.prevbuttonText}>Previous</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>

        {/* Success Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isSuccessModalVisible}
          onRequestClose={() => setIsSuccessModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => router.push('/(root)')}>
            <View style={styles.modalContainer}>
              <TouchableWithoutFeedback>
                <Image
                  source={require("../../assets/images/waitforkyc.png")}
                  style={{ width: 350, height: 350 }}
                />
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Modal for selecting image source */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Image Source</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={openCamera}
                >
                  <Ionicons name="camera-outline" size={24} color="#FF6100" />
                  <Text style={styles.optionText}>Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={openImagePicker}
                >
                  <Ionicons name="image-outline" size={24} color="#FF6100" />
                  <Text style={styles.optionText}>Gallery</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 2,
    padding: 5,
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
  },
  afterUploadContainer: {
    flexDirection: "column", // Centering the items better
    padding: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  afterUploadBox: {
    borderRadius: 8,
    width: "120%", // Flex width
    aspectRatio: 1.5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 50,
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
    justifyContent: "flex-start",
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  content: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#FFF",
  },
  photoHolder: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center", // Center content horizontally
    marginBottom: 20,
    height: "auto",
    width: "95%",
    marginHorizontal: 10,
  },
  uploadTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 40,
    textAlign: "center", // Center the title
    color: "#333",
  },
  uploadContainer: {
    flexDirection: "row",
    justifyContent: "space-around", // Centering the items better
    width: "100%",
    paddingHorizontal: 20, // Increased padding
  },
  uploadBox: {
    borderRadius: 8,
    width: "45%", // Flex width
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  iconHolder: {
    backgroundColor: "#F8F8F8",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  uploadText: {
    textAlign: "center",
    color: "#333",
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 5,
  },
  optionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderWidth: 1,
    borderColor: "#FF6100",
    borderRadius: 8,
    marginHorizontal: 5,
    backgroundColor: "#fff",
  },
  prevButton: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 10,
    borderColor: "#FF6100",
    borderWidth: 1,
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  nextButton: {
    backgroundColor: "#FF6100",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
    marginLeft: 8,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
  },
  prevbuttonText: {
    color: "#333",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  optionText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#FF6100",
  },
  cancelButton: {
    marginTop: 20,
    backgroundColor: "#FF6100",
    borderRadius: 5,
    padding: 10,
    width: "100%",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    textAlign: "center",
  },
  errorMessageContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
    marginLeft: 10,
  },
  errorIcon: {
    marginRight: 10,
  },
});

export default MyLicenseInformation;
