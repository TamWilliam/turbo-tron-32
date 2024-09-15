import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { View } from "react-native";
import HomeScreen from "./app/screens/HomeScreen";
import SuccessScreen from "./app/screens/SuccessScreen";
import ConnectionScreen from "./app/screens/ConnectionScreen";
import ManualControlScreen from "./app/screens/ManualControlScreen";
import AutomaticControlScreen from "./app/screens/AutomaticControlScreen";
import CarStatisticsScreen from "./app/screens/CarStatisticsScreen";
import RaceStatsScreen from "./app/screens/RaceStatsScreen";
import { RootStackParamList } from "./types";

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
          name="Connection"
          component={ConnectionScreen}
          options={{
            title: "Connexion Véhicule",
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name="Success"
          component={SuccessScreen}
          options={{
            headerTitle: () => <View />,
          }}
        />
        <Stack.Screen
          name="ManualControl"
          component={ManualControlScreen}
          options={{ title: "Connexion" }}
        />
        <Stack.Screen
          name="CarStatistics"
          component={CarStatisticsScreen}
          options={{ title: "Données télémétriques" }}
        />
        <Stack.Screen
          name="RaceStats"
          component={RaceStatsScreen}
          options={{ title: "Contrôle manuel" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
