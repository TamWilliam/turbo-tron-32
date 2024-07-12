import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const ChoiceScreen: React.FC = () => {
  const vehicles = ["Bluetooth 1", "Bluetooth 1", "Bluetooth 1", "Bluetooth 1"];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sélectionner votre véhicule</Text>
      <FlatList
        data={vehicles}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item}>
            <Text style={styles.itemText}>{item}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  item: {
    padding: 15,
    backgroundColor: "#f0f0f0",
    marginBottom: 10,
    borderRadius: 5,
  },
  itemText: {
    fontSize: 16,
  },
});

export default ChoiceScreen;
