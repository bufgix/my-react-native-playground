import {
  Canvas,
  Fill,
  Circle,
  Group,
  interpolate,
  Extrapolate,
  useImage,
  Image as SkiaImage,
  DataSourceParam,
  SweepGradient,
  vec,
} from "@shopify/react-native-skia";
import React, { useEffect, useState } from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const APPS = [
  require("./icons/app_store.png"),
  require("./icons/music.png"),
  require("./icons/messages.png"),
  require("./icons/find_my.png"),
  require("./icons/photos.png"),
];

const SCREEN_WIDTH = Dimensions.get("window").width;
const IMAGE_SIZE = SCREEN_WIDTH * 0.4;
const FEATURE_MAX_SIZE = 50;

const polarToCartesian = (
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number,
) => {
  "worklet";
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};

const moveNearestCirclePoint = (
  featureDot: { x: number; y: number; size: number },
  circle: { x: number; y: number; size: number },
) => {
  "worklet";
  const radius = featureDot.size + circle.size;

  const pos = polarToCartesian(
    featureDot.x,
    featureDot.y,
    radius,
    (Math.atan2(circle.y - featureDot.y, circle.x - featureDot.x) * 180) /
      Math.PI +
      90,
  );

  return pos;
};

const LAYERS = [
  {
    dotSize: 10,
    dotCount: 20,
    dotDistance: IMAGE_SIZE / 2 + 75,
    initialRotation: 0,
    layerName: "one",
  },
  {
    dotSize: 7,
    dotCount: 20,
    dotDistance: IMAGE_SIZE / 2 + 55,
    initialRotation: 9,
    layerName: "two",
  },
  {
    dotSize: 8,
    dotCount: 20,
    dotDistance: IMAGE_SIZE / 2 + 40,
    initialRotation: 0,
    layerName: "three",
  },
  {
    dotSize: 6,
    dotCount: 20,
    dotDistance: IMAGE_SIZE / 2 + 20,
    initialRotation: 9,
    layerName: "four",
  },
];

const generateFeatureDot = (index: number) => {
  "worklet";
  const distance = LAYERS[0].dotDistance - LAYERS[0].dotSize;
  const angle = (360 / LAYERS[0].dotCount) * index;

  return { distance, angle };
};

const getAffectedDots = (featureDotIndex: number) => {
  "worklet";
  const safeGet = (index: number) => {
    if (index < 0) {
      return LAYERS[0].dotCount - 1;
    } else if (index > LAYERS[0].dotCount - 1) {
      return 0;
    } else {
      return index;
    }
  };
  return {
    one: [safeGet(featureDotIndex - 1), safeGet(featureDotIndex + 1)],
    two: [safeGet(featureDotIndex - 1), safeGet(featureDotIndex)],
    three: [
      safeGet(featureDotIndex - 1),
      safeGet(featureDotIndex),
      safeGet(featureDotIndex + 1),
    ],
    four: [safeGet(featureDotIndex - 1), safeGet(featureDotIndex)],
  };
};

type FeatureDotProps = {
  dot: Animated.SharedValue<{
    distance: number;
    angle: number;
  }>;
  size: Animated.SharedValue<number>;
  progress: Animated.SharedValue<number>;
  image: DataSourceParam;
};
function FeatureDot({
  size,
  dot,
  progress,
  image: imageSource,
}: FeatureDotProps) {
  const image = useImage(imageSource);

  const pos = useDerivedValue(() => {
    const rotation = dot.value.angle + progress.value;

    const pos = polarToCartesian(
      SCREEN_WIDTH / 2,
      SCREEN_WIDTH / 2,
      dot.value.distance,
      rotation,
    );

    return pos;
  });

  const imageX = useDerivedValue(() => {
    return pos.value.x - size.value;
  });

  const imageY = useDerivedValue(() => {
    return pos.value.y - size.value;
  });

  const imageSize = useDerivedValue(() => {
    return size.value * 2;
  });

  const roundedRect = useDerivedValue(() => {
    return {
      rect: {
        x: imageX.value,
        y: imageY.value,
        width: imageSize.value,
        height: imageSize.value,
      },
      rx: 9999,
      ry: 9999,
    };
  });

  return (
    <Group clip={roundedRect}>
      <SkiaImage
        image={image}
        x={imageX}
        y={imageY}
        width={imageSize}
        height={imageSize}
        fit={"fill"}
      />
    </Group>
  );
}

