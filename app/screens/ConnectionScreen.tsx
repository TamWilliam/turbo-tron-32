import React, { useState } from "react";
import { View, Text, Button } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { StackScreenProps } from "@react-navigation/stack";
import styles from "../styles/ConnectionScreenStyle";

type RootStackParamList = {
  Home: undefined;
  Connection: undefined;
  Success: undefined;
  Choice: undefined;
};

type ConnectionScreenProps = StackScreenProps<RootStackParamList, "Connection">;

const ConnectionScreen: React.FC<ConnectionScreenProps> = ({ navigation }) => {
  const [connectionMode, setConnectionMode] = useState<string | undefined>(
    undefined
  );
  const [controlMode, setControlMode] = useState<string | undefined>(undefined);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Sélectionner un mode de connexion</Text>
      <Picker
        selectedValue={connectionMode}
        onValueChange={(itemValue: React.SetStateAction<string | undefined>) =>
          setConnectionMode(itemValue)
        }
        style={styles.picker}
      >
        <Picker.Item label="Bluetooth" value="bluetooth" />
        <Picker.Item label="Wi-Fi" value="wifi" />
      </Picker>

      <Text style={styles.label}>Choisissez un mode de contrôle</Text>
      <Picker
        selectedValue={controlMode}
        onValueChange={(itemValue: React.SetStateAction<string | undefined>) =>
          setControlMode(itemValue)
        }
        style={styles.picker}
      >
        <Picker.Item label="Manuel" value="manual" />
        <Picker.Item label="Automatique" value="automatic" />
      </Picker>

      <Button
        title="Continuer"
        onPress={() => {
          if (connectionMode && controlMode) {
            navigation.navigate("Choice");
          } else {
            alert(
              "Veuillez sélectionner un mode de connexion et un mode de contrôle."
            );
          }
        }}
        color="#FF1493"
      />
    </View>
  );
};

export default ConnectionScreen;
