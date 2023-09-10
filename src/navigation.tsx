import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { SolerTimePickerScreen } from "./components/SolarTimePicker/screen";
import { PasswordInputScreen } from "./components/PasswordInput/screen";
import { ComoponentList } from "./ComponentList";
import { ScrollNumbersScreen } from "./components/ScrollNumbers/screen";

export type RootStackParams = {
  SolarTimePicker: undefined;
  PasswordInput: undefined;
  ScrollNumbers: undefined;

  ComoponentList: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParams>();

export const RootStackNavigation = () => {
  return (
    <RootStack.Navigator
      initialRouteName="ScrollNumbers"
      screenOptions={{ headerShown: false }}
    >
      <RootStack.Screen name="ComoponentList" component={ComoponentList} />
      <RootStack.Screen
        name="SolarTimePicker"
        component={SolerTimePickerScreen}
      />
      <RootStack.Screen name="PasswordInput" component={PasswordInputScreen} />
      <RootStack.Screen name="ScrollNumbers" component={ScrollNumbersScreen} />
    </RootStack.Navigator>
  );
};
