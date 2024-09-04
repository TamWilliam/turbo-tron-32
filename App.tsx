import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { View } from "react-native";
import HomeScreen from "./app/screens/HomeScreen";
import ConnectionScreen from "./app/screens/ConnectionScreen";
import SuccessScreen from "./app/screens/SuccessScreen";
import ManualControlScreen from "./app/screens/ManualControlScreen";
import AutomaticControlScreen from "./app/screens/AutomaticControlScreen";
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
            headerTitle: () => <View />, // Utiliser une vue vide pour supprimer le texte et garder l'icone
          }}
        />
        <Stack.Screen name="ManualControl" component={ManualControlScreen} />
        <Stack.Screen
          name="AutomaticControl"
          component={AutomaticControlScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
