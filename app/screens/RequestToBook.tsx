import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  FlatList,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import getSingleVechile from "@/services/getSingleVechile";

type CreateBookingProps = {
  vehicle: number;
  start_date: string;
  end_date: string;
  city: string;
  pickup_location: string;
  total_price: string;
  payment_method: string;
};

// Payment Option Component
interface PaymentOptionProps {
  method: string;
  isSelected: boolean;
  onSelect: (method: string) => void;
  imageSource: { uri: string };
}
const PaymentOption: React.FC<PaymentOptionProps> = ({
  method,
  isSelected,
  onSelect,
  imageSource,
}) => (
  <TouchableOpacity
    style={[styles.paymentButton, isSelected && styles.selectedPaymentButton]}
    onPress={() => onSelect(method)}
  >
    <View style={styles.paymentContent}>
      <Image source={imageSource} style={styles.paymentImage} />
      <Text style={styles.paymentText}>{method}</Text>
    </View>
  </TouchableOpacity>
);

// Reusable Dropdown Component
interface DropdownProps {
  label: string;
  options: string[];
  selectedOption: string;
  isOpen: boolean;
  toggleOpen: () => void;
  onSelect: (option: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  selectedOption,
  isOpen,
  toggleOpen,
  onSelect,
}) => (
  <>
    <Text style={styles.textStyle}>{label}</Text>
    <TouchableOpacity style={styles.dropdown} onPress={toggleOpen}>
      <Text style={styles.dropdownText}>{selectedOption}</Text>
      <Ionicons
        name={isOpen ? "chevron-up" : "chevron-down"}
        size={20}
        color="gray"
      />
    </TouchableOpacity>
    {isOpen && (
      <View style={styles.dropdownContent}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.dropdownBox}
            onPress={() => onSelect(option)}
          >
            <Text style={styles.dropdownOptionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    )}
  </>
);

