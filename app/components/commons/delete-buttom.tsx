import { Feather } from "@expo/vector-icons";
import { Pressable } from "react-native";

export function DeleteButton({ onPress }: { onPress: () => void }) {
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
      <Feather style={{}} name="trash" size={18} color="#cc0000" />
    </Pressable>
  );
}
