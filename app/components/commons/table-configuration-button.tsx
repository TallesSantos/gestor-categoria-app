import { Feather } from "@expo/vector-icons";
import { Pressable } from "react-native";

export function ConfigButton({ onPress }: { onPress: () => void }) {
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
      <Feather style={{}} name="settings" size={18} color="gray" />
    </Pressable>
  );
}
