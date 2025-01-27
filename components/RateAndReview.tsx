import React from "react";
import { Modal, View, Text, TouchableOpacity, TextInput } from "react-native";
import { AirbnbRating } from "react-native-ratings";
import { StyleSheet } from "react-native";

interface RatingModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (rating: number, review: string) => void;
  vehicleName: string;
}

const RatingModal: React.FC<RatingModalProps> = ({
  isVisible,
  onClose,
  onSubmit,
  vehicleName,
}) => {
  const [rating, setRating] = React.useState(0);
  const [review, setReview] = React.useState("");

  const handleSubmit = () => {
    onSubmit(rating, review);
    setRating(0);
    setReview("");
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.title}>Rate your experience</Text>
          <Text style={styles.vehicleName}>{vehicleName}</Text>

          <AirbnbRating
            count={5}
            defaultRating={0}
            size={30}
            showRating={false}
            onFinishRating={(value) => setRating(value)}
          />

          <TextInput
            style={styles.input}
            placeholder="Write your review (optional)"
            multiline
            numberOfLines={4}
            value={review}
            onChangeText={setReview}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
            >
              <Text style={[styles.buttonText, styles.submitButtonText]}>
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
  },
  vehicleName: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginTop: 20,
    marginBottom: 20,
    textAlignVertical: "top",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    borderRadius: 8,
    padding: 12,
    width: "48%",
  },
  cancelButton: {
    backgroundColor: "#f2f2f2",
  },
  submitButton: {
    backgroundColor: "#007AFF",
  },
  buttonText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
  },
  submitButtonText: {
    color: "white",
  },
});

export default RatingModal;
