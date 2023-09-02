import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { SolerTimePickerScreen } from "./components/SolarTimePicker/screen";
import { PasswordInputScreen } from "./components/PasswordInput/screen";
import { ComoponentList } from "./ComponentList";
import { NavigationProp, useNavigation } from "@react-navigation/native";

export type RootStackParams = {
  SolarTimePicker: undefined;
  PasswordInput: undefined;
  ComoponentList: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParams>();

export const RootStackNavigation = () => {
  return (
    <RootStack.Navigator
      initialRouteName="ComoponentList"
      screenOptions={{ headerShown: false }}
    >
      <RootStack.Screen name="ComoponentList" component={ComoponentList} />
      <RootStack.Screen
        name="SolarTimePicker"
        component={SolerTimePickerScreen}
      />
      <RootStack.Screen name="PasswordInput" component={PasswordInputScreen} />
    </RootStack.Navigator>
  );
};
