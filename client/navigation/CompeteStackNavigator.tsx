import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CompeteScreen from "@/screens/CompeteScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";

export type CompeteStackParamList = {
  Compete: undefined;
};

const Stack = createNativeStackNavigator<CompeteStackParamList>();

export default function CompeteStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Compete"
        component={CompeteScreen}
        options={{
          headerTitle: "Leaderboard",
        }}
      />
    </Stack.Navigator>
  );
}
