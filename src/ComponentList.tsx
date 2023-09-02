import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

import { ScrollView } from "react-native-gesture-handler";
import { useAppNavigation } from "./utils/useNavigation";
import { SafeAreaView } from "react-native-safe-area-context";

export function ComoponentList() {
  const navgation = useAppNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView>
        <TouchableOpacity
          style={styles.item}
          onPress={() => navgation.navigate("PasswordInput")}
        >
          <Text>PasswordInput</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.item}
          onPress={() => navgation.navigate("SolarTimePicker")}
        >
          <Text>SolarTimePicker</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});
