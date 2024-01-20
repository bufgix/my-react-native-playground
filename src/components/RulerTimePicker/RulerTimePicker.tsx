import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback } from "react";
import { Dimensions, ListRenderItem, Text, View } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";

const SCREEN_WIDTH = Dimensions.get("window").width;
const PICKER_WIDTH = SCREEN_WIDTH * 0.8;
const PICKER_HEIGHT = 200;
const HOURS = [...Array(24)].map((_, i) => i);
const MINUTES = [...Array(60)].map((_, i) => i);
const NUMBER_HEIGHT = PICKER_HEIGHT / 3;
const NUMBER_TEXT_MAX_SCALE = 2;

const Ruler = ({ position }: { position: "left" | "right" }) => {
  return (
    <View
      style={[
        {
          position: "absolute",
          [position]: 0,
        },
        position === "right" && {
          transform: [{ rotate: "180deg" }],
        },
      ]}
    >
      {[...Array(40)].map((_, i) => {
        return (
          <View
            key={i}
            style={[
              {
                width: i % 4 === 0 ? 20 : 10,
                height: 1,
                marginVertical: 3,
                backgroundColor: "black",
              },
            ]}
          />
        );
      })}
    </View>
  );
};

type NumberProps = {
  value: number;
  y: Animated.SharedValue<number>;
};
function Number({ value, y }: NumberProps) {
  const label = value.toString().padStart(2, "0");

  const textScale = useDerivedValue(() => {
    const minInput = (value - 1) * NUMBER_HEIGHT;
    const maxInput = (value + 1) * NUMBER_HEIGHT;
    if (y.value >= minInput || y.value <= maxInput) {
      return interpolate(
        y.value,
        [minInput, value * NUMBER_HEIGHT, maxInput],
        [1, NUMBER_TEXT_MAX_SCALE, 1],
        Extrapolate.CLAMP,
      );
    }

    return 1;
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: textScale.value,
        },
      ],
    };
  });

  return (
    <View
      style={{
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        height: NUMBER_HEIGHT,
      }}
    >
      <Animated.View style={textAnimatedStyle}>
        <Text
          style={[
            {
              fontSize: 24,
              fontWeight: "bold",
            },
          ]}
        >
          {label}
        </Text>
      </Animated.View>
    </View>
  );
}

type RulerTimePickerProps = {
  initialHour?: number;
  initialMinute?: number;
  onChange?: (hour: number, minute: number) => void;
};
function _RulerTimePicker({
  initialHour = 0,
  initialMinute = 0,
  onChange,
}: RulerTimePickerProps) {
  const hourY = useSharedValue(initialHour * NUMBER_HEIGHT);
  const minuteY = useSharedValue(initialMinute * NUMBER_HEIGHT);

  const onMomentScrollEnd = useCallback(() => {
    if (onChange) {
      const hour = Math.round(hourY.value / NUMBER_HEIGHT);
      const minute = Math.round(minuteY.value / NUMBER_HEIGHT);

      onChange(hour, minute);
    }
  }, []);

  const onHourScroll = useAnimatedScrollHandler((event) => {
    hourY.value = event.contentOffset.y;
  });

  const onMinuteScroll = useAnimatedScrollHandler((event) => {
    minuteY.value = event.contentOffset.y;
  });

  const renderHour: ListRenderItem<number> = ({ item }) => {
    return <Number y={hourY} value={item} />;
  };

  const renderMinute: ListRenderItem<number> = ({ item }) => {
    return <Number y={minuteY} value={item} />;
  };

  return (
    <View
      style={{
        width: PICKER_WIDTH,
        height: PICKER_HEIGHT,
        backgroundColor: "#f6f9fd",
        borderRadius: 10,
        overflow: "hidden",
        justifyContent: "center",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Ruler position="left" />
      <Ruler position="right" />

      <Animated.FlatList
        data={HOURS}
        contentContainerStyle={{
          paddingVertical: NUMBER_HEIGHT,
        }}
        getItemLayout={(_, index) => {
          return {
            length: NUMBER_HEIGHT,
            offset: NUMBER_HEIGHT * index,
            index,
          };
        }}
        onMomentumScrollEnd={onMomentScrollEnd}
        initialScrollIndex={initialHour}
        snapToOffsets={HOURS.map((_, i) => i * NUMBER_HEIGHT)}
        onScroll={onHourScroll}
        keyExtractor={(item) => item.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={renderHour}
        scrollEventThrottle={16}
      />
      <Text
        style={{
          fontSize: 52,
          fontWeight: "bold",
          color: "#9298d2",
        }}
      >
        :
      </Text>
      <Animated.FlatList
        data={MINUTES}
        contentContainerStyle={{
          paddingVertical: NUMBER_HEIGHT,
        }}
        getItemLayout={(_, index) => {
          return {
            length: NUMBER_HEIGHT,
            offset: NUMBER_HEIGHT * index,
            index,
          };
        }}
        onMomentumScrollEnd={onMomentScrollEnd}
        initialScrollIndex={initialMinute}
        snapToOffsets={MINUTES.map((_, i) => i * NUMBER_HEIGHT)}
        onScroll={onMinuteScroll}
        keyExtractor={(item) => item.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={renderMinute}
        scrollEventThrottle={16}
      />
      <LinearGradient
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
        colors={[
          "#f6f9fd",
          "rgba(255,255,255,0)",
          "rgba(255,255,255,0)",
          "#f6f9fd",
        ]}
        locations={[0.1, 0.5, 0.6, 0.9]}
        pointerEvents="none"
      />
    </View>
  );
}

export const RulerTimePicker = React.memo(_RulerTimePicker);
