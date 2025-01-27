import React, { useState, memo } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Linking,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import getSingleVechile from "@/services/getSingleVechile";

// Mock data
const bikeDetails = [
  { label: "Bike Condition", value: "5/5" },
  { label: "Category", value: "Budget" },
  { label: "Theft Assurance", value: "Not Covered" },
  { label: "Distance Travelled", value: "5000 km" },
  { label: "Last Servicing Date", value: "2023/11/10" },
];

const segments = ["Budget", "Premium", "Standard"];
const vendorPhoneNumber = "+977-9876543210";
const reviews = [
  {
    date: "10 Feb, 2024",
    text: "Nice bike. Totally worth renting. Great. Enjoyed my ride with this bike.",
    user: "Mr Invisible",
    rating: 5,
    avatarUrl:
      "https://image.shutterstock.com/image-vector/default-avatar-profile-image-vector-260nw-1725655669.jpg",
  },
  {
    date: "10 Feb, 2024",
    text: "Nice bike. Totally worth renting. Great. Enjoyed my ride with this bike.",
    user: "Mr Invisible",
    rating: 5,
    avatarUrl:
      "https://image.shutterstock.com/image-vector/default-avatar-profile-image-vector-260nw-1725655669.jpg",
  },
];

// Mock data for policies
const insurancePolicy =
  "This is a mock insurance policy text that outlines the coverage.";
const cancellationPolicy =
  "This is a mock cancellation policy text that details the terms of cancellation.";

