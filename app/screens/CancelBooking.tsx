import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import getSingleBooking from "@/services/getSingleBooking";
import cancelBookings from "@/services/cancelBooking";
//since this data is currently not being sent to the back end no id's is needed.
const cancelReasonList = [
  "I don't need this service",
  "Price is not reasonable",
  "The vendor took too long to respond",
  "I need this service sooner",
  "I booked it by mistake",
  "I already booked another ride",
  "Other",
];
const CancelBooking = () => {
  const { bookingId } = useLocalSearchParams();
  const booking_id = parseInt(
    Array.isArray(bookingId) ? bookingId[0] : bookingId,
  );
  const {
    mutate,
    isError: postError,
    isSuccess,
  } = useMutation({ mutationFn: cancelBookings });
  const [selected, setSelected] = useState<number>(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleCloseModal = () => {
    setIsModalVisible(false);
    router.push("/(root)/bookings");
  };
  const cancelBooking = () => {
    mutate({
      booking_id: booking_id,
    });
    //call the api to cancel booking here after the population of db
    setIsModalVisible(true);
  };
  return (
    <View className=" flex-1 bg-[#F4F4F4] p-4">
      <View className=" bg-white px-1">
        <Text className=" text-base font-medium mb-6">
          Why do you want to cancel?
        </Text>
        {cancelReasonList.map((reason, index) => (
          <View key={index}>
            <TouchableOpacity
              onPress={() => setSelected(index)}
              className=" flex-row gap-4 items-center"
            >
              {selected === index ? (
                <Image
                  style={{ height: 12, width: 12 }}
                  source={require("../../assets/icons/selected-radio.png")}
                />
              ) : (
                <Image
                  style={{ height: 12, width: 12 }}
                  source={require("../../assets/icons/unselected-radio.png")}
                />
              )}

              <Text className=" text-sm font-normal">{reason}</Text>
            </TouchableOpacity>
            <View className=" h-[14]" />
          </View>
        ))}
      </View>
      <View className=" flex-row p-2 mt-3">
        <TouchableOpacity
          onPress={router.back}
          className=" flex-1 border border-primary rounded-lg p-3 justify-center items-center"
        >
          <Text className=" text-primary text-sm font-normal">
            I don't want to cancel
          </Text>
        </TouchableOpacity>
        <View className=" w-[9]" />
        <TouchableOpacity
          onPress={cancelBooking}
          className="rounded-lg flex-1 bg-[#E40000] p-3 justify-center items-center"
        >
          <Text className=" text-white text-sm font-normal">
            Cancel Booking
          </Text>
        </TouchableOpacity>
      </View>
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <TouchableWithoutFeedback onPress={handleCloseModal}>
          <View style={styles.model_background}>
            <Image
              className=" h-[385] w-5/6"
              source={require("../../assets/images/booking_canceled.png")}
            />
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default CancelBooking;
const styles = StyleSheet.create({
  model_background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});
