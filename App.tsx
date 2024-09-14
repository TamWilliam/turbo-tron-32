import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./app/screens/HomeScreen";
import SuccessScreen from "./app/screens/SuccessScreen";
import ManualControlScreen from "./app/screens/ManualControlScreen";
import TelemetryDataScreen from "./app/screens/TelemetryDataScreen";
type RootStackParamList = {
  Home: undefined;
  Success: undefined;
  ManualControl: undefined;
  TelemetryData: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Success"
          component={SuccessScreen}
          options={{ title: "Succès" }}
        />
        <Stack.Screen
          name="ManualControl"
          component={ManualControlScreen}
          options={{ title: "Connexion" }}
        />
        <Stack.Screen
          name="TelemetryData"
          component={TelemetryDataScreen}
          options={{ title: "Contrôle manuel" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
