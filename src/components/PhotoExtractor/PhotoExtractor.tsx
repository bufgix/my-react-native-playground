import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { Audio } from "expo-av";
import {
  Canvas,
  Fill,
  Group,
  RoundedRect,
  SkRect,
  rect,
  useImage,
  Image,
  useValue,
  runTiming,
  useComputedValue,
  Vector,
  vec,
  SkiaValue,
  Easing,
  mix,
  runSpring,
  Vertices,
  ImageShader,
  useClockValue,
  Shadow,
  LinearGradient,
  Rect,
  Extrapolate,
} from "@shopify/react-native-skia";
import { createNoise2D, createNoise3D } from "simplex-noise";

import { Dimensions } from "react-native";
import { interpolate } from "react-native-reanimated";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

export const calculateSizeWithAspectRatio = (ratio: number) => {
  if (ratio < 1) {
    const height = SCREEN_HEIGHT * 0.6;
    const width = height * ratio;
    return {
      width,
      height,
    };
  } else {
    //(ratio >= 1)
    const width = SCREEN_WIDTH * 0.8;
    const height = width / ratio;
    return {
      width,
      height,
    };
  }
};

const SOUND_PAPER = require("./sounds/paper.mp3");
const SOUND_STAMP = require("./sounds/stamp.mp3");
const SOUND_SHEDDER = require("./sounds/shedder.mp3");

const SOUNDS = {
  paper: SOUND_PAPER,
  stamp: SOUND_STAMP,
  shedder: SOUND_SHEDDER,
};

const deflate = (rct: SkRect, amount: number) => {
  return rect(
    rct.x + amount,
    rct.y + amount,
    rct.width - amount * 2,
    rct.height - amount * 2,
  );
};

const generateTrianglePointsAndIndices = (
  rct: SkRect,
  triangleNumberHeight: number,
  z: number,
) => {
  const A = 5;
  const F = 1;
  const noise = createNoise3D();

  const vertices: Vector[] = [];
  const textures: Vector[] = [];
  const indices: number[] = [];

  // Calculate the size of the triangles based on the given number
  const triangleWidth = rct.width;
  const triangleHeight = rct.height / triangleNumberHeight;

  // Generate the list of points
  for (let i = 0; i <= triangleNumberHeight; i++) {
    for (let j = 0; j <= 1; j++) {
      const point: Vector = vec(
        rct.x + j * triangleWidth,
        rct.y + i * triangleHeight,
      );
      textures.push(point);
      const d = A * noise((F * i) / triangleNumberHeight, F * j, z);
      vertices.push(vec(point.x + d, point.y + d));
    }
  }

  // Generate the list of triangle indices
  for (let i = 0; i < triangleNumberHeight; i++) {
    const topLeftIndex = i * 2;
    const topRightIndex = topLeftIndex + 1;
    const bottomLeftIndex = topLeftIndex + 2;
    const bottomRightIndex = bottomLeftIndex + 1;

    // Create two triangles for each square and add their indices to the list
    indices.push(topLeftIndex, topRightIndex, bottomLeftIndex);
    indices.push(bottomLeftIndex, topRightIndex, bottomRightIndex);
  }

  return { vertices, indices, textures };
};

const deflateX = (rct: SkRect, amount: number) => {
  return rect(rct.x + amount, rct.y, rct.width - amount * 2, rct.height);
};

const LINE_HEIGHT = 20;
const EXTRA_DISTANCE = 70;
const NUMBER_OF_STRIPE = 10;

interface StripeProps {
  index: number;
  clock: SkiaValue<number>;
  a: SkiaValue<number>;
  i0: SkiaValue<number>;
  i: SkiaValue<number>;
  stripeWidth: number;
  imageHeight: number;
}

const Stripe = ({
  index,
  clock,
  a,
  i0,
  i,
  stripeWidth,
  imageHeight,
}: StripeProps) => {
  const animation = useValue(0);
  const noise = createNoise2D();
  const x = index * stripeWidth;
  const rct = rect(x, 0, stripeWidth - 10, imageHeight);
  const { vertices, indices, textures } = generateTrianglePointsAndIndices(
    rct,
    20,
    index / NUMBER_OF_STRIPE,
  );
  const animatedVertices = useComputedValue(() => {
    if (i0.current === index && i.current !== index) {
      runTiming(animation, 1, { duration: 100, easing: Easing.linear }, () => {
        runSpring(animation, 0);
      });
    }
    const time = clock.current * 0.0004;
    const f = mix(animation.current, 1, 2);
    return vertices.map((v, j) => {
      const d = (a.current + animation.current * 8) * noise(time * f, j);
      return vec(v.x + d, v.y + d);
    });
  }, [clock]);

  return (
    <Vertices
      vertices={animatedVertices}
      textures={textures}
      indices={indices}
    />
  );
};

export type PhotoExtractorHandle = {
  extract: (cb?: () => void) => void;
  destroy: (cb?: () => void) => void;
};

type Props = {
  image: string;
  onExtractComplete?: () => void;
  aspectRatio: number;
};

