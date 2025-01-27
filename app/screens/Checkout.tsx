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
  KeyboardAvoidingView,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import getSingleVechile from "@/services/getSingleVechile";
import createBooking from "@/services/createBooking";
import VerifyPromo from "@/services/verifyPromo";
import DateDisplayer from "@/components/DateDisplayer";

const Header = ({ onBackPress }: { onBackPress: () => void }) => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={onBackPress}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Checkout</Text>
      <TouchableOpacity>
        <Ionicons name="notifications-outline" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const Checkout = () => {
  const { id, start_date, end_date, city } = useLocalSearchParams();
  const ids = parseInt(Array.isArray(id) ? id[0] : id);
  const prev_startDate = Array.isArray(start_date) ? start_date[0] : start_date;
  const prev_endDate = Array.isArray(end_date) ? end_date[0] : end_date;
  const prev_pickup = Array.isArray(city) ? city[0] : city;
  const [daysDifference, setDaysDifference] = useState(0);
  const [validPromo, setValidPromo] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);
  const [hasAttemptedPromo, setHasAttemptedPromo] = useState(false);
  const { data, isError, isLoading } = useQuery({
    queryKey: ["singleVechile", ids],
    queryFn: () => getSingleVechile(ids),
  });
  // console.log(data);
  const {
    mutate,
    isError: postError,
    isSuccess,
  } = useMutation({ mutationFn: createBooking });
  const {
    mutate: promo_mutate,
    isError: promo_error,
    isSuccess: promo_success,
  } = useMutation({
    mutationFn: VerifyPromo,
    onSuccess: (data) => {
      if (data?.valid) {
        setValidPromo(promoCode);
        setDiscount(data?.discount_percent);
        setHasAttemptedPromo(false);
        console.log(promoCode);
        console.log(discount);
      } else {
        setValidPromo("");
        setDiscount(0);
        setHasAttemptedPromo(true);
      }
    },
  });

  const [startDate, setStartDate] = useState(new Date(prev_startDate));
  const [endDate, setEndDate] = useState(new Date(prev_endDate));
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [pickupLocation, setPickupLocation] = useState(
    "Boudhha Pipalbot, Kathmandu",
  );
  const [returnLocation, setReturnLocation] = useState(
    "Boudhha Pipalbot, Kathmandu",
  );
  const [promoCode, setPromoCode] = useState("");

  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    // Calculate days difference whenever startDate or endDate changes
    if (startDate && endDate) {
      const timeDifference = endDate.getTime() - startDate.getTime();
      const daysApart = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); // Convert ms to days
      setDaysDifference(daysApart);
    }
  }, [startDate, endDate]);

  const handleConfirmPress = () => {
    console.log("Booking confirmed with the following details:", {
      startDate,
      endDate,
    });
    mutate({
      vehicle: ids,
      start_date: startDate.toISOString().slice(0, 10),
      end_date: endDate.toISOString().slice(0, 10),
      city: prev_pickup,
      pickup_location: pickupLocation,
      total_price:
        daysDifference * data?.price.Daily +
        (daysDifference * data?.price.Daily) / 10 +
        100 -
        ((daysDifference * data?.price.Daily +
          (daysDifference * data?.price.Daily) / 10 +
          100) /
          100) *
          discount,
      payment_method: "CASH",
      promo_code: validPromo,
    });
    setIsModalVisible(true);
  };
  const handleCloseModal = () => {
    setIsModalVisible(false);
    router.replace("/(root)/bookings");
  };

  const handleBackPress = () => {
    console.log("Back pressed");
    router.back();
  };

  const handlePromo = (promo_code: string) => {
    promo_mutate(promoCode);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <KeyboardAvoidingView>
          <Header onBackPress={handleBackPress} />

          {/* Bike Details */}
          <View style={styles.card}>
            <Image
              source={require("../../assets/bikesimage/scooty1.png")}
              style={styles.image}
            />
            <View style={styles.detailsContainer}>
              <Text style={styles.title}> {data?.vehicle_name} </Text>
              <Text style={styles.price}>Rs. {data?.price.Daily} per day</Text>
              <Text style={styles.rating}>★★★★★</Text>
            </View>
          </View>

          {/* Date Pickers */}
          <View style={styles.dateInputContainer}>
            <View style={styles.datePicker}>
              <Text style={styles.textStyle}>Start Date</Text>
              <DateDisplayer date={startDate.toLocaleDateString()} />
            </View>
            <View style={styles.datePicker}>
              <Text style={styles.textStyle}>End Date</Text>
              <DateDisplayer date={endDate.toLocaleDateString()} />
            </View>
          </View>

          {/* Reason for extending booking */}
          <View style={styles.inputContainer}>
            <Text style={styles.textStyle}>PickUp & Return</Text>
            <View style={styles.input}>
              <Ionicons
                name="location-sharp"
                size={24}
                color="gray"
                style={{ marginRight: 10 }}
              />
              <TextInput
                placeholder="Enter location"
                value={pickupLocation}
                onChangeText={setPickupLocation}
              />
            </View>
          </View>

          {/* Payment Details */}
          <View style={styles.paymentDetails}>
            <Text style={styles.textStyle}>Payment Details</Text>
            <View style={styles.paymentCard}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.paymentText}>
                  Rent Fee ({daysDifference} days)
                </Text>
                <Text style={styles.paymentText}>
                  Rs.
                  {daysDifference * data?.price.Daily}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.paymentText}>Trip Fee</Text>
                <Text style={styles.paymentText}>Rs. 100</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.paymentText}>Tax 10%</Text>
                <Text style={styles.paymentText}>
                  Rs. {(daysDifference * data?.price.Daily) / 10}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.paymentText}>Payment Mode</Text>
                <Text style={styles.paymentText}>Cash</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.paymentText}>Total</Text>
                <Text style={styles.paymentText}>
                  Rs.{" "}
                  {daysDifference * data?.price.Daily +
                    (daysDifference * data?.price.Daily) / 10 +
                    100}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.textStyle}>Promo Code</Text>
                <View style={styles.promoCodeInputContainer}>
                  <View style={styles.promoCodeContainer}>
                    <TextInput
                      style={styles.promoCodeInput}
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChangeText={setPromoCode}
                    />
                  </View>
                  <TouchableOpacity
                    onPress={() => handlePromo(promoCode)}
                    style={styles.applyButton}
                  >
                    <Text style={styles.applyButtonText}>Apply</Text>
                  </TouchableOpacity>
                </View>
                {hasAttemptedPromo && (
                  <Text style={styles.errorText}>Invalid promo code</Text>
                )}
                {discount > 0 && (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={styles.paymentText}>
                      Promo Discount ({discount}%)
                    </Text>
                    <Text style={styles.paymentText}>
                      {" "}
                      Rs.{" "}
                      {((daysDifference * data?.price.Daily +
                        (daysDifference * data?.price.Daily) / 10 +
                        100) /
                        100) *
                        discount}
                    </Text>
                  </View>
                )}

                <View style={styles.line}></View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={styles.finalPaymentText}>Total</Text>
                  <Text style={styles.finalPaymentText}>
                    Rs.{" "}
                    {daysDifference * data?.price.Daily +
                      (daysDifference * data?.price.Daily) / 10 +
                      100 -
                      ((daysDifference * data?.price.Daily +
                        (daysDifference * data?.price.Daily) / 10 +
                        100) /
                        100) *
                        discount}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Confirm Button */}
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirmPress}
          >
            <Text style={styles.confirmButtonText}>Rent a Bike</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </ScrollView>
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
    flexDirection: "row",
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
  finalPaymentText: {
    fontSize: 20,
    color: "#000",
    margin: 5,
    fontWeight: "bold",
  },
  promoCodeInputContainer: {
    flexDirection: "row",
    marginBottom: 20,
    justifyContent: "space-between",
    alignItems: "center",
  },
  promoCodeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  promoCodeInput: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 25,
    fontSize: 16,
  },
  applyButton: {
    backgroundColor: "#FF6F20",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 45,
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
  line: {
    width: "100%",
    backgroundColor: "#E5D7D7",
    position: "relative",
    borderWidth: 0.2,
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: -15,
    marginBottom: 10,
  },
});

export default Checkout;
