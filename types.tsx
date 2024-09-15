import { StackScreenProps } from "@react-navigation/stack";

export type RootStackParamList = {
  Home: undefined;
  Connection: undefined;
  Success: { controlMode: string };
  ManualControl: undefined;
  AutomaticControl: undefined;
  CarStatistics: undefined;
  RaceStats: undefined;
};

export type HomeScreenNavigationProp = StackScreenProps<
  RootStackParamList,
  "Home"
>;
export type ConnectionScreenProps = StackScreenProps<
  RootStackParamList,
  "Connection"
>;
export type SuccessScreenProps = StackScreenProps<
  RootStackParamList,
  "Success"
>;
export type ManualControlScreenProps = StackScreenProps<
  RootStackParamList,
  "ManualControl"
>;
export type AutomaticControlScreenProps = StackScreenProps<
  RootStackParamList,
  "AutomaticControl"
>;
export type CarStatisticsScreenProps = StackScreenProps<
  RootStackParamList,
  "CarStatistics"
>;
export type RaceStatsScreenProps = StackScreenProps<
  RootStackParamList,
  "RaceStats"
>;
