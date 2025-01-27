import React, { useEffect, useState } from "react";
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
  ActivityIndicator,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import getSingleBooking from "@/services/getSingleBooking";
import { useMutation, useQuery } from "@tanstack/react-query";
import ExtendBooking from "@/services/extendBooking";
//file name changed

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

const Header = () => (
  <View style={styles.headerContainer}>
    <TouchableOpacity onPress={router.back}>
      <Ionicons name="arrow-back" size={24} color="black" />
    </TouchableOpacity>
    <Text style={styles.headerTitle}>Extend Booking</Text>
    <TouchableOpacity
      onPress={() => router.push("/screens/NotificationScreen")}
    >
      <Ionicons name="notifications-outline" size={24} color="black" />
    </TouchableOpacity>
  </View>
);

const RequestToBookScreen = () => {
  //data passed from previous page
  const { bookingId } = useLocalSearchParams();
  const { vehicleId } = useLocalSearchParams();
  const booking_id = parseInt(
    Array.isArray(bookingId) ? bookingId[0] : bookingId,
  );
  const vechile_id = parseInt(
    Array.isArray(vehicleId) ? vehicleId[0] : vehicleId,
  );
  const { data, isError, isLoading } = useQuery({
    queryKey: ["singleVechile", booking_id],
    queryFn: () => getSingleBooking(booking_id),
  });

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Select Payment Methods");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [purpose, setPurpose] = useState("");

  const purposeOptions = ["Travel", "Ride Sharing", "Option 3", "Option 4"];
  const paymentOptions = [
    { method: "Cash", image: require("../../assets/images/cash.png") },
    { method: "Esewa", image: require("../../assets/images/esewa.png") },
    { method: "Credit Card", image: require("../../assets/images/card.png") },
    { method: "Other", image: require("../../assets/images/others.png") },
  ];
  useEffect(() => {
    // Check if data is loaded and update endDate if not already set
    if (data && data.end_date && data.start_date) {
      setEndDate(new Date(data.end_date));
      setStartDate(new Date(data.start_date));
    }
  }, [data]);

  const handlePaymentMethodSelect = (method: string) => {
    setPaymentMethod(method);
  };

  const onChangeStartDate = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    // Ensure a date is selected
    if (selectedDate) {
      // Validate to ensure the start date is not in the past
      if (selectedDate < new Date(new Date().setHours(0, 0, 0, 0))) {
        Alert.alert("Invalid Date", "Start date cannot be in the past.");
        return;
      }
      setStartDate(selectedDate);
    }
  };

  const onChangeEndDate = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    // Ensure a date is selected
    if (selectedDate) {
      // Allow end date to be the same as start date
      if (selectedDate < startDate) {
        Alert.alert(
          "Invalid Date",
          "End date cannot be before the start date.",
        );
        return;
      }
      setEndDate(selectedDate);
    }
  };

  const handleConfirmPress = () => {
    router.push({
      pathname: "/screens/ExtendBooking",
      params: {
        bookingId: bookingId,
        vehicleId: vehicleId,
        start_date: startDate.toISOString().slice(0, 10),
        end_date: endDate.toISOString().slice(0, 10),
        remarks: purpose,
      },
    });
    console.log("Booking confirmed with the following details:", {
      startDate,
      endDate,
      purpose,
      paymentMethod,
    });
  };

  const isFormValid = () => {
    return (
      startDate &&
      endDate && // Ensure start and end dates are set
      paymentMethod !== "Select Payment Methods" && // Ensure a payment method is selected
      purpose !== "" // Ensure a purpose is selected
    );
  };
  if (isLoading) {
    return (
      <View className=" flex-1 justify-center items-center">
        <ActivityIndicator size={"large"} />
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.dateInputContainer}>
        <View style={styles.datePicker}>
          <Text style={styles.textStyle}>Start Date</Text>
          <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
            <Text style={styles.input}>{startDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
          {showStartDatePicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display="default"
              onChange={onChangeStartDate}
              minimumDate={new Date()}
            />
          )}
        </View>
        <View style={styles.datePicker}>
          <Text style={styles.textStyle}>End Date</Text>
          <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
            <Text style={styles.input}>{endDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
          {showEndDatePicker && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display="default"
              onChange={onChangeEndDate}
              minimumDate={startDate}
            />
          )}
        </View>
      </View>

      <Text style={styles.textStyle}>
        Why do you want to extend your booking?
      </Text>
      <TextInput
        style={styles.reasonInput}
        value={purpose}
        placeholder="Enter your purpose here"
        onChangeText={setPurpose}
        multiline={true}
      />

      <Text style={styles.textStyle}>How would you like to pay?</Text>
      <TouchableOpacity
        style={styles.dropdownCard}
        onPress={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <Text>{paymentMethod}</Text>
        <Ionicons
          name={isDropdownOpen ? "chevron-up-outline" : "chevron-down-outline"}
          size={24}
          color="black"
        />
      </TouchableOpacity>

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

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.prevButton}>
          <Text style={styles.prevbuttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleConfirmPress}
          disabled={!isFormValid()} // Disable button if the form is not valid
        >
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  prevButton: {
    backgroundColor: "#FFFFFF",
    width: "45%",
    aspectRatio: 3.3,
    borderRadius: 10,
    borderColor: "#FF6100",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginVertical: 30,
  },
  nextButton: {
    backgroundColor: "#FF6100",
    justifyContent: "center",
    borderRadius: 10,
    alignItems: "center",
    width: "45%",
    aspectRatio: 3.3,
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
  dateInputContainer: {
    marginBottom: 15,
  },
  datePicker: {
    marginVertical: 10,
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
  reasonInput: {
    lineHeight: 24,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#000",
    marginBottom: 20,
  },
  textStyle: {
    fontSize: 16,
    marginBottom: 10,
    color: "#000",
    fontWeight: "bold",
  },
  dropdownCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 20,
  },
  dropdownContent: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
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
});

export default RequestToBookScreen;
