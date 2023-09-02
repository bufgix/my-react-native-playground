import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { PasswordInput } from "./src/components/PasswordInput";

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={{ flex: 2, justifyContent: "flex-end", alignItems: "center" }}>
        <PasswordInput />
      </View>
      <View style={{ flex: 3 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
