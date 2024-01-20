import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";
import { ViewProps } from "react-native";
import Animated, { AnimateProps } from "react-native-reanimated";

type Props = {
  svgProps?: SvgProps;
} & AnimateProps<ViewProps>;

const NEDDLE_SIZE = 34;

const Neddle = ({ svgProps, ...rest }: Props) => (
  <Animated.View {...rest}>
    <Svg width={NEDDLE_SIZE} height={NEDDLE_SIZE} fill="none" {...svgProps}>
      <Path
        d="M17.898 2.094 32.007 30.81a1 1 0 0 1-.898 1.441H2.891a1 1 0 0 1-.898-1.441l14.11-28.715a1 1 0 0 1 1.794 0Z"
        fill="#003441"
        stroke="#fff"
        strokeWidth={2.5}
      />
    </Svg>
  </Animated.View>
);

export { Neddle, NEDDLE_SIZE };
