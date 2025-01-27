import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import ProfileImage from "@/components/current_subscription/profile";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import getSingleVechile from "@/services/getSingleVechile";
import getSingleBooking from "@/services/getSingleBooking";

const currentRide = {
  Vendor_image:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Balen_Shah3-cropped.png/330px-Balen_Shah3-cropped.png",
};

const Header = () => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={router.back}>
        <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Current Subscription</Text>
      <View />
    </View>
  );
};

const CurrentSubscription = () => {
  const { bookingId, vehicleId } = useLocalSearchParams();
  const vehicle_id = parseInt(
    Array.isArray(vehicleId) ? vehicleId[0] : vehicleId,
  );
  const booking_id = parseInt(
    Array.isArray(bookingId) ? bookingId[0] : bookingId,
  );

  const { data } = useQuery({
    queryKey: ["singleVechile", vehicle_id],
    queryFn: () => getSingleVechile(vehicle_id),
  });

  const { data: bookingData } = useQuery({
    queryKey: ["singleBooking", booking_id],
    queryFn: () => getSingleBooking(booking_id),
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [date_end, setDate_end] = useState(new Date());
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    if (bookingData) {
      setDate(new Date(bookingData?.start_date));
      setDate_end(new Date(bookingData?.end_date));
    }
  }, [bookingData]);

  const formattedDate = date.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });

  const formattedDat_ende = date_end.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.imageContainer}>
            <View style={styles.disc} />
            <Image
              source={{ uri: data?.thumbnail_image }}
              style={styles.bikeImage}
              resizeMode="contain"
            />
            <Text style={styles.bikeName}>{data?.vehicle_name}</Text>
          </View>

          <View style={styles.dateSection}>
            <View style={styles.dateBlock}>
              <Text style={styles.dateLabel}>Start Date</Text>
              <View style={styles.dateDisplay}>
                <Ionicons name="calendar-outline" size={20} color="#666" />
                <Text style={styles.dateText}>{formattedDate}</Text>
              </View>
            </View>
            <View style={styles.dateBlock}>
              <Text style={styles.dateLabel}>End Date</Text>
              <View style={styles.dateDisplay}>
                <Ionicons name="calendar-outline" size={20} color="#666" />
                <Text style={styles.dateText}>{formattedDat_ende}</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bike Details</Text>
            <View style={styles.detailsGrid}>
              <DetailRow
                label="Bike Condition"
                value={`${data?.bike_condition}/5`}
              />
              <DetailRow label="Category" value={data?.category} />
              <DetailRow
                label="Theft Assurance"
                value={data?.theft_assurance}
              />
              <DetailRow
                label="Distance Travelled"
                value={data?.distance_travelled}
              />
              <DetailRow
                label="Last Service Date"
                value={data?.last_service_date}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Insurance</Text>
            <View style={styles.insuranceContainer}>
              <View style={styles.insuranceRow}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={24}
                  color="#666"
                />
                <Text style={styles.insuranceText}>Insurance Via Vendors</Text>
                <View className=" flex-1" />
                <TouchableOpacity style={styles.learnMoreButton}>
                  <Text style={styles.learnMoreText}>Learn more</Text>
                  <Ionicons name="chevron-forward" size={20} color="#FF6100" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cancellation Policy</Text>
            <View style={styles.policyContainer}>
              <Ionicons
                name="information-circle-outline"
                size={24}
                color="#666"
              />
              <Text style={styles.policyText}>
                Free cancellation, if cancelled before 5 days
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Listing Vendor</Text>
            <View style={styles.vendorContainer}>
              <View style={styles.vendorRow}>
                <ProfileImage uri={currentRide.Vendor_image} />
                <View style={styles.vendorInfo}>
                  <Text style={styles.vendorName}>John Doe</Text>
                  <Text style={styles.vendorLabel}>Vendor</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() =>
                router.push({
                  pathname: "/screens/CancelBooking",
                  params: { bookingId: bookingId },
                })
              }
            >
              <Text style={styles.buttonText}>Cancel Booking</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.extendButton]}
              onPress={() =>
                router.push({
                  pathname: "/screens/ReasonForExtend",
                  params: { bookingId: bookingId, vehicleId: vehicleId },
                })
              }
            >
              <Text style={styles.buttonText}>Extend Booking</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Modal animationType="fade" transparent={true} visible={isModalOpen}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Invalid Date</Text>
            <Text style={styles.modalMessage}>
              End date cannot be before the start date
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setIsModalOpen(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 16,
  },
  headerContainer: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    backgroundColor: "#fff",
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: 24,
  },
  disc: {
    width: 100,
    height: 85,
    backgroundColor: "#f2f2f2",
    borderRadius: 75,
    transform: [{ scaleX: 3 }],
    position: "absolute",
    bottom: 0,
    zIndex: 0,
    elevation: 15, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  bikeImage: {
    width: 240,
    height: 180,
    marginBottom: 16,
  },
  bikeName: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1A1A1A",
    textAlign: "center",
  },
  dateSection: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 24,
  },
  dateBlock: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
    marginBottom: 8,
  },
  dateDisplay: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  dateText: {
    fontSize: 15,
    color: "#1A1A1A",
    fontWeight: "500",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 16,
  },
  detailsGrid: {
    backgroundColor: "#F8F8F8",
    borderRadius: 12,
    padding: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  detailLabel: {
    fontSize: 15,
    color: "#666",
  },
  detailValue: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1A1A1A",
  },
  insuranceContainer: {
    backgroundColor: "#F8F8F8",
    borderRadius: 12,
    padding: 16,
  },
  insuranceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  insuranceText: {
    fontSize: 15,
    color: "#1A1A1A",
    fontWeight: "500",
  },
  learnMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  learnMoreText: {
    fontSize: 14,
    color: "#FF6100",
    fontWeight: "500",
  },
  policyContainer: {
    backgroundColor: "#F8F8F8",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  policyText: {
    fontSize: 15,
    color: "#1A1A1A",
    flex: 1,
  },
  vendorContainer: {
    backgroundColor: "#F8F8F8",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  vendorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  vendorInfo: {
    gap: 4,
  },
  vendorName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  vendorLabel: {
    fontSize: 14,
    color: "#666",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
    marginBottom: 24,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#E40000",
  },
  extendButton: {
    backgroundColor: "#FF6100",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  modalButtonText: {
    fontSize: 16,
    color: "#FF6100",
    fontWeight: "600",
  },
});

export default CurrentSubscription;