const Header = ({ onBackPress }: { onBackPress: () => void }) => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={onBackPress}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Request to Book</Text>
      <TouchableOpacity>
        <Ionicons name="notifications-outline" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const RequestToBookScreen = () => {
  const { id } = useLocalSearchParams();
  const ids = parseInt(Array.isArray(id) ? id[0] : id);
  const { data, isError, isLoading } = useQuery({
    queryKey: ["singleVechile", ids],
    queryFn: () => getSingleVechile(ids),
  });

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  });
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [pickupLocation, setPickupLocation] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Select Payment Methods");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPurposeDropdownOpen, setIsPurposeDropdownOpen] = useState(false);
  const [purpose, setPurpose] = useState("Select Purpose of Rental");
  const [errors, setErrors] = useState<{
    pickupLocation?: string;
    purpose?: string;
    paymentMethod?: string;
  }>({});

  const purposeOptions = ["Travel", "Ride Sharing", "Option 3", "Option 4"];
  const paymentOptions = [
    { method: "Cash", image: require("../../assets/images/cash.png") },
    { method: "Esewa", image: require("../../assets/images/esewa.png") },
    { method: "Credit Card", image: require("../../assets/images/card.png") },
    { method: "Other", image: require("../../assets/images/others.png") },
  ];

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!pickupLocation.trim()) {
      newErrors.pickupLocation = "Pickup location is required";
    }

    if (purpose === "Select Purpose of Rental") {
      newErrors.purpose = "Purpose is required";
    }

    if (paymentMethod === "Select Payment Methods") {
      newErrors.paymentMethod = "Payment method is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePaymentMethodSelect = (method: string) => {
    setPaymentMethod(method);
    setErrors((prev) => ({ ...prev, paymentMethod: undefined }));
  };

  const handlePurposeSelect = (option: string) => {
    setPurpose(option);
    setIsPurposeDropdownOpen(false);
    setErrors((prev) => ({ ...prev, purpose: undefined }));
  };

  const onChangeStartDate = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    setStartDate(selectedDate || startDate);
  };

  const onChangeEndDate = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    if (selectedDate && selectedDate < startDate) {
      Alert.alert("Invalid Date", "End date cannot be before the start date.");
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
    } else {
      setEndDate(selectedDate || endDate);
    }
  };

  const handleConfirmPress = () => {
    if (!validateForm()) {
      Alert.alert("Missing Information", "Please fill in all required fields");
      return;
    }

    router.push({
      pathname: "/screens/Checkout",
      params: {
        id: ids,
        start_date: startDate.toISOString().slice(0, 10),
        end_date: endDate.toISOString().slice(0, 10),
        city: pickupLocation,
      },
    });
  };

  const handleBackPress = () => {
    console.log("Back pressed");
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header onBackPress={handleBackPress} />
      <View style={styles.card}>
        <Image
          source={{ uri: data?.thumbnail_image }}
          resizeMode="contain"
          style={styles.image}
        />
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{data?.vehicle_name}</Text>
          <Text style={styles.price}>Rs. {data?.price.Daily} per day</Text>
          <Text style={styles.rating}>★★★★★</Text>
        </View>
      </View>

      <View style={styles.dateInputContainer}>
        <View style={styles.datePicker}>
          <Text style={styles.textStyle}>Start Date *</Text>
          <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
            <Text style={styles.input}>{startDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
          {showStartDatePicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display="default"
              onChange={onChangeStartDate}
            />
          )}
        </View>
        <View style={styles.datePicker}>
          <Text style={styles.textStyle}>End Date *</Text>
          <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
            <Text style={styles.input}>{endDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
          {showEndDatePicker && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display="default"
              onChange={onChangeEndDate}
            />
          )}
        </View>
      </View>

      <Dropdown
        label="Purpose of Rental *"
        options={purposeOptions}
        selectedOption={purpose}
        isOpen={isPurposeDropdownOpen}
        toggleOpen={() => setIsPurposeDropdownOpen(!isPurposeDropdownOpen)}
        onSelect={handlePurposeSelect}
      />
      {errors.purpose && <Text style={styles.errorText}>{errors.purpose}</Text>}

      <Text style={styles.textStyle}>Pickup Location *</Text>
      <TextInput
        style={[styles.input, errors.pickupLocation ? styles.inputError : null]}
        placeholder="Kathmandu"
        value={pickupLocation}
        onChangeText={(text) => {
          setPickupLocation(text);
          setErrors((prev) => ({ ...prev, pickupLocation: undefined }));
        }}
      />
      {errors.pickupLocation && (
        <Text style={styles.errorText}>{errors.pickupLocation}</Text>
      )}

      <Text style={styles.textStyle}>How would you like to pay? *</Text>
      <TouchableOpacity
        style={[
          styles.dropdownCard,
          errors.paymentMethod ? styles.inputError : null,
        ]}
        onPress={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <Text style={styles.textStyle}>{paymentMethod}</Text>
        <Ionicons
          name={isDropdownOpen ? "chevron-up-outline" : "chevron-down-outline"}
          size={24}
          color="black"
        />
      </TouchableOpacity>
      {errors.paymentMethod && (
        <Text style={styles.errorText}>{errors.paymentMethod}</Text>
      )}

      {isDropdownOpen && (
        <View style={styles.dropdownContent}>
          <FlatList
            data={paymentOptions}
            keyExtractor={(item) => item.method}
            renderItem={({ item }) => (
              <PaymentOption
                method={item.method}
                isSelected={paymentMethod === item.method}
                onSelect={handlePaymentMethodSelect}
                imageSource={item.image}
              />
            )}
            numColumns={2}
            columnWrapperStyle={styles.row}
          />
        </View>
      )}

      <TouchableOpacity
        style={styles.confirmButton}
        onPress={handleConfirmPress}
      >
        <Text style={styles.confirmButtonText}>Confirm</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 5,
    padding: 15,
    marginBottom: 20,
    alignItems: "center",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  detailsContainer: {
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  price: {
    fontSize: 16,
    color: "#FF6F20",
    marginTop: 5,
  },
  rating: {
    fontSize: 16,
    color: "#FFD700",
    marginTop: 5,
  },
  dateInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  datePicker: {
    flex: 1,
    marginHorizontal: 5,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#000",
  },
  textStyle: {
    fontSize: 16,
    marginBottom: 5,
    color: "#000",
  },
  dropdownCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginVertical: 10,
  },
  dropdownContent: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  dropdownBox: {
    paddingVertical: 10,
  },
  dropdownText: {
    fontSize: 16,
    color: "#000",
  },
  dropdownOptionText: {
    fontSize: 16,
    color: "#333",
  },
  paymentButton: {
    flex: 1,
    margin: 5,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  selectedPaymentButton: {
    backgroundColor: "#FFF4ED",
  },
  paymentContent: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
  },
  paymentImage: {
    width: 30,
    height: 30,
  },
  paymentText: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 20,
  },
  confirmButton: {
    backgroundColor: "#FF6F20",
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 20,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  row: {
    justifyContent: "space-between",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  errorText: {
    color: "#FF0000",
    fontSize: 12,
    marginTop: 5,
    marginBottom: 10,
  },
  inputError: {
    borderColor: "#FF0000",
  },
});

export default RequestToBookScreen;
