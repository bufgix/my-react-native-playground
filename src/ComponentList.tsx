import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppNavigation } from "./utils/useNavigation";
import { ComponentScreenList } from "./constants";

export function ComoponentList() {
  const navgation = useAppNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView>
        {Object.keys(ComponentScreenList).map((name) => (
          <TouchableOpacity
            accessibilityRole="button"
            key={name}
            style={styles.item}
            onPress={() => navgation.navigate(name as any)}
          >
            <Text>{name}</Text>
          </TouchableOpacity>
        ))}
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
