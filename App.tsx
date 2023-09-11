import { GestureHandlerRootView } from "react-native-gesture-handler";
import { RootStackNavigation } from "./src/navigation";
import { NavigationContainer } from "@react-navigation/native";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <RootStackNavigation />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
