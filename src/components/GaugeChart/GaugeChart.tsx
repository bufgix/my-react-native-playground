import React, { useEffect, useImperativeHandle } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Path, Svg } from "react-native-svg";
import {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { Neddle, NEDDLE_SIZE } from "./Neddle";

import { polarToCartesian, segmentPath } from "./math";

export const SIZE = Dimensions.get("window").width;
const GAP = 10;
const RADIUS = SIZE / 2 - GAP;
const STROKE_WIDTH = 60;

type GaugeItem = {
  color: string;
  value: number;
};

type Props = {
  values: GaugeItem[];
  value: number;
};

export type GaugeChartHandle = {
  reRunAnimation: () => void;
};

export const GaugeChart = React.forwardRef<GaugeChartHandle, Props>(
  ({ values, value }, ref) => {
    const total = values.reduce((acc, item) => acc + item.value, 0);
    const animatedDegree = useSharedValue(-90);

    useImperativeHandle(ref, () => ({
      reRunAnimation: () => {
        animatedDegree.value = withSequence(
          withTiming(-90, { duration: 0 }),
          withTiming(((value / total) * 180 - 90) % 360, {
            duration: 1000,
          }),
        );
      },
    }));

    useEffect(() => {
      animatedDegree.value = withTiming(((value / total) * 180 - 90) % 360, {
        duration: 1000,
      });
    }, [animatedDegree, total, value]);

    const segment = (n: number) => {
      const center = SIZE / 2;
      const degree = (values[n].value / total) * 180;

      const start =
        n === 0
          ? 0
          : values
              .slice(0, n)
              .reduce((acc, item) => acc + (item.value / total) * 180, 0);
      const end = start + degree;

      const path = segmentPath(
        center,
        center,
        RADIUS,
        RADIUS - STROKE_WIDTH,
        start,
        end,
      );

      const fill = values[n].color;
      return <Path key={n} d={path} fill={fill} />;
    };

    const animatedNeddleStyle = useAnimatedStyle(() => {
      const center = SIZE / 2;
      // needle rotation degree
      const [x, y] = polarToCartesian(
        center,
        center,
        RADIUS - STROKE_WIDTH / 2 - 30,
        animatedDegree.value,
      );

      return {
        transform: [
          { translateX: x - NEDDLE_SIZE / 2 },
          { translateY: y - NEDDLE_SIZE / 2 },
          {
            rotate: `${animatedDegree.value}deg`,
          },
        ],
      };
    });

    return (
      <View style={styles.container}>
        <Svg width={SIZE} height={SIZE / 2}>
          {values.map((item, i) => segment(i))}
          <Neddle
            style={[
              { width: NEDDLE_SIZE, height: NEDDLE_SIZE },
              animatedNeddleStyle,
            ]}
          />
        </Svg>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
});
