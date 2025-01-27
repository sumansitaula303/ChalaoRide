import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import OfferCard from "../../../components/offers/OfferCard";
import Popup from "../../../components/offers/Popup";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

// This would typically come from an API
const offerData = [
  {
    id: 1,
    description:
      "Get 75% off on your first Bookings.\nUse FIRST on your First Rent.",
    expiryDate: "1/24",
  },
  {
    id: 2,
    description:
      "Get 5% off on your Vespa Bookings every friday. Use VESPAFRIDAY on your Rent.",
    expiryDate: "1/24",
  },
  {
    id: 3,
    description: "Enjoy 5% off on Fridays",
    expiryDate: "1/24",
  },
  {
    id: 4,
    description:
      "Hurry up and Grab 12% Voucher by Joining our live on August 12.",
    expiryDate: "1/24",
  },
];

export default function OffersScreen() {
  const router = useRouter();
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null);

  const handleOfferPress = (description: string) => {
    setSelectedOffer(description);
  };

  return (
  
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-row items-center p-4 bg-white">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold ml-4">Offers</Text>
      </View>
      <ScrollView className="flex-1 px-4 pt-4">
        {offerData.map((offer) => (
          <OfferCard
            key={offer.id}
            {...offer}
            onPress={() => handleOfferPress(offer.description)}
          />
        ))}
      </ScrollView>
      <Popup
        visible={selectedOffer !== null}
        onClose={() => setSelectedOffer(null)}
        offerDetails={selectedOffer || ""}
      />
    </SafeAreaView>
   
  );
}
