import React, { useState } from "react";
import { Dimensions, TextInput, View } from "react-native";
import Animated, {
  FadeInDown,
  FadeOutDown,
  interpolateColor,
  useAnimatedProps,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Path, Svg } from "react-native-svg";

/**
 * inpriration: https://twitter.com/nitishkmrk/status/1697583481294078136
 */

const SCREEN_WIDTH = Dimensions.get("window").width;

const inputWidth = SCREEN_WIDTH * 0.8;
const inputHeight = 40;
const inputBorderWidth = 3;
const inputBorderRadius = 5;

const AnimtedPath = Animated.createAnimatedComponent(Path);

const MAX_PASSWORD_LENGTH = 8;
const STEP_COLORS = [
  "#2e5fce",
  "#2e5fce",
  "#ae49d2",
  "#ae49d2",
  "#ae49d2",
  "#ae49d2",
  "#ae49d2",
  "#2fb96c",
];

const path = `
    M 2 ${inputHeight / 2 + 3} 
    v ${-inputHeight / 2 + inputBorderRadius}
    a ${inputBorderRadius} ${inputBorderRadius} 0 0 1 ${inputBorderRadius} ${-inputBorderRadius}
    h ${inputWidth - 2.9 * inputBorderRadius}
    a ${inputBorderRadius} ${inputBorderRadius} 0 0 1 ${inputBorderRadius} ${inputBorderRadius}
    v ${inputHeight - 0.4 * inputBorderRadius}
    a ${inputBorderRadius} ${inputBorderRadius} 0 0 1 ${-inputBorderRadius} ${inputBorderRadius}
    h ${-inputWidth + 2.9 * inputBorderRadius}
    a ${inputBorderRadius} ${inputBorderRadius} 0 0 1 ${-inputBorderRadius} ${-inputBorderRadius}
    Z
`;

const pathLength =
  2 * inputWidth + 2 * inputHeight - 4 * inputBorderRadius + 25;

export function PasswordInput() {
  const [password, setPassword] = useState("");
  const progress = useSharedValue(0);

  const pathAnimatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: pathLength * (1 - progress.value),
      stroke: interpolateColor(
        progress.value,
        STEP_COLORS.map((_, i) => i / (STEP_COLORS.length - 1)),
        STEP_COLORS,
      ),
    };
  }, []);

  const onChangePassword = (text: string) => {
    if (text.length <= MAX_PASSWORD_LENGTH) {
      setPassword(text);
      progress.value = withSpring(text.length / MAX_PASSWORD_LENGTH, {
        damping: 20,
        stiffness: 100,
      });
    }
  };

  return (
    <View style={{ position: "relative" }}>
      {password.length > 0 && (
        <Animated.Text
          entering={FadeInDown}
          exiting={FadeOutDown}
          style={{
            position: "absolute",
            top: -27,
            left: 0,
            color: "#aeaeae",
            fontSize: 16,
          }}
        >
          Password
        </Animated.Text>
      )}

      <View
        style={{
          shadowColor: "#ccc",
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.22,
          shadowRadius: 2.22,
          backgroundColor: "white",
          borderRadius: inputBorderRadius,
          padding: 0,
        }}
      >
        <Svg width={inputWidth} height={inputHeight + 13}>
          <Path
            d={path}
            stroke="#ccc"
            fill="none"
            strokeWidth={inputBorderWidth}
          />
          <AnimtedPath
            d={path}
            animatedProps={pathAnimatedProps}
            fill="none"
            strokeWidth={inputBorderWidth}
            strokeDasharray={pathLength}
          />
        </Svg>
        <TextInput
          accessibilityLabel="Text input field"
          style={{
            position: "absolute",
            top: 3,
            left: 0,
            width: inputWidth,
            height: inputHeight + 10,
            paddingHorizontal: 10,
            fontSize: 16,
            color: "black",
          }}
          secureTextEntry
          value={password}
          placeholder="Password"
          onChangeText={onChangePassword}
        />
      </View>
    </View>
  );
}
