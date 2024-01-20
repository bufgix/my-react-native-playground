import { StatusBar } from "expo-status-bar";
import { Button, ImageBackground, StyleSheet, View } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, { useState } from "react";
import { NotificationStack } from "./NotificationStack";
import { Order } from "./items/Order";
import { Spotify } from "./items/Spotify";
import { StopWatch } from "./items/StopWatch";

const notificationList = [StopWatch, Order, Spotify];

export function NotificationStackScreen() {
  const { bottom } = useSafeAreaInsets();

  const [notifications, setNotifications] = useState<typeof notificationList>(
    [],
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ImageBackground
        source={require("./bg.jpg")}
        style={{ flex: 1, alignItems: "center", justifyContent: "flex-end" }}
      >
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Button
            title="Add Notification"
            onPress={() => {
              setNotifications([
                ...notifications,
                notificationList[
                  notifications.length % notificationList.length
                ],
              ]);
            }}
          />
          <Button
            title="Remove Notification"
            onPress={() => {
              setNotifications(notifications.slice(0, -1));
            }}
          />
        </View>
        <NotificationStack style={{ marginBottom: bottom }}>
          {notifications.map((Notification, index) => (
            <Notification key={index} />
          ))}
        </NotificationStack>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});
