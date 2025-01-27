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
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import ExtendBooking from "@/services/extendBooking";
import getSingleVechile from "@/services/getSingleVechile";
import DateDisplayer from "@/components/DateDisplayer";
//file name changed
const Header = () => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={router.back}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Checkout</Text>
      <TouchableOpacity
        onPress={() => router.push("/screens/NotificationScreen")}
      >
        <Ionicons name="notifications-outline" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const ExtendBookingScreen = () => {
  const { bookingId, vehicleId, start_date, end_date, remarks } =
    useLocalSearchParams();
  //parsing data to make typescript happy
  const booking_id = parseInt(
    Array.isArray(bookingId) ? bookingId[0] : bookingId,
  );
  const vechile_id = parseInt(
    Array.isArray(vehicleId) ? vehicleId[0] : vehicleId,
  );
  console.log(bookingId);
  const prev_startDate = Array.isArray(start_date) ? start_date[0] : start_date;
  const prev_endDate = Array.isArray(end_date) ? end_date[0] : end_date;
  const prev_remarks = Array.isArray(remarks) ? remarks[0] : remarks;
  const [daysDifference, setDaysDifference] = useState(0);

  const { data, isError, isLoading } = useQuery({
    queryKey: ["singleVechile", vechile_id],
    queryFn: () => getSingleVechile(vechile_id),
  });
  console.log(data);
  const {
    mutate,
    isError: postError,
    isSuccess,
  } = useMutation({ mutationFn: ExtendBooking });
  const [startDate, setStartDate] = useState(new Date(prev_startDate));
  const [endDate, setEndDate] = useState(new Date(prev_endDate));
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    // Calculate days difference whenever startDate or endDate changes
    if (startDate && endDate) {
      const timeDifference = endDate.getTime() - startDate.getTime();
      const daysApart = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); // Convert ms to days
      setDaysDifference(daysApart);
    }
  }, [startDate, endDate]);

  const onChangeStartDate = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    setStartDate(selectedDate || startDate);
  };

  const onChangeEndDate = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    if (selectedDate && selectedDate < startDate) {
      Alert.alert("Invalid Date", "End date cannot be before the start date.");
      setEndDate(startDate);
    } else {
      setEndDate(selectedDate || endDate);
    }
  };
  const handleConfirmPress = () => {
    // console.log("Booking confirmed with the following details:", {
    //   startDate,
    //   endDate,
    // });
    mutate({
      bookingId: booking_id,
      start_date: prev_startDate,
      end_date: prev_endDate,
      price:
        daysDifference * data?.price.Daily +
        (daysDifference * data?.price.Daily) / 10 +
        100,
      remarks: prev_remarks,
    });
    setIsModalVisible(true);
  };
  const handleCloseModal = () => {
    // Optionally, perform any cleanup here

    setIsModalVisible(false);
    router.push("/(root)"); // Navigate to the root index, or adjust the path as needed
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />

      {/* Bike Details */}
      <View style={styles.card}>
        <Image
          source={require("../../assets/bikesimage/scooty1.png")}
          style={styles.image}
        />
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{data?.vehicle_name} </Text>
          <Text style={styles.price}>Rs. {data?.power}</Text>
          <Text style={styles.rating}>★★★★★</Text>
        </View>
      </View>

      {/* Date Pickers */}
      <View style={styles.dateInputContainer}>
        <View style={styles.datePicker}>
          <Text style={styles.textStyle}>Start Date</Text>
          <DateDisplayer date={prev_startDate} />
        </View>
        <View style={styles.datePicker}>
          <Text style={styles.textStyle}>End Date</Text>
          <DateDisplayer date={prev_endDate} />
        </View>
      </View>

      {/* Payment Details */}
      <View style={styles.paymentDetails}>
        <Text style={styles.textStyle}>Payment Details</Text>
        <View style={styles.paymentCard}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.paymentText}>
              Rent Fee ({daysDifference} days)
            </Text>
            <Text style={styles.paymentText}>
              Rs. {daysDifference * data?.power}
            </Text>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.paymentText}>Trip FEE</Text>
            <Text style={styles.paymentText}>Rs. 100</Text>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.paymentText}>Tax 10%</Text>
            <Text style={styles.paymentText}>
              Rs. {(daysDifference * data?.power) / 10}
            </Text>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.paymentText}>Payment Mode</Text>
            <Text style={styles.paymentText}>Cash</Text>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.paymentText}>Total</Text>
            <Text style={styles.paymentText}>
              Rs.{" "}
              {daysDifference * data?.power +
                (daysDifference * data?.power) / 10 +
                100}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.line}></View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 100,
        }}
      >
        <Text style={styles.finalPaymentText}>Total</Text>
        <Text style={styles.finalPaymentText}>
          Rs.{" "}
          {daysDifference * data?.price.Daily +
            (daysDifference * data?.price.Daily) / 10 +
            100}
        </Text>
      </View>

      {/* Confirm Button */}
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={handleConfirmPress}
      >
        <Text style={styles.confirmButtonText}>Extend Booking</Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <TouchableWithoutFeedback onPress={handleCloseModal}>
          <View style={styles.modalOverlay}>
            <Image
              source={require("../../assets/images/booking_successfull.png")} // Replace with your actual image URL or local file
              style={{ width: 350, height: 350 }}
            />
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 5,
    padding: 15,
    marginBottom: 20,
    alignItems: "center",
  },
  paymentCard: {
    flexDirection: "column",
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 5,
    padding: 15,
    marginBottom: 20,
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
    color: "#FFD700", // Gold color for stars
    marginTop: 5,
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
    fontWeight: "bold",
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
  paymentDetails: {
    marginBottom: 20,
  },
  paymentText: {
    fontSize: 16,
    color: "#000",
    margin: 5,
    fontWeight: "300",
  },
  promoCodeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  promoCodeInput: {
    flex: 0.7,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  finalPaymentText: {
    fontSize: 20,
    color: "#000",
    margin: 5,
    fontWeight: "bold",
  },
  applyButton: {
    flex: 0.3,
    backgroundColor: "#FF6F20",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  applyButtonText: {
    color: "#fff",
    fontSize: 16,
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
  line: {
    width: "100%",
    backgroundColor: "#E5D7D7",
    position: "relative",
    borderWidth: 0.2,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

export default ExtendBookingScreen;
