import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

import { AppleLoading } from "./AppleLoading";

export function AppleLoadingScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <AppleLoading />
        <Text
          style={{
            fontSize: 28,
            fontWeight: "bold",
            color: "black",
            marginTop: 16,
          }}
        >
          Ömer Faruk Oruç
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: "gray",
            marginTop: 8,
          }}
        >
          Signing in...
        </Text>
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
