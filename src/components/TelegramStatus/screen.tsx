import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { TelegramStatus } from "./TelegramStatus";

export function TelegramStatusScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View
        style={{
          flex: 1,
        }}
      >
        <TelegramStatus />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});
