import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { ConnectionScreenProps } from "../../types";
import styles from "../styles/ConnectionScreenStyle";
import SuccessScreen from "./SuccessScreen";

const ConnectionScreen: React.FC<ConnectionScreenProps> = ({ navigation }) => {
  const [controlMode, setControlMode] = useState<string>("manual"); // Mode de contrôle par défaut à "manual"
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [manualIp, setManualIp] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("Not connected");
  const [loading, setLoading] = useState(false);

  const screenWidth = Dimensions.get("window").width;

  const connectWebSocket = () => {
    if (!ssid || !password || !manualIp || !controlMode) {
      Alert.alert("Erreur", "Tous les champs doivent être remplis.");
      return;
    }

    setLoading(true);
    const ws = new WebSocket(`ws://${manualIp}/ws`);

    ws.onopen = () => {
      setConnectionStatus("Connected");
      const wifiConfig = {
        cmd: 10,
        ssid,
        password,
      };
      ws.send(JSON.stringify(wifiConfig));
      setLoading(false);
      navigation.navigate("Success", { controlMode });
    };

    ws.onmessage = (e: MessageEvent) => {
      console.log(e.data);
    };

    ws.onerror = (e: Event) => {
      setConnectionStatus("Error");
      setLoading(false);
      console.error("WebSocket error", e);
    };

    ws.onclose = (e: CloseEvent) => {
      setConnectionStatus("Disconnected");
      setLoading(false);
      console.log(`WebSocket closed with code: ${e.code}, reason: ${e.reason}`);
    };
  };

  return (
    <KeyboardAvoidingView
      style={[
        styles.container,
        screenWidth > 1024 ? styles.containerLarge : styles.containerSmall,
      ]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <View style={[styles.formGroup, styles.formGroupFirst]}>
        <Text style={styles.label}>Nom du réseau (SSID)</Text>
        <TextInput
          value={ssid}
          onChangeText={setSsid}
          style={styles.input}
          placeholder="SSID"
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Mot de passe Wi-Fi</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          placeholder="Password"
          secureTextEntry
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Adresse IP de l'ESP32</Text>
        <TextInput
          value={manualIp}
          onChangeText={setManualIp}
          style={styles.input}
          placeholder="Adresse IP"
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Choisissez un mode de contrôle</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={controlMode}
            onValueChange={(itemValue: React.SetStateAction<string>) =>
              setControlMode(itemValue)
            }
            style={styles.picker}
          >
            <Picker.Item label="Manuel" value="manual" />
            <Picker.Item label="Automatique" value="automatic" />
          </Picker>
        </View>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        // <TouchableOpacity
        //   style={styles.button}
        //   onPress={() => {
        //     console.log("Bouton cliqué");
        //     navigation.navigate("Success", { controlMode });
        //   }}
        //   activeOpacity={0.7}
        // >
        //   <Text style={styles.buttonText}>Connecter</Text>
        // </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={connectWebSocket}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Connecter</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.status}>Status: {connectionStatus}</Text>
    </KeyboardAvoidingView>

  );
};

export default ConnectionScreen;
