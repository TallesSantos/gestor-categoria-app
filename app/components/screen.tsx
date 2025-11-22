import { Feather } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import { useAppVariablesContext } from "../context/app-variables-context";
import { SectionContent } from "./section-content";
import { SectionMenu } from "./section-menu";

export default function Page() {
  const { setRefresh, categoryMenuVisible, setCategoryMenuVisible } =
    useAppVariablesContext();

  return (
    <View style={{ flexDirection: "row", flex: 1 }}>
      {categoryMenuVisible && <SectionMenu />}

      <Pressable
        style={{
          padding: 2,
          backgroundColor: "#CCC",
          borderRightColor: "black",
          borderRightWidth: 1,
          borderLeftColor: "black",
          borderLeftWidth: 1,
          marginBottom: 50,
        }}
        onPress={() => {
          setCategoryMenuVisible((prev) => (prev === true ? false : true));
          setRefresh((prev) => prev++);
        }}
      >
        <Feather
          name={categoryMenuVisible ? "arrow-left" : "arrow-right"}
          size={18}
          color="green"
        />
      </Pressable>

      <SectionContent />
    </View>
  );
}