const _PhotoExtractor = forwardRef<PhotoExtractorHandle, Props>(
  ({ image, onExtractComplete, aspectRatio }, ref) => {
    const { width: IMAGE_WIDTH, height: IMAGE_HEIGHT } =
      calculateSizeWithAspectRatio(aspectRatio);

    const STRIPE_WIDTH = IMAGE_WIDTH / NUMBER_OF_STRIPE;
    const STRIPES = Array.from({ length: NUMBER_OF_STRIPE }).map((_, i) => i);

    const lineRectOut = deflateX(rect(0, 0, SCREEN_WIDTH, LINE_HEIGHT), 10);
    const lineRectIn = deflate(lineRectOut, 7);

    const IMAGE_START_Y = LINE_HEIGHT / 2 - IMAGE_HEIGHT;

    const DELETE_START_Y = LINE_HEIGHT / 2 + IMAGE_HEIGHT + EXTRA_DISTANCE + 30;

    // center the image
    const imageRect = rect(
      (SCREEN_WIDTH - IMAGE_WIDTH) / 2,
      IMAGE_START_Y,
      IMAGE_WIDTH,
      IMAGE_HEIGHT,
    );

    const imageBorderRect = rect(
      imageRect.x - 10,
      imageRect.y - 10,
      imageRect.width + 20,
      imageRect.height + 20,
    );

    const y = useValue(-10);
    const lineY = useValue(0);
    const sound = useRef<Audio.Sound | null>(null);

    const clock = useClockValue();
    const i = useValue(-1);
    const i0 = useValue(-1);
    const a = useValue(2);

    const skiaImage = useImage(image);

    const playSound = async (
      type: keyof typeof SOUNDS = "stamp",
      delay: number = 1000,
    ) => {
      const { sound: s } = await Audio.Sound.createAsync(SOUNDS[type]);
      sound.current = s;
      setTimeout(() => {
        void sound.current?.playAsync();
      }, delay);
    };

    useEffect(() => {
      return () => {
        void sound.current?.unloadAsync();
      };
    }, []);

    useEffect(() => {
      runSpring(y, 0, { mass: 0.5 });
    }, [y]);

    const extract = useCallback(
      (cb?: () => void) => {
        const maxDistance = IMAGE_HEIGHT + EXTRA_DISTANCE;
        void playSound("paper", 0);
        runSpring(
          y,
          maxDistance * 0.3,
          {
            mass: 0.5,
          },
          () => {
            void playSound("stamp", 0);
            runSpring(
              y,
              maxDistance,
              {
                mass: 0.5,
              },
              () => {
                onExtractComplete?.();
                cb?.();
              },
            );
          },
        );
      },
      [IMAGE_HEIGHT, onExtractComplete, y],
    );

    const destroyImage = useCallback(
      (cb?: () => void) => {
        runSpring(
          lineY,
          IMAGE_HEIGHT + EXTRA_DISTANCE + 30,
          {
            mass: 0.5,
            damping: 100,
          },
          () => {
            void playSound("shedder", 0);
            runTiming(
              y,
              IMAGE_HEIGHT + EXTRA_DISTANCE + IMAGE_HEIGHT + 50,
              {
                duration: 800,
              },
              () => {
                runTiming(
                  y,
                  SCREEN_HEIGHT + IMAGE_HEIGHT,
                  { duration: 800 },
                  () => {
                    runSpring(lineY, 0, { mass: 0.5, damping: 100 }, () => {
                      cb?.();
                      y.current = -10;
                      runSpring(y, 0, {
                        mass: 0.5,
                      });
                    });
                  },
                );
                runTiming(a, 10, { duration: 200 });
              },
            );
          },
        );
      },
      [IMAGE_HEIGHT, a, lineY, y],
    );

    const transform = useComputedValue(() => [{ translateY: y.current }], [y]);
    const transformLine = useComputedValue(
      () => [{ translateY: lineY.current }],
      [lineY],
    );

    const gradientHeight = useComputedValue(() => {
      const maxDistance = IMAGE_HEIGHT + EXTRA_DISTANCE;

      return interpolate(
        y.current,
        [0, EXTRA_DISTANCE, IMAGE_HEIGHT, maxDistance],
        [0, 40, 20, 0],
        Extrapolate.CLAMP,
      );
    }, [y]);

    useImperativeHandle(ref, () => ({
      extract,
      destroy: destroyImage,
    }));

    return (
      <>
        <Canvas style={{ flex: 1 }}>
          <Fill color="transparent" />

          {/* Cropped Image */}
          {skiaImage && (
            <Group transform={transform}>
              <Group
                transform={[
                  { translateX: imageRect.x },
                  { translateY: imageRect.y },
                ]}
              >
                <ImageShader
                  image={skiaImage}
                  rect={rect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT)}
                  fit="fill"
                />
                {STRIPES.map((index) => (
                  <Stripe
                    key={index}
                    index={index}
                    clock={clock}
                    a={a}
                    i0={i0}
                    i={i}
                    imageHeight={IMAGE_HEIGHT}
                    stripeWidth={STRIPE_WIDTH}
                  />
                ))}
              </Group>
            </Group>
          )}

          {/* Line */}
          <Group transform={transformLine}>
            <RoundedRect {...lineRectOut} color={"#FFDEE3"} r={10} />
            <RoundedRect {...lineRectIn} color={"#650A31"} r={10} />
          </Group>

          {/* Image */}
          <Group
            clip={rect(
              0,
              LINE_HEIGHT / 2,
              SCREEN_WIDTH,
              DELETE_START_Y - LINE_HEIGHT / 2,
            )}
          >
            {skiaImage && (
              <Group transform={transform}>
                <RoundedRect {...imageBorderRect} color="white" r={10} />
                <Shadow dx={0} dy={0} blur={5} color="rgba(0, 0, 0, 0.2)" />
                <Image image={skiaImage} rect={imageRect} fit="cover" />
              </Group>
            )}
            <Rect
              x={imageBorderRect.x}
              y={0}
              width={imageBorderRect.width}
              height={gradientHeight}
            >
              <LinearGradient
                start={vec(0, 0)}
                end={vec(0, 30)}
                colors={["black", "transparent"]}
              />
            </Rect>
          </Group>
        </Canvas>
      </>
    );
  },
);

export const PhotoExtractor = React.memo(_PhotoExtractor);
