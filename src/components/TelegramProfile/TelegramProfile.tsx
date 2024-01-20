import {
  Blur,
  Canvas,
  Circle,
  ColorMatrix,
  Group,
  Image,
  Paint,
  Rect,
  useImage,
} from "@shopify/react-native-skia";
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  interpolateColor,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";

const DATA = Array.from({ length: 100 }, (_, i) => i);
const SCREEN_WIDTH = Dimensions.get("window").width;
const CIRCLE_MAX_RADIUS = 50;
const NOTCH_HEIGHT = 30;
const NOTCH_WIDTH = 80;
const top = 48; // safe areacontext doesn't provide top inset, so it's hardcoded 🤷‍♂️
const debugTop = 0;
const NOTCH_Y = top - NOTCH_HEIGHT - debugTop;
const PROFILE_CIRCLE_Y = CIRCLE_MAX_RADIUS + top + debugTop + 30;

export function TelegramProfile() {
  const scrollY = useSharedValue(0);
  const image = useImage(require("../../../assets/me.jpg"));

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const circleY = useDerivedValue(() => {
    return interpolate(
      scrollY.value,
      [0, 100],
      [PROFILE_CIRCLE_Y, 30],
      Extrapolate.CLAMP,
    );
  });

  const circleSize = useDerivedValue(() => {
    return interpolate(
      scrollY.value,
      [10, 100],
      [CIRCLE_MAX_RADIUS, NOTCH_HEIGHT / 2],
      Extrapolate.CLAMP,
    );
  });

  const imageSize = useDerivedValue(() => {
    return interpolate(
      scrollY.value,
      [20, 80],
      [CIRCLE_MAX_RADIUS * 2, (NOTCH_HEIGHT / 2) * 2],
      Extrapolate.CLAMP,
    );
  });

  const roundedRect = useDerivedValue(() => {
    return {
      rect: {
        x: SCREEN_WIDTH / 2 - imageSize.value / 2,
        y: circleY.value - imageSize.value / 2,
        width: imageSize.value,
        height: imageSize.value,
      },
      rx: 9999,
      ry: 9999,
    };
  });

  const imageRectX = useDerivedValue(() => {
    return SCREEN_WIDTH / 2 - imageSize.value / 2;
  });

  const imageRectY = useDerivedValue(() => {
    return circleY.value - imageSize.value / 2;
  });

  const imageBlur = useDerivedValue(() => {
    return interpolate(scrollY.value, [20, 60], [0, 10], Extrapolate.CLAMP);
  });

  const imageOpacity = useDerivedValue(() => {
    return interpolate(scrollY.value, [20, 100], [1, 0], Extrapolate.CLAMP);
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const height = Math.max(
      PROFILE_CIRCLE_Y + CIRCLE_MAX_RADIUS + 100 - scrollY.value,
      top + NOTCH_HEIGHT + debugTop + 20,
    );

    const backgroundColor = interpolateColor(
      scrollY.value,
      [0, 100],
      ["#1b1f2b", "#232c3d"],
    );

    return {
      height,
      backgroundColor,
    };
  });

  const titleStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      [100, 200],
      [1, 0.7],
      Extrapolate.CLAMP,
    );

    const y = interpolate(
      scrollY.value,
      [100, 200],
      [0, 60],
      Extrapolate.CLAMP,
    );

    return {
      transform: [{ scale }, { translateY: y }],
    };
  });

  const subTitleStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [80, 130],
      [1, 0],
      Extrapolate.CLAMP,
    );

    return {
      opacity,
    };
  });

  return (
    <View>
      {/* Header */}
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <Animated.Text style={[styles.title, titleStyle]}>
          Ömer Faruk Oruç
        </Animated.Text>
        <Animated.Text style={[styles.subTitle, subTitleStyle]}>
          +90 555 555 55 55 • @bufgix
        </Animated.Text>
      </Animated.View>

      <Canvas
        style={[
          styles.canvas,
          {
            height: PROFILE_CIRCLE_Y + CIRCLE_MAX_RADIUS,
          },
        ]}
      >
        <Group
          layer={
            <Paint>
              <Blur blur={imageBlur} />
              <ColorMatrix
                matrix={[
                  1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 15, -7,
                ]}
              />
            </Paint>
          }
        >
          {/* Top notch rect */}
          <Rect
            x={SCREEN_WIDTH / 2 - NOTCH_WIDTH / 2}
            y={NOTCH_Y}
            width={NOTCH_WIDTH}
            height={NOTCH_HEIGHT}
            color={"black"}
          />

          {/* Profile circle */}
          <Circle
            cx={SCREEN_WIDTH / 2}
            cy={circleY}
            r={circleSize}
            color={"black"}
          />

          {/* Profile image */}
          {image && (
            <Group clip={roundedRect}>
              <Image
                opacity={imageOpacity}
                image={image}
                x={imageRectX}
                y={imageRectY}
                width={imageSize}
                height={imageSize}
                fit={"fill"}
              />
            </Group>
          )}
        </Group>
      </Canvas>

      <Animated.FlatList
        contentContainerStyle={{
          paddingTop: PROFILE_CIRCLE_Y + CIRCLE_MAX_RADIUS + 100,
        }}
        data={DATA}
        onScroll={onScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <View style={{ padding: 10 }}>
            <Text style={{ color: "white" }}>{item}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: {
    zIndex: 2,
    ...StyleSheet.absoluteFillObject,
    width: "100%",
  },
  header: {
    zIndex: 1,
    position: "absolute",
    width: "100%",
    justifyContent: "flex-end",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
    marginTop: 20,
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.5)",
    marginBottom: 20,
  },
});
