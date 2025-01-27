import React, { useState } from "react";
import { View, Text, TouchableOpacity} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import NotificationList from "../notificationList";
import Chatbot from "./Chatbot";
import { SafeAreaView } from "react-native-safe-area-context";

interface SupportProps {
  onClose: () => void;
}

interface SupportItemProps {
  icon: string;
  title: string;
  onPress: () => void;
}

const SupportItem: React.FC<SupportItemProps> = ({ icon, title, onPress }) => (
  <TouchableOpacity
    style={{
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: "#E5E7EB",
    }}
    onPress={onPress}
  >
    <View
      style={{
        width: 40,
        height: 40,
        backgroundColor: "#F3F4F6",
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 16,
      }}
    >
      <Ionicons name={icon as any} size={24} color="#6B7280" />
    </View>
    <Text style={{ fontSize: 18 }}>{title}</Text>
  </TouchableOpacity>
);

const Support: React.FC<SupportProps> = ({ onClose }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);

  if (showNotifications) {
    return <NotificationList onClose={() => setShowNotifications(false)} />;
  }

  if (showChatbot) {
    return <Chatbot onClose={() => setShowChatbot(false)} />;
  }

  const handleChatbotPress = () => {
    setShowChatbot(true);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 5,
          borderBottomWidth: 1,
          borderBottomColor: "#E5E7EB",
        }}
      >
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: "600" }}>Support</Text>
        <TouchableOpacity onPress={() => setShowNotifications(true)}>
          <Ionicons name="notifications-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      <View>
        <SupportItem
          icon="call-outline"
          title="Call Customer Care"
          onPress={() => console.log("Call Customer Care")}
        />
        <SupportItem
          icon="people-outline"
          title="Call Vendor"
          onPress={() => console.log("Call Vendor")}
        />
        <SupportItem
          icon="alert-circle-outline"
          title="SOS"
          onPress={() => console.log("SOS")}
        />
        {/* <SupportItem
          icon="chatbubble-ellipses-outline"
          title="Chatbot"
          onPress={handleChatbotPress}
        /> */}
      </View>
      {/* <View style={{ position: "absolute", bottom: 32, right: 32 }}>
        <TouchableOpacity
          style={{
            width: 64,
            height: 64,
            backgroundColor: "#FF6100",
            borderRadius: 32,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={handleChatbotPress}
        >
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={32}
            color="white"
          />
        </TouchableOpacity>
      </View> */}
    </SafeAreaView>
  );
};

export default Support;