// Custom Dropdown Component
const CustomDropdown = ({ selectedSegment, setSelectedSegment }: any) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <Text>{selectedSegment}</Text>
        <Ionicons
          name={isDropdownOpen ? "chevron-up-outline" : "chevron-down-outline"}
          size={20}
        />
      </TouchableOpacity>

      {isDropdownOpen && (
        <View style={styles.dropdownMenu}>
          {segments.map((segment) => (
            <TouchableOpacity
              key={segment}
              style={[
                styles.dropdownItem,
                selectedSegment === segment && styles.selectedDropdownItem,
              ]}
              onPress={() => {
                setSelectedSegment(segment);
                setIsDropdownOpen(false);
              }}
            >
              <Text
                style={[
                  styles.dropdownText,
                  selectedSegment === segment && styles.selectedDropdownText,
                ]}
              >
                {segment}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

// Vendor Information Section
const VendorSection = () => {
  const handleCallPress = () => {
    Linking.openURL(`tel:${vendorPhoneNumber}`);
  };

  return (
    <View style={styles.vendorSection}>
      <View style={styles.accordionSection1}>
        <Text style={styles.accordionTitle}>Listing Vendor</Text>
        <View
          style={{ flexDirection: "row", marginTop: 10, alignItems: "center" }}
        >
          <Image
            source={{
              uri: "https://image.shutterstock.com/image-vector/default-avatar-profile-image-vector-260nw-1725655669.jpg",
            }}
            style={styles.vendorAvatar}
          />
          <View style={{ flexDirection: "row" }}>
            <View>
              <Text style={styles.vendorName}>John Doe</Text>
              <Text style={styles.vendorSubtitle}>Vendor</Text>
            </View>
            <TouchableOpacity onPress={handleCallPress}>
              <Ionicons
                name="call-outline"
                size={24}
                color="green"
                style={{ marginLeft: 170 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

// Star Rating Component
const StarRating = ({ rating }: { rating: number }) => (
  <View style={styles.starRating}>
    {Array.from({ length: 5 }).map((_, index) => (
      <Ionicons
        key={index}
        name={index < rating ? "star" : "star-outline"}
        size={16}
        color="#FFD700"
      />
    ))}
  </View>
);

// Accordion Section for Reviews
interface Review {
  date: string;
  text: string;
  user: string;
  rating: number;
  avatarUrl?: string; // Assuming avatarUrl is optional
}

const ReviewsSection = ({ reviews }: { reviews: Review[] }) => {
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);

  return (
    <View>
      <TouchableOpacity
        style={styles.accordionSection}
        onPress={() => setIsReviewsOpen(!isReviewsOpen)}
      >
        <Text style={styles.accordionTitle}>Reviews about the Bike</Text>
        <Ionicons
          name={isReviewsOpen ? "chevron-up-outline" : "chevron-down-outline"}
          size={20}
        />
      </TouchableOpacity>

      {isReviewsOpen && (
        <View style={styles.dropdownMenu}>
          {reviews.map((review, index) => (
            <View key={index} style={styles.reviewItem}>
              <View style={styles.userInfo}>
                <View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <StarRating rating={review.rating} />
                    <Text style={styles.reviewDate}>{review.date}</Text>
                  </View>
                  <Text>{review.text}</Text>
                  <View style={{ flexDirection: "row", marginTop: 10 }}>
                    <Image
                      source={{ uri: review.avatarUrl }} // Assuming review object contains avatarUrl
                      style={styles.avatar}
                    />
                    <Text style={styles.reviewUser}>{review.user}</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

// Insurance Policy Section
const InsurancePolicySection = memo(() => {
  const [isInsuranceOpen, setIsInsuranceOpen] = useState(false);

  return (
    <View>
      <TouchableOpacity
        style={styles.accordionSection}
        onPress={() => setIsInsuranceOpen(!isInsuranceOpen)}
      >
        <Text style={styles.accordionTitle}>Insurance Policy</Text>
        <Ionicons
          name={isInsuranceOpen ? "chevron-up-outline" : "chevron-down-outline"}
          size={20}
        />
      </TouchableOpacity>

      {isInsuranceOpen && (
        <View style={styles.dropdownMenu}>
          <Text>{insurancePolicy}</Text>
        </View>
      )}
    </View>
  );
});

// Cancellation Policy Section
const CancellationPolicySection = memo(() => {
  const [isCancellationOpen, setIsCancellationOpen] = useState(false);

  return (
    <View>
      <TouchableOpacity
        style={styles.accordionSection}
        onPress={() => setIsCancellationOpen(!isCancellationOpen)}
      >
        <Text style={styles.accordionTitle}>Cancellation Policy</Text>
        <Ionicons
          name={
            isCancellationOpen ? "chevron-up-outline" : "chevron-down-outline"
          }
          size={20}
        />
      </TouchableOpacity>

      {isCancellationOpen && (
        <View style={styles.dropdownMenu}>
          <Text>{cancellationPolicy}</Text>
        </View>
      )}
    </View>
  );
});

// Main Bike Details Screen
const BikeDetailsScreen = () => {
  const { id } = useLocalSearchParams();
  const ids = parseInt(Array.isArray(id) ? id[0] : id);
  const { data, isError, isLoading } = useQuery({
    queryKey: ["singleVechile", ids],
    queryFn: () => getSingleVechile(ids),
  });
  const [selectedSegment, setSelectedSegment] = useState(segments[0]);
  const [selectedPrice, setSelectedPrice] = useState("Monthly");
  const [isBikeDetailsOpen, setIsBikeDetailsOpen] = useState(false);

  const priceOptions = [
    { label: "Rs 950 \nper Day", type: "Daily" }, // Inserted line break
    { label: "Comming \nSoon", type: "Weekly" }, // Inserted line break
    { label: "Comming \nSoon", type: "Monthly" }, // Inserted line break
  ];

  const selectedPriceLabel =
    priceOptions.find((option) => option.type === selectedPrice)?.label ||
    "Rs 0";

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Top Section */}
        <View style={styles.topSection}>
          <Ionicons
            name="arrow-back-outline"
            size={24}
            style={styles.backIcon}
          />
          <Text style={styles.title}>Select Scooter</Text>
        </View>
        <View style={styles.selectionSection}>
          <Image
            source={{ uri: data?.thumbnail_image }}
            style={styles.scooterImage}
          />
          <Text style={styles.bikeTitle}>{data?.vehicle_name}</Text>
          {/* <CustomDropdown
            selectedSegment={selectedSegment}
            setSelectedSegment={setSelectedSegment}
          /> */}
        </View>

        {/* <View style={styles.priceOptions}>
          {priceOptions.map((option) => (
            <TouchableOpacity
              key={option.type}
              style={[
                styles.priceButton,
                selectedPrice === option.type && styles.selectedPriceButton,
              ]}
              onPress={() => setSelectedPrice(option.type)}
            >
              <Text
                style={[
                  styles.priceLabel,
                  selectedPrice === option.type && styles.selectedPriceLabel,
                ]}
              >
                {option.label}
              </Text>
              <Text
                style={[
                  styles.priceType,
                  selectedPrice === option.type && styles.selectedPriceLabel,
                ]}
              >
                {option.type}
              </Text>
            </TouchableOpacity>
          ))}
        </View> */}
        <View className=" mt-3" style={styles.infoCardsContainer}>
          {/* Segment Card */}
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Segment</Text>
            <View style={styles.segmentBadge}>
              <Ionicons name="bookmark-outline" size={16} color="#1552CC" />
              <Text style={styles.segmentText}>
                {data?.segment || "Budget"}
              </Text>
            </View>
          </View>

          {/* Price Card */}
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Daily Rate</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.currencySymbol}>Rs </Text>
              <Text style={styles.priceAmount}>{data?.price.Daily}</Text>
              <Text style={styles.priceUnit}>/day</Text>
            </View>
          </View>
        </View>

        {/* Vendor Section */}
        <VendorSection />

        {/* Bike Details Accordion */}
        <TouchableOpacity
          style={styles.accordionSection}
          onPress={() => setIsBikeDetailsOpen(!isBikeDetailsOpen)}
        >
          <Text style={styles.accordionTitle}>Bike Details</Text>
          <Ionicons
            name={
              isBikeDetailsOpen ? "chevron-up-outline" : "chevron-down-outline"
            }
            size={20}
          />
        </TouchableOpacity>

        {isBikeDetailsOpen && (
          <View style={styles.dropdownMenu}>
            <View style={styles.dropdownItem}>
              <Text style={styles.dropdownTextLabel}>{"Bike Condition"}</Text>
              <Text style={styles.dropdownTextValue}>
                {data?.bike_condition || "5 / 5"}
              </Text>
            </View>
            <View style={styles.dropdownItem}>
              <Text style={styles.dropdownTextLabel}>{"Category"}</Text>
              <Text style={styles.dropdownTextValue}>
                {data?.category || "Budget"}
              </Text>
            </View>
            <View style={styles.dropdownItem}>
              <Text style={styles.dropdownTextLabel}>{"Theft Insurance"}</Text>
              <Text style={styles.dropdownTextValue}>
                {data?.theft_assurance || "Covered"}
              </Text>
            </View>
            <View style={styles.dropdownItem}>
              <Text style={styles.dropdownTextLabel}>
                {"Distance Travalled"}
              </Text>
              <Text style={styles.dropdownTextValue}>
                {data?.distance_travelled + "km" || "1000"}
              </Text>
            </View>
            <View style={styles.dropdownItem}>
              <Text style={styles.dropdownTextLabel}>
                {"Last Servicing Date"}
              </Text>
              <Text style={styles.dropdownTextValue}>
                {data?.last_service_date || "2024-09-06"}
              </Text>
            </View>
          </View>
        )}
        {/* Insurance Policy Section */}
        <InsurancePolicySection />

        {/* Cancellation Policy Section */}
        <CancellationPolicySection />

        {/* Reviews Section */}
        <ReviewsSection reviews={reviews} />

        <View style={styles.floatingBox}>
          <View style={styles.bottomSection}>
            <View>
              <Text style={styles.priceText}>{"Rs " + data?.price.Daily}</Text>
              <Text style={styles.priceText}>Per Day</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: "/screens/RequestToBook",
                  params: { id: ids },
                });
              }}
              style={styles.bookNowButton}
            >
              <Text style={styles.bookNowText}>Book Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  floatingBox: {
    width: "100%",
    position: "relative", // Change to absolute for better floating effect
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 5, // Reduced elevation for a more subtle effect
    shadowColor: "#000", // for iOS shadow
    shadowOffset: { width: 3, height: 0 }, // Adjusted to give a more natural floating look
    shadowOpacity: 0.8, // Reduced opacity for a softer shadow
    shadowRadius: 6, // Increased radius for a broader shadow effect
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  topSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  selectionSection: {
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: {
    position: "absolute",
    left: 0,
    color: "#000000",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000000",
  },
  scooterImage: {
    width: 270,
    height: 150,
    resizeMode: "contain",
  },
  bikeTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#000000",
  },
  dropdownContainer: {
    width: 150,
    marginTop: 10,
  },
  dropdownButton: {
    padding: 10,
    backgroundColor: "#E8E8E8",
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownMenu: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
  },
  dropdownItem: {
    paddingVertical: 10,
  },
  dropdownText: {
    color: "#000000",
  },
  selectedDropdownItem: {
    backgroundColor: "#D0D0D0",
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  selectedDropdownText: {
    fontWeight: "bold",
  },
  priceOptions: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 20,
  },
  priceButton: {
    justifyContent: "space-between",
    paddingVertical: 15, // Reduced padding for a more rectangular shape
    paddingHorizontal: 30, // Increased horizontal padding
    backgroundColor: "#E8E8E8",
    borderRadius: 8, // Slightly rounded corners for style
    alignItems: "center",
    width: 160, // Increased width for a rectangle
  },
  selectedPriceButton: {
    backgroundColor: "#D9E2FF",
  },
  priceLabel: {
    fontSize: 14,
    fontWeight: "300",
    color: "#1552CC",
  },
  selectedPriceLabel: {
    fontWeight: "bold",
  },
  priceType: {
    fontSize: 13,
    color: "#707070",
  },
  vendorSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
  },
  vendorAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  vendorName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
    marginLeft: 10,
  },
  userInfo: {
    flexDirection: "row", // Align avatar and text horizontally
    alignItems: "center", // Center the items vertically
  },
  avatar: {
    width: 40, // Set width of the avatar
    height: 40, // Set height of the avatar
    borderRadius: 20, // Make it circular
    marginRight: 10, // Space between avatar and text
  },
  vendorSubtitle: {
    color: "#707070",
    marginLeft: 10,
  },
  accordionSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
  },
  accordionSection1: {
    flexDirection: "column",
    justifyContent: "space-between",
    paddingVertical: 20,
  },
  accordionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1552CC",
  },
  dropdownTextLabel: {
    fontSize: 14,
    color: "#707070",
  },
  dropdownTextValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000000",
  },
  reviewItem: {
    paddingVertical: 10,
  },
  reviewDate: {
    fontSize: 12,
    color: "#707070",
  },
  reviewUser: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: "bold",
    color: "#000000",
  },
  starRating: {
    flexDirection: "row",
    marginVertical: 5,
  },
  bottomSection: {
    width: "100%",
    marginHorizontal: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 20,
  },
  priceText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1552CC",
  },
  bookNowButton: {
    backgroundColor: "#FF6100",
    paddingVertical: 20,
    paddingHorizontal: 50,
    borderRadius: 16,
    marginRight: 50,
  },
  bookNowText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  infoCard: {
    flex: 1,
    backgroundColor: "#F8F9FD",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  infoLabel: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 8,
  },
  infoCardsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  segmentBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E3EAFF",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: "flex-start",
    gap: 6,
  },

  segmentText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1552CC",
  },

  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },

  currencySymbol: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1552CC",
    marginRight: 2,
  },

  priceAmount: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1552CC",
  },

  priceUnit: {
    fontSize: 14,
    color: "#666666",
    marginLeft: 4,
  },
});

export default BikeDetailsScreen;
