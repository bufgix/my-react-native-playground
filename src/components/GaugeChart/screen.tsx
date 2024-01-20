import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useRef, useState } from "react";
import { GaugeChart, GaugeChartHandle } from "./GaugeChart";

const BMI_MIN = 15;
const BMI_MAX = 42;

const BMI_SEGMENTS = [
  {
    color: "#4D80E4",
    value: 16.0 - BMI_MIN,
    name: "Underweight",
  },
  {
    color: "#46B3E6",
    value: 17.0 - 16.0,
    name: "Normal",
  },
  {
    color: "#AABE34",
    value: 18.5 - 17.0,
    name: "Healthy",
  },
  {
    color: "#77C565",
    value: 25.0 - 18.5,
    name: "Overweight",
  },
  {
    color: "#FCA400",
    value: 30 - 25.0,
    name: "Obese Class I",
  },
  {
    color: "#FF743A",
    value: 35.0 - 30.0,
    name: "Obese Class II",
  },
  {
    color: "#FE5553",
    value: 40.0 - 35.0,
    name: "Obese Class III",
  },
  {
    color: "#ED3C6A",
    value: BMI_MAX - 40.0,
    name: "Extreme Obesity",
  },
];

export const findTargetSegmentByValue = (value: number) => {
  return BMI_SEGMENTS.find((segment) => {
    const segmentMin =
      BMI_MIN +
      BMI_SEGMENTS.slice(0, BMI_SEGMENTS.indexOf(segment)).reduce(
        (acc, item) => acc + item.value,
        0,
      );
    const segmentMax =
      BMI_SEGMENTS.indexOf(segment) === BMI_SEGMENTS.length - 1
        ? BMI_MAX
        : segmentMin + segment.value;
    return value >= segmentMin && value <= segmentMax;
  });
};

const TOTAL_BMI_RANGE = BMI_SEGMENTS.reduce((acc, item) => acc + item.value, 0);

export function GaugeChartScreen() {
  const [bmi, setBmi] = useState(25.4);
  const neddleValue = (TOTAL_BMI_RANGE * (bmi - BMI_MIN)) / (BMI_MAX - BMI_MIN);
  const chartRef = useRef<GaugeChartHandle>(null);

  const targetSegment = findTargetSegmentByValue(bmi);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        <GaugeChart ref={chartRef} values={BMI_SEGMENTS} value={neddleValue} />

        <Text style={[styles.text, { color: targetSegment?.color }]}>
          {bmi.toFixed(1)}
        </Text>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: targetSegment?.color,
            marginTop: 5,
          }}
        >
          {targetSegment?.name}
        </Text>
        <TouchableOpacity
          accessibilityRole="button"
          style={styles.button}
          onPress={() => {
            setBmi(Math.random() * (BMI_MAX - BMI_MIN) + BMI_MIN);
          }}
        >
          <Text>Change value</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    marginTop: 20,
  },
  text: {
    marginTop: -40,
    fontSize: 40,
    fontWeight: "bold",
    lineHeight: 40,
  },
});
