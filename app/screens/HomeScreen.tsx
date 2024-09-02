import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../types";
import styles from "../styles/HomeScreenStyle";

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/logo_turbotron32.png")}
        style={styles.logo}
      />
      <Text style={styles.text}>Connectez votre véhicule pour commencer</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          console.log("Bouton cliqué");
          navigation.navigate("Connection");
        }}
      >
        <Text style={styles.buttonText}>Commencer</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;
