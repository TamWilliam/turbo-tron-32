import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import styles from "../styles/HomeScreenStyle";

type RootStackParamList = {
  Home: undefined;
  Connection: undefined;
  Success: undefined;
  Choice: undefined;
};

type HomeScreenNavigationProp = NavigationProp<RootStackParamList, "Home">;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

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
