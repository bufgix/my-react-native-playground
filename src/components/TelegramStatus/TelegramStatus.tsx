import { interpolate } from "@shopify/react-native-skia";
import React from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ImageProps,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewProps,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLayout } from "../../utils/useLayout";

const SCREEN_WIDTH = Dimensions.get("window").width;
const HEADER_BASE_HEIGHT = 150;
const HEADER_MAX_HEIGHT = 300;
const TOGGLE_THRESHOLD = 100;
const STORY_SIZE_MIN = 20;
const STORY_SIZE_MAX = 80;

const STORIES = [
  {
    name: "My Story",
    soruce: require("../../../assets/me.jpg"),
  },
  {
    name: "Telegram",
    soruce: require("../../../assets/telegram.png"),
  },
];

const TOTAL_STORIES = STORIES.length;
const STORY_CELL_SIZE = SCREEN_WIDTH / TOTAL_STORIES;

const data = Array.from({ length: 70 }).map((_, index) => ({
  id: index,
  name: `Item ${index}`,
}));

type StoryProps = {
  source: ImageSourcePropType;
  wrapperStyle?: ViewProps["style"];
  progress: Animated.SharedValue<number>;
  index: number;
  name: string;
} & ImageProps;
function Story({
  source,
  wrapperStyle,
  progress,
  index,
  name,
  ...rest
}: StoryProps) {
  const { x, onLayout } = useLayout();

  const targetX =
    STORY_CELL_SIZE * index + STORY_CELL_SIZE / 2 - STORY_SIZE_MAX / 2 - x;

  const storySize = useDerivedValue(() => {
    return interpolate(
      progress.value,
      [HEADER_BASE_HEIGHT + HEADER_BASE_HEIGHT / 2, HEADER_MAX_HEIGHT],
      [STORY_SIZE_MIN, STORY_SIZE_MAX],
      Extrapolate.CLAMP,
    );
  });

  const storyScale = useDerivedValue(() => {
    return interpolate(
      progress.value,
      [HEADER_MAX_HEIGHT, HEADER_MAX_HEIGHT + 50],
      [1, 1.2],
      Extrapolate.CLAMP,
    );
  });

  const storyOpacity = useDerivedValue(() => {
    if (index === TOTAL_STORIES - 1) {
      return 1;
    }
    return interpolate(
      progress.value,
      [HEADER_BASE_HEIGHT + 30, HEADER_MAX_HEIGHT],
      [0, 1],
      Extrapolate.CLAMP,
    );
  });

  const storyPosition = useDerivedValue(() => {
    const x = interpolate(
      progress.value,
      [HEADER_BASE_HEIGHT + 100, HEADER_MAX_HEIGHT - 20],
      [-30, targetX],
      Extrapolate.CLAMP,
    );

    const y = interpolate(
      progress.value,
      [HEADER_BASE_HEIGHT + 100, HEADER_MAX_HEIGHT - 20],
      [0, HEADER_BASE_HEIGHT / 2 - 30],
      Extrapolate.CLAMP,
    );

    return { x, y };
  });

  const storyAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: storySize.value,
      height: storySize.value,
      opacity: storyOpacity.value,
      transform: [
        {
          translateX: storyPosition.value.x,
        },
        {
          translateY: storyPosition.value.y,
        },
        {
          scale: storyScale.value,
        },
      ],
    };
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        progress.value,
        [HEADER_BASE_HEIGHT, HEADER_BASE_HEIGHT + 120, HEADER_MAX_HEIGHT],
        [0, 0, 1],
        Extrapolate.CLAMP,
      ),
    };
  });

  return (
    <Animated.View
      onLayout={onLayout}
      style={[
        wrapperStyle,
        {
          alignItems: "center",
        },
        storyAnimatedStyle,
      ]}
    >
      <Image
        source={source}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 100,
        }}
        {...rest}
      />
      <Animated.Text
        style={[
          {
            color: "white",
            marginTop: 5,
          },
          textAnimatedStyle,
        ]}
      >
        {name}
      </Animated.Text>
    </Animated.View>
  );
}

