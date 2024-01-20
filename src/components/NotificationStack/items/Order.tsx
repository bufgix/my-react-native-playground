import React from "react";
import { Image, ImageBackground, View, Text, Dimensions } from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;
const ITEM_SIZE = SCREEN_WIDTH * 0.8;

export function Order() {
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
        source={require("./map.png")}
        resizeMode="cover"
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            justifyContent: "space-between",
            flex: 1,
            paddingBottom: 30,
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 10,
              paddingTop: 10,
            }}
          >
            <Image
              source={require("./amazon.png")}
              style={{ width: 50, height: 50 }}
            />
            <Text
              style={{
                color: "black",
                fontSize: 20,
                fontWeight: "bold",
              }}
            >
              Out for Delivery
            </Text>
            <View
              style={{
                width: 50,
                height: 50,
              }}
            />
          </View>

          <Text
            style={{
              color: "#f5621e",
              fontSize: 24,
              fontWeight: "bold",
            }}
          >
            View Order
          </Text>
        </View>
        <Image
          source={require("./truck.png")}
          style={{
            top: ITEM_SIZE / 2,
            left: ITEM_SIZE / 2,
            position: "absolute",
            width: 120,
            height: 120,
            transform: [
              {
                rotate: "-25deg",
              },
              {
                translateY: -100,
              },
              {
                translateX: -20,
              },
            ],
          }}
        />
      </ImageBackground>
    </View>
  );
}
