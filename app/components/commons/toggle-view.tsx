import { useUserPreferenceContext } from "@/app/context/user-preference-context";
import { plataformLanguages } from "@/app/models/user-preference";
import { ReactNode, useState } from "react";
import { Pressable, Text, View } from "react-native";

export function ToggleView({ children }: { children: ReactNode }) {
  const { userLanguage } = useUserPreferenceContext();
  const [toggle, setToggle] = useState(false);
  return (
    <View>
      {!toggle && (
        <Pressable
          onPress={() => {
            setToggle(true);
          }}
        >
          <Text>{plataformLanguages.openToggleView[userLanguage]}</Text>
        </Pressable>
      )}
      {toggle && (
        <>
          <Pressable
            onPress={() => {
              setToggle(false);
            }}
          >
            <Text>{plataformLanguages.closeToggleView[userLanguage]}</Text>
          </Pressable>
          {children}
        </>
      )}
    </View>
  );
}