type DotProps = {
  index: number;
  size: number;
  distance: number;
  initialRotation: number;
  layerDotCount: number;
  layerName: "one" | "two" | "three" | "four";
  progress: Animated.SharedValue<number>;
  featureScaleMultiplier: Animated.SharedValue<number>;
  featureDotIndex: Animated.SharedValue<number>;
  featureDot: Animated.SharedValue<{
    distance: number;
    angle: number;
  }>;
};
function Dot({
  distance,
  size,
  initialRotation,
  layerDotCount,
  index,
  layerName,
  progress,
  featureScaleMultiplier,
  featureDotIndex,
  featureDot,
}: DotProps) {
  const pos = useDerivedValue(() => {
    const angle =
      (360 / layerDotCount) * index + initialRotation + progress.value;

    if (getAffectedDots(featureDotIndex.value)[layerName].includes(index)) {
      const featureDotPos = polarToCartesian(
        SCREEN_WIDTH / 2,
        SCREEN_WIDTH / 2,
        featureDot.value.distance,
        featureDot.value.angle + progress.value,
      );
      const dotPos = polarToCartesian(
        SCREEN_WIDTH / 2,
        SCREEN_WIDTH / 2,
        distance - size,
        angle,
      );

      const pos = moveNearestCirclePoint(
        {
          x: featureDotPos.x,
          y: featureDotPos.y,
          size: FEATURE_MAX_SIZE * featureScaleMultiplier.value,
        },
        {
          x: dotPos.x,
          y: dotPos.y,
          size: size,
        },
      );

      return {
        x: interpolate(
          featureScaleMultiplier.value,
          [0, 1],
          [dotPos.x, pos.x],
          Extrapolate.CLAMP,
        ),
        y: interpolate(
          featureScaleMultiplier.value,
          [0, 1],
          [dotPos.y, pos.y],
          Extrapolate.CLAMP,
        ),
        size: interpolate(featureScaleMultiplier.value, [1, 0], [5, size]),
      };
    } else {
      const pos = polarToCartesian(
        SCREEN_WIDTH / 2,
        SCREEN_WIDTH / 2,
        distance - size,
        angle,
      );

      return {
        ...pos,
        size: size,
      };
    }
  });

  const x = useDerivedValue(() => {
    return pos.value.x;
  });

  const y = useDerivedValue(() => {
    return pos.value.y;
  });

  const circleSize = useDerivedValue(() => {
    return pos.value.size;
  });

  return <Circle r={circleSize} cx={x} cy={y} />;
}

export function AppleLoading() {
  const t = useSharedValue(0);
  const featureScaleMultiplier = useSharedValue(1);
  const featureIndex = useSharedValue(0);
  const [image, setImage] = useState(APPS[0]);

  const featureDot = useDerivedValue(() => {
    return generateFeatureDot(featureIndex.value);
  });

  useEffect(() => {
    t.value = withRepeat(
      withTiming(360, { duration: 12000, easing: Easing.linear }),
      -1,
    );
    featureScaleMultiplier.value = withRepeat(
      withSequence(
        withDelay(
          100,
          withSpring(1, {
            damping: 50,
            stiffness: 100,
          }),
        ),
        withDelay(
          1000,
          withSpring(0, { damping: 50, stiffness: 100 }, () => {
            featureIndex.value = (featureIndex.value + 4) % LAYERS[0].dotCount;
            runOnJS(setImage)(APPS[featureIndex.value % APPS.length]);
          }),
        ),
      ),
      -1,
    );
  }, []);

  const featureSize = useDerivedValue(() => {
    return FEATURE_MAX_SIZE * featureScaleMultiplier.value;
  });

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        width: SCREEN_WIDTH,
        height: SCREEN_WIDTH,
      }}
    >
      <Canvas
        style={{
          position: "absolute",
          width: SCREEN_WIDTH,
          height: SCREEN_WIDTH,
        }}
      >
        <Fill color="white" />

        <Group
          origin={{
            x: SCREEN_WIDTH / 2,
            y: SCREEN_WIDTH / 2,
          }}
        >
          {LAYERS.map((layer) => {
            return Array.from({ length: layer.dotCount }, (_, i) => {
              return (
                <Dot
                  key={i}
                  index={i}
                  size={layer.dotSize}
                  distance={layer.dotDistance}
                  initialRotation={layer.initialRotation}
                  layerDotCount={layer.dotCount}
                  progress={t}
                  layerName={layer.layerName as any}
                  featureScaleMultiplier={featureScaleMultiplier}
                  featureDot={featureDot}
                  featureDotIndex={featureIndex}
                />
              );
            });
          })}
          <FeatureDot
            dot={featureDot}
            size={featureSize}
            progress={t}
            image={image}
          />

          <SweepGradient
            c={vec(SCREEN_WIDTH / 2, SCREEN_WIDTH / 2)}
            colors={[
              "#3c78c9",
              "#3cc9c9",
              "#78c936",
              "#c43b91",
              "#8141be",
              "#3c78c9",
            ]}
          />
        </Group>
      </Canvas>
      <Image
        source={require("../../../assets/me_again.jpeg")}
        style={styles.image}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 9999,
  },
});
