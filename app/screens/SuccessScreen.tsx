import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const SuccessScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/success.png")}
        style={styles.image}
      />
      <Text style={styles.text}>Véhicule connecté avec succès</Text>
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
