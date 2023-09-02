import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";

import { SolarTimePicker } from "./SolarTimePicker";

export function SolerTimePickerScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View
        style={{ flex: 2, justifyContent: "flex-end", alignItems: "center" }}
      >
        <SolarTimePicker />
      </View>
      <View style={{ flex: 3 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1b191b",
  },
});
