import React from "react";
import { View, Text, Platform, StyleSheet, Dimensions } from "react-native";
import { WebView } from "react-native-webview";

const App = () => {
  return (
    <View style={styles.container}>
      {Platform.OS === "android" || Platform.OS === "ios" ? (
        <WebView
          source={{ uri: "http://192.168.225.240:7000/" }}
          style={styles.webview}
        />
      ) : (
        <Text style={styles.errorText}>erreur liée à la plateforme</Text>
      )}
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  webview: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  errorText: {
    color: "red",
    fontSize: 18,
  },
});
