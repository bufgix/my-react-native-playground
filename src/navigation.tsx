import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { ComoponentList } from "./ComponentList";
import { ComponentScreenList } from "./constants";

export type RootStackParams = {
  [key in keyof typeof ComponentScreenList]: undefined;
} & {
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
      {Object.entries(ComponentScreenList).map(([name, component]) => (
        <RootStack.Screen
          key={name}
          name={name as keyof RootStackParams}
          component={component}
        />
      ))}
    </RootStack.Navigator>
  );
};
