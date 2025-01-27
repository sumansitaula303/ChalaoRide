import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { string } from "zod";
type RideFilterProps = {
  type: "Fuel" | "Brand" | "Segment";
  items: string[];
  setSelected: (item: string | null) => void;
  //if future pass datas such as list from api then states
};
const RideFilter = ({ type, items, setSelected }: RideFilterProps) => {
  //states for opening and closing dropdown and tracking whitch item is selected
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [buttonLayout, setButtonLayout] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  //type of filter
  const url =
    type === "Fuel"
      ? require("../../assets/icons/fuel.png")
      : require("../../assets/icons/brand.png");
  console.log(url);

  // function fo selecting item click
  const handleSelect = (item: string) => {
    if (item === "Any") {
      setSelectedItem("Any");
      setSelected("Any");
    } else {
      setSelectedItem(item);
      setSelected(item);
    }
    setOpen(false);
  };
  return (
    <View>
      <TouchableOpacity
        onPress={() => setOpen(!open)}
        onLayout={(event) => setButtonLayout(event.nativeEvent.layout)}
        className=" flex-row w-[130] border-b-orange-500 border-x-gray-200 border-t-gray-200 border-b-4 border-x border-t rounded-lg px-2 py-2 aligns-center"
      >
        <Image source={url} className=" h-[18] w-[18]" />
        <Text className=" ml-2 text-sm font-normal">{type}</Text>
        <View className=" flex-1" />
        <AntDesign name={open ? "up" : "down"} size={18} color="black" />
      </TouchableOpacity>
      {!open ? null : (
        <View className=" w-[120] py-2 aligns-center">
          {items.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleSelect(item)}
              className=" border border-primary mb-2"
            >
              <View className=" flex-row">
                <Text className=" ml-2 text-sm font-normal">{item}</Text>
                <View className=" flex-1" />
                {selectedItem === item ? (
                  <AntDesign name="check" size={24} color="orange" />
                ) : null}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default RideFilter;
