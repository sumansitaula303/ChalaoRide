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
  Switch,
  Alert,
  KeyboardTypeOptions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { getUserProfile, updateCitizenshipData } from "@/constants/apiService";
import { api_url, useAuth } from "@/context/AuthContext";
import { set } from "react-hook-form";

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
      placeholder={label}
      placeholderTextColor="#A0AEC0"
      keyboardType={keyboardType}
    />
  </View>
);

const MyCitizenInformation: React.FC<MyInformationProps> = () => {
  const [citizenship_front, setFrontImage] = useState<string | null>(null);
  const [citizenship_back, setBackImage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [imageType, setImageType] = useState<"front" | "back" | null>(null);
  const [allowEditing, setAllowEditing] = useState(false);
const {authState} = useAuth();
  const userDetails = useLocalSearchParams() as {
    fullName: string;
    phoneNumber: string;
    address: string;
    dob: string;
    gender: string;
    occupation: string;
  };

  const [citizenshipNumber, setCitizenshipNumber] = useState<number | null>(null);
  const [nid_number, setNidNumber] = useState<number | null>(null);
  const [issued_date, setIssueDate] = useState("");
  const [issued_district, setIssuedDistrict] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadStoredData = async () => {
      try {
        if (!authState?.token) {
          throw new Error("Authentication token is missing.");
        }
        const response = await getUserProfile(authState.token as string);

        if (!response) {
          throw new Error("Failed to fetch data");
        }
        console.log("Fetched Citizenship Response from API", response.data.user);
        if (response.status !== 200) {
          throw new Error("Failed to fetch data");
        }
        const data = response.data.user;
        const FrontPicture = data.citizenship_front || "https://via.placeholder.com/100";
          
        
        // Concatenate BASE_URL with the profile image path
        const frontfullImageUrl = FrontPicture.startsWith("https")
          ? FrontPicture  // Already a full URL, no need to prepend BASE_URL
          : `${api_url}${FrontPicture}`;

          const BackPicture = data.citizenship_back || "https://via.placeholder.com/100";
          
        
        // Concatenate BASE_URL with the profile image path
        const backfullImageUrl = BackPicture.startsWith("https")
          ? BackPicture  // Already a full URL, no need to prepend BASE_URL
          : `${api_url}${BackPicture}`;

        setFrontImage(frontfullImageUrl || ""); // Update the profile picture state with the full URL
        setCitizenshipNumber(data.citizenship_number|| "");
        setNidNumber(data.nid_number || "");
        setIssueDate(data.issued_date || "");
        setIssuedDistrict(data.issued_district || "");
       
        setBackImage(backfullImageUrl || "");
      } catch (error) {
        console.error("Error loading data from API", error);
       
      }
    };

    loadStoredData();
  }, []);
  const isFormValid = () => {
    const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
    return (
    citizenshipNumber !== null && citizenshipNumber.toString().trim() !== "" &&
      nid_number !== null && nid_number.toString().trim() !== "" &&
   
      dobRegex.test(issued_date) &&
      issued_district.trim() !== ""
    );
  }
  const handleNextPress = async () => {
    // Check if the form is valid
    if (!isFormValid()) {
      Alert.alert("Invalid Input", "Please make sure all fields are filled correctly.");
      return;
    }
  
    // Validate input fields
    if (!citizenshipNumber || !nid_number || !issued_date || !issued_district) {
      setErrorMessage("Please fill all fields before proceeding.");
      return;
    }
  
    if (!citizenship_front || !citizenship_back) {
      setErrorMessage("Please upload both front and back images.");
      return;
    }
  
    // Clear error message
    setErrorMessage("");
  
    try {
      // Ensure tokens are available before proceeding
      if (!authState?.token || !authState?.refreshToken) {
        setErrorMessage("Authentication tokens are missing.");
        return;
      }
  
      // Prepare the data for submission
      const citizenshipData = {
        citizenshipNumber: citizenshipNumber,
        nidNumber: nid_number,
        issuedDate: issued_date,
        issuedDistrict: issued_district,
        citizenshipFront: citizenship_front,
        citizenshipBack: citizenship_back,
      };
  console.log("Citizenship Data to be pushed", citizenshipData);
      // Call the API to update citizenship data
      const response = await updateCitizenshipData(authState.token, authState.refreshToken, citizenshipData);
      console.log("Citizenship Updated Response from API", response);
  
      // If the response is successful, proceed to the next screen
      if (response) {
        router.push({
          pathname: "/screens/MyLicenseForm",
          params: {
            ...userDetails,
            citizenshipNumber,
            nid_number,
            issued_date,
            issued_district,
            citizenship_front,
            citizenship_back,
          },
        });
      } else {
        // Handle unsuccessful response
        setErrorMessage("Failed to update citizenship data. Please try again.");
      }
    } catch (error) {
      // Catch any errors and display an alert
      console.error('Error pushing citizenship data:', error);
      Alert.alert('Error', 'Failed to submit citizenship details. Please try again.');
    }
  };
  
    
  
  const openImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
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
      } else if (imageType === "back") {
        setBackImage(result.assets[0].uri);
      }
      setModalVisible(false);
    }
  };

  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
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
      } else if (imageType === "back") {
        setBackImage(result.assets[0].uri);
      }
      setModalVisible(false);
    }
  };

  const handleUpload = (type: "front" | "back") => {
    setImageType(type);
    setModalVisible(true);
  };

  const toggleEdit = () => {
    setAllowEditing(!allowEditing);
  };

  
  

  const hasAnyImage = citizenship_front || citizenship_back;  
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
          <Text style={styles.sectionTitle}>Citizenship Details</Text>
          <InputField
            label="Citizenship Number"
            value={citizenshipNumber ? citizenshipNumber.toString() : ""}
            onChange={(text) => setCitizenshipNumber(Number(text))}
            keyboardType="numeric"
          />
          <InputField
            label="NID Number"
            value={nid_number ? nid_number.toString() : ""}
            onChange={(text) => setNidNumber(Number(text))}
            keyboardType="numeric"
          />
          <InputField
            label="Issue Date"
            value={issued_date}
            onChange={setIssueDate}
            keyboardType="numeric"
          />
          <InputField
            label="Issued District"
            value={issued_district}
            onChange={setIssuedDistrict}
          />
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
          <Text style={styles.uploadTitle}>Upload Your Citizenship Photo</Text>

          <View
            style={hasAnyImage ? styles.afterUploadContainer : styles.uploadContainer}
          >
            <View
              style={citizenship_front ? styles.afterUploadBox : styles.uploadBox}
            >
              <TouchableOpacity
                style={styles.iconHolder}
                onPress={() => handleUpload("front")}
              >
                {citizenship_front ? (
                  <Image
                    source={{ uri: citizenship_front }}
                    style={styles.image}
                  />
                ) : (
                  <Ionicons name="camera-outline" size={60} color="#FF6100" />
                )}
              </TouchableOpacity>
              <Text style={styles.uploadText}>
                Upload Front Part Of Your Citizenship
              </Text>
            </View>

            <View
              style={citizenship_back ? styles.afterBackUploadBox : styles.uploadBox}
            >
              <TouchableOpacity
                style={styles.iconHolder}
                onPress={() => handleUpload("back")}
              >
                {citizenship_back ? (
                  <Image
                    source={{ uri: citizenship_back }}
                    style={styles.image}
                  />
                ) : (
                  <Ionicons name="camera-outline" size={60} color="#FF6100" />
                )}
              </TouchableOpacity>
              <Text style={styles.uploadText}>
                Upload Back Part Of Your Citizenship
              </Text>
            </View>
          </View>
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
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNextPress} // Call handleNext instead of direct navigation
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>

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
    flex: 1,
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
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
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
    marginBottom: 50,
    textAlign: "center", // Center the title
    color: "#333",
  },
  uploadContainer: {
    flexDirection: "row",
    justifyContent: "space-around", // Centering the items better
    width: "100%",
    paddingHorizontal: 20, // Increased padding
  },
  afterUploadContainer: {
    flexDirection: "column", // Centering the items better
    padding: 20,
  },
  uploadBox: {
    borderRadius: 8,
    width: "45%", // Flex width
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  afterUploadBox: {
    borderRadius: 8,
    width: "120%", // Flex width
    aspectRatio: 1.5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 50,
  },
  afterBackUploadBox: {
    borderRadius: 8,
    width: "120%", // Flex width
    aspectRatio: 1.2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
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
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    justifyContent: "flex-start",
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  uploadText: {
    marginTop: 10,
    fontSize: 14,
    textAlign: "center",
    color: "#888",
    marginBottom: 30,
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
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  prevbuttonText: {
    color: "#FF6100",
    fontSize: 18,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent background
  },
  modalContent: {
    width: "80%", // Use a percentage for responsive design
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    elevation: 5, // For Android shadow effect
    shadowColor: "#000", // For iOS shadow effect
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: "bold",
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
  optionText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#FF6100",
  },
  cancelButton: {
    padding: 15,
    backgroundColor: "#FF6100",
    borderRadius: 16,
    width: "100%",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
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

export default MyCitizenInformation;
