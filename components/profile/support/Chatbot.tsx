import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

interface ChatbotProps {
  onClose: () => void;
}

interface ChatMessageProps {
  text: string;
  isUser?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ text, isUser = false }) => (
  <View
    style={{
      flexDirection: "row",
      justifyContent: isUser ? "flex-end" : "flex-start",
      marginVertical: 5,
      marginHorizontal: 10,
    }}
  >
    {!isUser && (
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: "#FF6100",
          justifyContent: "center",
          alignItems: "center",
          marginRight: 8,
        }}
      >
        <Ionicons name="chatbubble-ellipses" size={24} color="white" />
      </View>
    )}
    <View
      style={{
        backgroundColor: isUser ? "#FF6100" : "white",
        borderRadius: 20,
        padding: 10,
        maxWidth: "70%",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
      }}
    >
      <Text style={{ color: isUser ? "white" : "black" }}>{text}</Text>
    </View>
  </View>
);

const Chatbot: React.FC<ChatbotProps> = ({ onClose }) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F3F4F6" }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: "#E5E7EB",
          backgroundColor: "white",
        }}
      >
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: "600", marginLeft: 16 }}>
          Support
        </Text>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 10 }}>
        <ChatMessage text="Hello User" />
        <ChatMessage text="Welcome to Chalau Chatbot. What can I help you with?" />
        {/* Add more messages here */}
      </ScrollView>
      <View
        style={{
          flexDirection: "row",
          padding: 10,
          backgroundColor: "white",
          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",
          alignItems: "center",
        }}
      >
        <TextInput
          style={{
            flex: 1,
            height: 40,
            borderWidth: 1,
            borderColor: "#E5E7EB",
            borderRadius: 20,
            paddingHorizontal: 15,
            marginRight: 10,
          }}
          placeholder="Type a message..."
        />
        <TouchableOpacity>
          <Ionicons name="send" size={24} color="#FF6100" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Chatbot;
