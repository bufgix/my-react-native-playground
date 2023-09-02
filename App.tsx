import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

import { SolarTimePicker } from "./src/components/SolarTimePicker/SolarTimePicker";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar style="light" />
        <View
          style={{ flex: 2, justifyContent: "flex-end", alignItems: "center" }}
        >
          <SolarTimePicker />
        </View>
        <View style={{ flex: 3 }} />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1b191b",
  },
});
