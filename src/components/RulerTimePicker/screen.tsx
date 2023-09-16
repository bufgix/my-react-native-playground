import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { RulerTimePicker } from "./RulesTimePicker";

export function RulerTimePickerScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#e7ecf2",
        }}
      >
        <View
          style={{
            padding: 20,
            backgroundColor: "#fffeff",
            borderRadius: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
              }}
            >
              Set Reminder
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color: "#8b93b7",
              }}
            >
              Edit
            </Text>
          </View>

          <RulerTimePicker />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 20,
              gap: 20,
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: "#e7ecf2",
                padding: 15,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 10,
              }}
            >
              <Text
                style={{
                  color: "#8b93b7",
                  fontWeight: "bold",
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: "#f3906e",
                padding: 15,
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                Done
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
