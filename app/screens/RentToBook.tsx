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
  KeyboardAvoidingView,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

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

const RentToBookScreen = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [pickupLocation, setPickupLocation] = useState(
    "Boudhha Pipalbot, Kathmandu"
  );
  const [returnLocation, setReturnLocation] = useState(
    "Boudhha Pipalbot, Kathmandu"
  );
  const [promoCode, setPromoCode] = useState("");

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
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleConfirmPress = () => {
    console.log("Booking confirmed with the following details:", {
      startDate,
      endDate,
 
    });
    setIsModalVisible(true);
  };
  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleBackPress = () => {
    console.log("Back pressed");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
      <KeyboardAvoidingView>
      <Header onBackPress={handleBackPress} />

      {/* Bike Details */}
      <View style={styles.card}>
        <Image
          source={{
            uri: "https://example.com/hero-destiny-110.png", // Replace with actual image URL
          }}
          style={styles.image}
        />
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>Hero Destiny 110</Text>
          <Text style={styles.price}>Rs. 450 per day</Text>
          <Text style={styles.rating}>★★★★★</Text>
        </View>
      </View>

      {/* Date Pickers */}
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
            />
          )}
        </View>
      </View>

      {/* Reason for extending booking */}
      <View style={styles.inputContainer}>
        <Text style={styles.textStyle}>
          PickUp & Return
        </Text>
        <View  style={styles.input}>
        <Ionicons name="location-sharp" size={24} color="gray" style={{marginRight:10}} />
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
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.paymentText}>Total</Text>
            <Text style={styles.paymentText}>Rs. 900</Text>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.paymentText}>Total</Text>
            <Text style={styles.paymentText}>Rs. 900</Text>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.paymentText}>Total</Text>
            <Text style={styles.paymentText}>Rs. 900</Text>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.paymentText}>Total</Text>
            <Text style={styles.paymentText}>Rs. 900</Text>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.paymentText}>Total</Text>
            <Text style={styles.paymentText}>Rs. 900</Text>
          </View>
          <View
            style={{ flexDirection: "column", justifyContent: "space-between" }}
          ><Text style={styles.textStyle}>Promo Code</Text>
            <View style={styles.promoCodeInputContainer}>
              
              <View style={styles.promoCodeContainer}>
                <TextInput
                  style={styles.promoCodeInput}
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChangeText={setPromoCode}
                />
              </View>
              <TouchableOpacity style={styles.applyButton}>
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
            </View>
            <View style={styles.line}></View>
            <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.finalPaymentText}>Total</Text>
            <Text style={styles.finalPaymentText}>Rs. 900</Text>
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
    width: '100%',
    backgroundColor: '#E5D7D7',
    position: 'relative',
    borderWidth: .2,
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
 
});

export default RentToBookScreen;
