import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";

import { TelegramProfile } from "./TelegramProfile";

export function TelegramProfileScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={{ flex: 1, backgroundColor: "#1b1f2b" }}>
        <TelegramProfile />
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
