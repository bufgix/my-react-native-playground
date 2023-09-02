import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

import { SolarTimePicker } from "./src/components/SolarTimePicker/SolarTimePicker";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { RootStackNavigation } from "./src/navigation";
import { NavigationContainer } from "@react-navigation/native";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <RootStackNavigation />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1b191b",
  },
});
