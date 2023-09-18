import { StatusBar } from "expo-status-bar";
import { ImageBackground, StyleSheet, Text, View } from "react-native";

import { NotificationStack } from "./NotificationStack";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function NotificationStackScreen() {
  const { bottom } = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ImageBackground
        source={require("./bg.jpg")}
        style={{ flex: 1, alignItems: "center", justifyContent: "flex-end" }}
      >
        <NotificationStack style={{ marginBottom: bottom }} />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});