export function TelegramStatus() {
  const { top } = useSafeAreaInsets();

  const scrollY = useSharedValue(0);
  const shouldAnimateHeader = useSharedValue(false);
  const startHeaderHeight = useSharedValue(HEADER_BASE_HEIGHT);
  const headerHeight = useSharedValue(HEADER_BASE_HEIGHT);
  const headerToggle = useSharedValue(false);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY < 0) {
        headerHeight.value = Math.max(
          HEADER_BASE_HEIGHT,
          event.translationY + startHeaderHeight.value,
        );

        headerToggle.value = false;
        return;
      }
      if (!shouldAnimateHeader.value) {
        return;
      }

      scrollY.value = event.translationY;

      headerHeight.value = Math.max(
        HEADER_BASE_HEIGHT,
        scrollY.value + startHeaderHeight.value,
      );

      if (event.translationY > TOGGLE_THRESHOLD && !headerToggle.value) {
        headerToggle.value = true;
      }
    })
    .onEnd(() => {
      if (headerToggle.value) {
        headerHeight.value = withSpring(HEADER_MAX_HEIGHT, {
          damping: 20,
          stiffness: 150,
        });
        startHeaderHeight.value = HEADER_MAX_HEIGHT;
      } else {
        headerHeight.value = withSpring(HEADER_BASE_HEIGHT, {
          damping: 20,
          stiffness: 150,
        });
        startHeaderHeight.value = HEADER_BASE_HEIGHT;
      }
    });

  const nativeGesture = Gesture.Native();
  const composedGesture = Gesture.Simultaneous(panGesture, nativeGesture);

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: headerHeight.value,
    };
  }, []);

  const headerTextAnimatedStyle = useAnimatedStyle(() => {
    const textWidth = 50;
    return {
      transform: [
        {
          translateX: interpolate(
            headerHeight.value,
            [HEADER_BASE_HEIGHT, HEADER_MAX_HEIGHT],
            [
              SCREEN_WIDTH / 2 - textWidth / 2 + 20,
              SCREEN_WIDTH / 2 - textWidth / 2,
            ],
            Extrapolate.CLAMP,
          ),
        },
        {
          translateY: interpolate(
            headerHeight.value,
            [HEADER_BASE_HEIGHT, HEADER_MAX_HEIGHT],
            [0, -5],
            Extrapolate.CLAMP,
          ),
        },
      ],
    };
  });

  return (
    <View>
      <Animated.View
        style={[styles.header, { paddingTop: top }, headerAnimatedStyle]}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {STORIES.map((item, index) => (
            <Story
              key={index}
              progress={headerHeight}
              source={item.soruce}
              wrapperStyle={{ marginRight: -20 }}
              index={index}
              name={item.name}
            />
          ))}
          <Animated.Text
            style={[
              {
                position: "absolute",
                top: 0,
                left: 0,
                color: "white",
                fontWeight: "bold",
                fontSize: 16,
                alignSelf: "center",
              },
              headerTextAnimatedStyle,
            ]}
          >
            Chats
          </Animated.Text>
        </View>

        <TextInput
          accessibilityLabel="Text input field"
          placeholder="Search"
          placeholderTextColor={"#858185"}
          style={styles.textInput}
          textAlign="center"
        />
      </Animated.View>

      {/*  Messages */}
      <GestureDetector gesture={composedGesture}>
        <FlatList
          onStartReached={() => {
            shouldAnimateHeader.value = true;
          }}
          onScroll={(event) => {
            if (event.nativeEvent.contentOffset.y <= 100) {
              shouldAnimateHeader.value = true;
            } else {
              shouldAnimateHeader.value = false;
            }
          }}
          bounces={false}
          style={{ backgroundColor: "#020001" }}
          data={data}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={{ color: "white" }}>{item.name}</Text>
            </View>
          )}
        />
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#1f1b1f",
    height: HEADER_BASE_HEIGHT,
    justifyContent: "space-between",
    paddingBottom: 20,
  },
  textInput: {
    backgroundColor: "#141115",
    height: 40,
    borderRadius: 10,
    width: "90%",
    alignSelf: "center",
    color: "white",
  },
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});
