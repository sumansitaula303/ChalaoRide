import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";

interface PopupProps {
  visible: boolean;
  onClose: () => void;
  offerDetails: string;
}

const Popup: React.FC<PopupProps> = ({ visible, onClose, offerDetails }) => (
  <Modal
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
    animationType="fade"
  >
    <TouchableWithoutFeedback onPress={onClose}>
      <View className="flex-1 justify-center items-center bg-black/50">
        <TouchableWithoutFeedback>
          <View className="bg-white p-6 rounded-lg w-4/5 m-4">
            <Text className="text-lg font-semibold mb-4">Offer Details</Text>
            <Text className="mb-4">{offerDetails}</Text>
            <TouchableOpacity
              onPress={onClose}
              className="bg-blue-500 py-2 px-4 rounded-lg self-end"
            >
              <Text className="text-white font-semibold">Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  </Modal>
);

export default Popup;
