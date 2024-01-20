import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { ResizeMode, Video } from "expo-av";

export function Spotify() {
  return (
    <View
      style={{
        backgroundColor: "black",
        flex: 1,
        borderRadius: 30,
        overflow: "hidden",
      }}
    >
      <Video
        source={require("./joji.mp4")}
        isLooping
        style={StyleSheet.absoluteFill}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        volume={0}
      />
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: "rgba(0,0,0,0.5)",
          },
        ]}
      />
      <View style={{ justifyContent: "space-between", flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Image
            source={require("./spotify.webp")}
            style={{ width: 70, height: 70 }}
          />
          <Text
            style={{
              color: "white",
              fontSize: 24,
              fontWeight: "bold",
            }}
          >
            New Album
          </Text>
          <View
            style={{
              width: 70,
              height: 70,
            }}
          />
        </View>

        <View style={{ padding: 30 }}>
          <Text
            style={{
              color: "rgba(255,255,255,0.9)",
              fontSize: 24,
              fontWeight: "600",
            }}
          >
            Glimpse of us
          </Text>
          <Text
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: 14,
              fontWeight: "600",
            }}
          >
            JOJI
          </Text>

          <View
            style={{
              marginTop: 20,
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                color: "white",
                fontWeight: "bold",
              }}
            >
              00:00
            </Text>
            <View
              style={{
                flex: 1,
                height: 5,
                borderRadius: 5,
                backgroundColor: "rgba(255,255,255,0.5)",
              }}
            />
            <Text
              style={{
                fontSize: 12,
                color: "white",
                fontWeight: "bold",
              }}
            >
              03:00
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
