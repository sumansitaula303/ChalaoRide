import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
type ourDateTimePickerProps = {
  togglePicker: () => void;
  date: Date;
  showPicker: boolean;
  onChange: (event: DateTimePickerEvent, selectedDate?: Date) => void;
};
const OurDateTimePicker = ({
  date,
  onChange,
  showPicker,
  togglePicker,
}: ourDateTimePickerProps) => {
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });
  return (
    <View>
      <TouchableOpacity
        onPress={togglePicker}
        className=" px-2 py-3 border border-[#C4C4C4] rounded-lg"
      >
        <Text>{formattedDate}</Text>
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={"date"}
          is24Hour={true}
          onChange={onChange}
        />
      )}
    </View>
  );
};

export default OurDateTimePicker;
