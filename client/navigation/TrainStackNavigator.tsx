import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TrainScreen from "@/screens/TrainScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";

export type TrainStackParamList = {
  Train: undefined;
};

const Stack = createNativeStackNavigator<TrainStackParamList>();

export default function TrainStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Train"
        component={TrainScreen}
        options={{
          headerTitle: "Training",
        }}
      />
    </Stack.Navigator>
  );
}
