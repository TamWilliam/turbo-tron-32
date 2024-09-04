import React from "react";
import { View, Text, Button } from "react-native";
import { ManualControlScreenProps } from "../../types";

const ManualControlScreen: React.FC<ManualControlScreenProps> = ({
  navigation,
}) => {
  return (
    <View>
      <Text>Mode de contrôle manuel</Text>
    </View>
  );
};

export default ManualControlScreen;
