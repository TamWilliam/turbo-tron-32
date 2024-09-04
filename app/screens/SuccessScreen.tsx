import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { SuccessScreenProps } from "../../types";
import styles from "../styles/SuccessSreenStyle";

const SuccessScreen: React.FC<SuccessScreenProps> = ({ route, navigation }) => {
  const { controlMode } = route.params;

  const handlePress = () => {
    if (controlMode === "manual") {
      navigation.navigate("ManualControl");
    } else if (controlMode === "automatic") {
      navigation.navigate("AutomaticControl");
    }
  };
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/success.png")}
        style={styles.image}
      />
      <Text style={styles.text}>Véhicule connecté avec succès</Text>

      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}> GO !</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    color: "black",
  },
});

export default SuccessScreen;
