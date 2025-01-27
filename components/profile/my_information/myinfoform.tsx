import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { api_url, useAuth } from "@/context/AuthContext";
import axios from "axios";
import { getUserProfile, updateUserProfile } from "@/constants/apiService";

interface MyInformationProps {
  onClose: () => void;
}

const InputField = ({
  label,
  value,
  onChange,
  placeholder = "",
  keyboardType = "default"
}: {
  label: string;
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "numeric";
}) => (
  <View style={styles.inputContainer}>
    <TextInput
      style={styles.input}
      placeholder={label}
      placeholderTextColor="#A0AEC0"
      value={value}
      onChangeText={onChange}
      keyboardType={keyboardType}
    />
  </View>
);

const MyInformation: React.FC<MyInformationProps> = ({ onClose }) => {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [occupation, setOccupation] = useState("");
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);

  const genderOptions = ["Male", "Female", "Other"];
const { authState } = useAuth();

  const isFormValid = () => {
    const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
    return (
      fullName.trim() !== "" &&
      phoneNumber.trim() !== "" &&
      address.trim() !== "" &&
      dobRegex.test(dob) &&
      gender.trim() !== "" &&
      occupation.trim() !== ""
    );
  };

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
        console.log("Fetched Response from API", response.data);
        if (response.status !== 200) {
          throw new Error("Failed to fetch data");
        }
        const data = response.data.user;
        setFullName(data.full_name || "");
        setPhoneNumber(data.phonenumber || "");
        setAddress(data.address || "");
        setDob(data.dateofbirth || "");
        setGender(data.gender || "");
        setOccupation(data.occupation || "");
      } catch (error) {
        console.error("Error loading data from API", error);
        Alert.alert("Error", "Failed to load data from the server.");
      }
    };

    loadStoredData();
  }, []);

  const handleNextPress = async () => {
    if (!isFormValid()) {
      Alert.alert("Invalid Input", "Please make sure all fields are filled correctly.");
      return;
    }

    try {
      const updatedProfile = {
        fullName: fullName,
        phoneNumber: phoneNumber,
        address: address,
        dob: dob,
        gender: gender,
        occupation: occupation,
      };

      if (!authState?.token || !authState?.refreshToken) {
        throw new Error("Authentication tokens are missing.");
      }
      const response = await updateUserProfile(authState.token, authState.refreshToken, updatedProfile);
      console.log("Updated Response from API", response.Data);
      
      if (response) {
        router.push({
          pathname: "/screens/UserImage",
          params: {
            fullName,
            phoneNumber,
            address,
            dob,
            gender,
            occupation,
          }
        });
      } else {
        throw new Error("Failed to save data.");
      }
    } catch (error) {
      console.error("Error updating data", error);
      Alert.alert("Error", "Failed to save data to the server.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Information</Text>
          <TouchableOpacity onPress={() => router.push("/screens/NotificationScreen")}>
            <Ionicons name="notifications-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <InputField label="Full Name" value={fullName} onChange={setFullName} />
          <InputField label="Phone Number" value={phoneNumber} onChange={setPhoneNumber} keyboardType="numeric" />
          <InputField label="Address" value={address} onChange={setAddress} />
          <InputField
            label="Date of Birth (yyyy-mm-dd)"
            value={dob}
            onChange={setDob}
            placeholder="yyyy-mm-dd"
            keyboardType="numeric"
          />

          <View style={styles.inputContainer}>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setShowGenderDropdown(!showGenderDropdown)}
            >
              <Text style={gender ? styles.selectedDropdownInput : styles.dropdownInput}>
                {gender || "Select Gender"}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#FF6100" />
            </TouchableOpacity>
            {showGenderDropdown && (
              <View style={styles.dropdownOptionsContainer}>
                {genderOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={styles.dropdownOption}
                    onPress={() => {
                      setGender(option);
                      setShowGenderDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownOptionText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <InputField label="Occupation" value={occupation} onChange={setOccupation} />
        </View>

        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNextPress}
          disabled={!isFormValid()}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
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
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  selectedDropdownInput: {
    fontSize: 16,
  },
  dropdownInput: {
    fontSize: 16,
    color: "#A0AEC0",
  },
  dateText: {
    fontSize: 16,
    color: "#A0AEC0",
  },
  selectedDateInput: {
    fontSize: 16,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownOptionsContainer: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    marginTop: 8,
    backgroundColor: "white",
  },
  dropdownOption: {
    padding: 12,
  },
  dropdownOptionText: {
    fontSize: 16,
    color: "#000",
  },
  calendarIcon: {
    marginLeft: 8,
  },
  datePicker: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 12,
  },
  nextButton: {
    backgroundColor: "#FF6100",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    margin: 16,
  },
  nextButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default MyInformation;