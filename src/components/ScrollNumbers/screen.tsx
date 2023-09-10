import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { ScrollNumbers } from "./ScrollNumbers";

export function ScrollNumbersScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View
        style={{
          flex: 1,
          backgroundColor: "black",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ScrollNumbers />
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
