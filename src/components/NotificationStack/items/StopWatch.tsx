import React from "react";
import { View, ImageBackground } from "react-native";

export function StopWatch() {
  return (
    <View
      style={{
        backgroundColor: "white",
        flex: 1,
        borderRadius: 30,
        overflow: "hidden",
      }}
    >
      <ImageBackground
        source={require("./Screen.png")}
        resizeMode="contain"
        style={{
          flex: 1,
        }}
      ></ImageBackground>
    </View>
  );
}
