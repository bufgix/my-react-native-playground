import { AppleLoadingScreen } from "./components/AppleLoading/screen";
import { GaugeChartScreen } from "./components/GaugeChart/screen";
import { NotificationStackScreen } from "./components/NotificationStack/screen";
import { PasswordInputScreen } from "./components/PasswordInput/screen";
import { PhotoExtractorScreen } from "./components/PhotoExtractor/screen";
import { RulerTimePickerScreen } from "./components/RulerTimePicker/screen";
import { ScrollNumbersScreen } from "./components/ScrollNumbers/screen";
import { ScrollableGridScreen } from "./components/ScrollableGrid/screen";
import { SolerTimePickerScreen } from "./components/SolarTimePicker/screen";
import { TelegramProfileScreen } from "./components/TelegramProfile/screen";
import { TelegramStatusScreen } from "./components/TelegramStatus/screen";

export const ComponentScreenList = {
  SolarTimePicker: SolerTimePickerScreen,
  PasswordInput: PasswordInputScreen,
  ScrollNumbers: ScrollNumbersScreen,
  TelegramStatus: TelegramStatusScreen,
  RulerTimePicker: RulerTimePickerScreen,
  NotificationStack: NotificationStackScreen,
  PhotoExtractor: PhotoExtractorScreen,
  AppleLoading: AppleLoadingScreen,
  TelegramProfile: TelegramProfileScreen,
  GaugeChart: GaugeChartScreen,
  ScrollableGrid: ScrollableGridScreen,
};
