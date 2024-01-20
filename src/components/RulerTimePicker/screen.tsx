import { StatusBar } from "expo-status-bar";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { ZoomIn } from "react-native-reanimated";
import { useState } from "react";
import { RulerTimePicker } from "./RulerTimePicker";

export function RulerTimePickerScreen() {
  const [state, setState] = useState({
    hour: 8,
    minute: 21,
  });
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#e7ecf2",
        }}
      >
        <Animated.View
          entering={ZoomIn.delay(200)}
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

          <RulerTimePicker
            initialHour={state.hour}
            initialMinute={state.minute}
            onChange={(hour, minute) => {
              setState({
                hour,
                minute,
              });
            }}
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 20,
              gap: 20,
            }}
          >
            <TouchableOpacity
              accessibilityRole="button"
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
              accessibilityRole="button"
              onPress={() => {
                Alert.alert(
                  "Done",
                  `You set reminder at ${state.hour}:${state.minute}`,
                );
              }}
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
        </Animated.View>
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
