import React from "react";
import { Dimensions, Text, View } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";

const SCREEN_WIDTH = Dimensions.get("screen").width;
const ITEM_SIZE = SCREEN_WIDTH * 0.6;
const NUMBERS = Array.from({ length: 50 }, (_, i) => i + 45);

type NumberProps = {
  index: number;
  number: number;
  scrollY: Animated.SharedValue<number>;
};
function Number({ number, scrollY, index }: NumberProps) {
  const opacity = useDerivedValue(() => {
    return interpolate(
      scrollY.value,
      [
        (index - 1) * ITEM_SIZE,
        index * ITEM_SIZE,
        (index + 1) * ITEM_SIZE - 30,
      ],
      [0, 1, 0],
      Extrapolate.CLAMP,
    );
  }, []);

  const translteY = useDerivedValue(() => {
    return interpolate(
      scrollY.value,
      [(index - 1) * ITEM_SIZE, index * ITEM_SIZE, (index + 1) * ITEM_SIZE],
      [-ITEM_SIZE / 2, 0, ITEM_SIZE / 2],
      Extrapolate.CLAMP,
    );
  });

  const rotateX = useDerivedValue(() => {
    return interpolate(
      scrollY.value,
      [(index - 1) * ITEM_SIZE, index * ITEM_SIZE, (index + 1) * ITEM_SIZE],
      [45, 0, -45],
      Extrapolate.CLAMP,
    );
  });

  const viewAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        {
          perspective: 300,
        },
        {
          translateY: translteY.value,
        },

        {
          rotateX: `${rotateX.value}deg`,
        },
      ],
    };
  }, []);

  return (
    <Animated.View
      key={number}
      style={[
        {
          width: ITEM_SIZE,
          height: ITEM_SIZE,
          justifyContent: "center",
          alignItems: "center",
        },
        viewAnimatedStyle,
      ]}
    >
      <Text
        style={{
          color: "white",
          fontSize: 150,
          fontWeight: "bold",
        }}
      >
        {number}
      </Text>
    </Animated.View>
  );
}

export function ScrollNumbers() {
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  return (
    <View
      style={{
        width: ITEM_SIZE,
        height: ITEM_SIZE,
      }}
    >
      <Animated.ScrollView
        onScroll={scrollHandler}
        snapToInterval={ITEM_SIZE}
        scrollEventThrottle={16}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
      >
        {NUMBERS.map((number, index) => {
          return (
            <Number
              index={index}
              key={number}
              number={number}
              scrollY={scrollY}
            />
          );
        })}
      </Animated.ScrollView>
    </View>
  );
}
