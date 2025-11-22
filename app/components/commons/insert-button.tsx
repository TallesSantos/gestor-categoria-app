import { Feather } from "@expo/vector-icons";
import { Pressable, PressableProps, Text } from "react-native";

interface InsertButtonProp extends PressableProps {
  onPress: () => void;
}

export function InsertButton({ onPress }: InsertButtonProp) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        padding: 6,
        borderRadius: 6,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Insert</Text>
      <Feather style={{}} name="arrow-up" size={18} color="green" />
    </Pressable>
  );
}
