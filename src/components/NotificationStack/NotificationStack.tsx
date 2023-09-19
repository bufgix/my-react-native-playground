import React from "react";
import { Dimensions, StyleSheet, View, ViewProps, Text } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolate,
  WithSpringConfig,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Spotify } from "./items/Spotify";
import { Order } from "./items/Order";
import { StopWatch } from "./items/StopWatch";

const SCREEN_WIDTH = Dimensions.get("window").width;
const ITEM_SIZE = SCREEN_WIDTH * 0.8;
const NOTIFICATIONS = [<StopWatch />, <Order />, <Spotify />];

const springConfig: WithSpringConfig = {
  damping: 20,
  stiffness: 200,
};

type NotificationItemProps = {
  index: number;
  x: Animated.SharedValue<number>;

  topElement: Animated.SharedValue<number>;
  stack: Animated.SharedValue<number[]>;
} & ViewProps;
function NotificationItem({
  index,
  x,
  stack,
  topElement,
  children,
}: NotificationItemProps) {
  const zIndex = useDerivedValue(() => {
    return stack.value.findIndex((v) => v === index);
  });

  const shouldMove = useDerivedValue(() => {
    return topElement.value === index;
  });

  const cardAnimatedStyle = useAnimatedStyle(() => {
    const baseScale = 1 - (NOTIFICATIONS.length - zIndex.value - 1) * 0.1;

    return {
      transform: [
        {
          translateX: shouldMove.value ? x.value : withSpring(0, springConfig),
        },
        {
          translateY: withSpring(-(zIndex.value * 30), springConfig),
        },
        {
          scale: shouldMove.value
            ? interpolate(
                x.value,
                [-ITEM_SIZE / 2, 0, ITEM_SIZE / 2],
                [0.7, baseScale, 0.7],
                Extrapolate.CLAMP
              )
            : withSpring(baseScale, springConfig),
        },
      ],
      zIndex: zIndex.value,
    };
  }, []);

  return (
    <Animated.View
      style={[
        styles.item,
        {
          flex: 1,
        },
        StyleSheet.absoluteFillObject,
        cardAnimatedStyle,
      ]}
    >
      {children}
    </Animated.View>
  );
}

type NotificationStackProps = {} & ViewProps;
export function NotificationStack({ style, ...rest }: NotificationStackProps) {
  const translateX = useSharedValue(0);

  const stack = useSharedValue(NOTIFICATIONS.map((_, index) => index));
  const topElement = useSharedValue(stack.value[stack.value.length - 1]);

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
    })
    .onEnd((e) => {
      if (
        Math.abs(e.translationX) > ITEM_SIZE / 3 ||
        Math.abs(e.velocityX) > 700
      ) {
        const temp = stack.value.filter((index) => index !== topElement.value);
        stack.value = [topElement.value, ...temp];
        translateX.value = withSpring(0, springConfig, () => {
          topElement.value = stack.value[stack.value.length - 1];
        });
      } else {
        translateX.value = withSpring(0, springConfig);
      }
    });

  return (
    <GestureDetector gesture={pan}>
      <View style={[styles.container, style]} {...rest}>
        {NOTIFICATIONS.map((_, index) => (
          <NotificationItem
            key={index}
            index={index}
            x={translateX}
            topElement={topElement}
            stack={stack}
          >
            {NOTIFICATIONS[index]}
          </NotificationItem>
        ))}
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
  },
  item: {
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
