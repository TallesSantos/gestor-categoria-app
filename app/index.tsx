import React from "react";
import { View } from "react-native";
import Page from "./components/screen";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 30,
      }}
    >
      <Page />
    </View>
  );
}
