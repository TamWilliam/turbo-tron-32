import React from "react";
import { View, Text } from "react-native";
import { AutomaticControlScreenProps } from "../../types"; // Correct import path
import styles from "../styles/AutomaticControlScreenStyle";

const AutomaticControlScreen: React.FC<AutomaticControlScreenProps> = ({
  navigation,
}) => {
  return (
    <View>
      <Text>Mode de contrôle automatique</Text>
    </View>
  );
};

export default AutomaticControlScreen;
