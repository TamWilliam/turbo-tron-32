import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./app/screens/HomeScreen";
import ConnectionScreen from "./app/screens/ConnectionScreen";
import SuccessScreen from "./app/screens/SuccessScreen";
import ChoiceScreen from "./app/screens/ChoiceScreen";

type RootStackParamList = {
  Home: undefined;
  Connection: undefined;
  Success: undefined;
  Choice: undefined;
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
          name="Connection"
          component={ConnectionScreen}
          options={{ title: "Connexion Véhicule" }}
        />
        <Stack.Screen
          name="Success"
          component={SuccessScreen}
          options={{ title: "Succès" }}
        />
        <Stack.Screen
          name="Choice"
          component={ChoiceScreen}
          options={{ title: "Choix du Véhicule" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
