import { useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { PhotoExtractor, PhotoExtractorHandle } from "./PhotoExtractor";

export function PhotoExtractorScreen() {
  const [isExtracted, setIsExtracted] = useState(false);
  const extractorRef = useRef<PhotoExtractorHandle>(null);
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={{ flex: 1, marginTop: 50 }}>
        <PhotoExtractor
          ref={extractorRef}
          aspectRatio={1}
          image={require("./Photo.png")}
        />
        <View
          style={{
            flexDirection: "row",
            alignSelf: "center",
            marginBottom: 50,
            gap: 30,
          }}
        >
          <TouchableOpacity
            accessibilityRole="button"
            disabled={isExtracted}
            style={{
              padding: 10,
              backgroundColor: "#650A31",
              borderRadius: 10,
            }}
            onPress={() => {
              extractorRef.current?.extract(() => {
                setIsExtracted(true);
              });
            }}
          >
            <Text style={{ color: "white" }}>Extract</Text>
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityRole="button"
            disabled={!isExtracted}
            style={{
              padding: 10,
              backgroundColor: "#650A31",
              borderRadius: 10,
            }}
            onPress={() => {
              extractorRef.current?.destroy(() => {
                setIsExtracted(false);
              });
            }}
          >
            <Text style={{ color: "white" }}>Destroy</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});
