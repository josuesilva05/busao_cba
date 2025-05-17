import { View } from "react-native";
import "../../global.css";
import HomeScreen from "../screens/HomeScreen";
export const options = { headerShown: false };

export default function Page() {
  return (
    <View className="flex-1">
      <HomeScreen />
    </View>
  )
}