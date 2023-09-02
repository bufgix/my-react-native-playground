import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParams } from "../../navigation";

export const useAppNavigation = () => {
  return useNavigation<NavigationProp<RootStackParams>>();
};
