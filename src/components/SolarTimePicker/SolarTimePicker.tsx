import {
  Blur,
  Canvas,
  Circle,
  DashPathEffect,
  Group,
  LinearGradient,
  Path,
  SkPoint,
  Skia,
  vec,
} from "@shopify/react-native-skia";
import React from "react";
import { Dimensions, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import {
  Extrapolate,
  interpolate,
  interpolateColor,
  useDerivedValue,
  useSharedValue,
  convertToRGBA,
} from "react-native-reanimated";
import { ReText } from "react-native-redash";
import { curveLines, getPeek, getYForX } from "./Maths";

const SCREEN_WIDTH = Dimensions.get("window").width;

const width = SCREEN_WIDTH * 0.9;
const aspectRatio = 0.4;
const height = width * aspectRatio;
const cursorSize = 7;
const panStartBound = width * 0.1;
const panEndBound = width;
const gridRowLinesCount = 5;
const gridColLinesCount = 6;

const gridRowLines = Array.from({ length: gridRowLinesCount }).map((_, i) => {
  const path = Skia.Path.Make();
  path.moveTo(0, (i / (gridRowLinesCount - 1)) * height);
  path.lineTo(width, (i / (gridRowLinesCount - 1)) * height);

  return (
    <Path key={i} path={path} strokeWidth={0.5} style="stroke" color={"white"}>
      <LinearGradient
        start={vec(50, 50)}
        end={vec(width, height)}
        colors={["black", "#ccc", "black"]}
      />
      <DashPathEffect intervals={[4, 4]} />
    </Path>
  );
});

const gridColLines = Array.from({ length: gridColLinesCount }).map((_, i) => {
  const path = Skia.Path.Make();
  path.moveTo((i / (gridColLinesCount - 1)) * width, 0);
  path.lineTo((i / (gridColLinesCount - 1)) * width, height);

  return (
    <Path key={i} path={path} strokeWidth={0.5} style="stroke" color={"white"}>
      <LinearGradient
        start={vec(50, 50)}
        end={vec(width, height)}
        colors={["black", "#ccc", "black"]}
      />
      <DashPathEffect intervals={[4, 4]} />
    </Path>
  );
});

const sinusPaths: SkPoint[] = [];

const amplitude = height * 0.35; // Half of the height
const frequency = 1; // Adjust this value to change the number of oscillations
const phaseShift = Math.PI / 3; // Adjust this value to change the phase of the wave

// Calculate the vertical center of the height
const centerY = height / 2;

// Calculate points along the sine wave
const numPoints = 50; // Adjust this value to control the number of points
for (let i = 0; i < numPoints; i++) {
  const x = (i / (numPoints - 1)) * width;
  const y =
    centerY +
    amplitude * Math.sin((2 * Math.PI * frequency * x) / width + phaseShift);
  sinusPaths.push({ x, y });
}

const peek = getPeek(sinusPaths);
const path = curveLines(sinusPaths, 0.1, "complex");
const pathCommands = path.toCmds();

const startPosition = panStartBound + (panEndBound - panStartBound) * (7 / 24);

export function SolarTimePicker() {
  const startX = useSharedValue(startPosition);
  const x = useSharedValue(startPosition);

  const y = useDerivedValue(() => {
    return getYForX(pathCommands, x.value);
  }, []);

  const blurCircleRadius = useDerivedValue(() => {
    return interpolate(
      x.value,
      [panStartBound, peek.x, panEndBound],
      [0, height * 0.6, 0],
      Extrapolate.CLAMP,
    );
  });

  const blur = useDerivedValue(() => {
    return interpolate(
      x.value,
      [panStartBound, peek.x, panEndBound],
      [5, 50, 5],
      Extrapolate.CLAMP,
    );
  });

  const blurCircleColor = useDerivedValue(() => {
    return convertToRGBA(
      interpolateColor(
        x.value,
        [panStartBound, peek.x, panEndBound],
        ["#d4812b", "#f0d60f", "#d4812b"],
      ),
    );
  });

  const cursorBackOpacity = useDerivedValue(() => {
    return interpolate(
      x.value,
      [panStartBound, peek.x, panEndBound],
      [0, 1, 0],
      Extrapolate.CLAMP,
    );
  });

  const time = useDerivedValue(() => {
    const interval = (panEndBound - panStartBound) / 24;
    const hour = Math.round((x.value - panStartBound) / interval);
    let hourString = "";
    if (hour < 12) {
      hourString = `${hour}`;
    } else {
      if (hour === 12) {
        hourString = `${hour}`;
      } else {
        hourString = `${hour - 12}`;
      }
    }

    if (hourString.length === 1) {
      hourString = `0${hourString}`;
    }
    return `${hourString}:00`;
  });

  const timeAbbreviation = useDerivedValue(() => {
    //return "PM";
    const interval = (panEndBound - panStartBound) / 24;
    const hour = Math.round((x.value - panStartBound) / interval);
    if (hour < 12) {
      return "AM";
    }
    return "PM";
  });

  const dayTime = useDerivedValue(() => {
    const interval = (panEndBound - panStartBound) / 24;
    const hour = Math.round((x.value - panStartBound) / interval);

    if (hour < 6) {
      return "NIGHT";
    }
    if (hour < 12) {
      return "MORNING";
    }
    if (hour < 18) {
      return "AFTERNOON";
    }
    return "EVENING";
  });

  const gesture = Gesture.Pan()
    .onBegin(() => {})
    .onUpdate((e) => {
      const position = startX.value + e.translationX;
      if (position < panStartBound) {
        x.value = panStartBound;
        return;
      }
      if (position > panEndBound) {
        x.value = panEndBound;
        return;
      }

      x.value = position;
    })
    .onEnd(() => {
      startX.value = x.value;
    });

  return (
    <View
      style={{
        borderRadius: 10,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#777a74",
      }}
    >
      <GestureDetector gesture={gesture}>
        <Canvas
          style={{
            width,
            height,
            backgroundColor: "black",
          }}
        >
          <Group>
            <LinearGradient
              start={vec(50, 50)}
              end={vec(width, height)}
              colors={["black", "white", "black"]}
            />
            <Circle cx={x} cy={y} r={cursorSize} />
            <Path path={path} strokeWidth={2} style="stroke" />
            {gridRowLines}
            {gridColLines}
          </Group>

          {/* Blur */}
          <Circle
            cx={x}
            cy={y}
            r={blurCircleRadius}
            color={blurCircleColor}
            style="fill"
          >
            <Blur blur={blur} />
          </Circle>

          {/* Cursor Back */}
          <Circle
            cx={x}
            cy={y}
            r={cursorSize}
            color={"white"}
            opacity={cursorBackOpacity}
          />
        </Canvas>
      </GestureDetector>

      {/* Time */}
      <View style={{ position: "absolute", top: 10, left: 10 }}>
        <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
          <ReText
            style={{
              color: "white",
              fontSize: 20,
              fontWeight: "bold",
            }}
            text={time}
          />
          <ReText
            style={{ color: "white", marginLeft: 5, fontWeight: "bold" }}
            text={timeAbbreviation}
          />
        </View>
        <ReText
          style={{ color: "white", fontSize: 12, fontWeight: "bold" }}
          text={dayTime}
        />
      </View>
    </View>
  );
}
