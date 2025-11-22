import { useUserPreferenceContext } from "@/app/context/user-preference-context";
import {
  plataformLanguages,
  UserPreferences,
} from "@/app/models/user-preference";

import { useCategoryDb } from "@/db/use-category-database";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";

type FormProps = {
  setVisble: (value: boolean) => void;
  visible: boolean;
  setRefresh: (i: number) => void;
};

export function ConfigModalForm({ visible, setVisble, setRefresh }: FormProps) {
  const { loadUserPreferences, updateUserPreferences } = useCategoryDb();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const { userLanguage, setUserLanguage } = useUserPreferenceContext();
  const [selectedLanguage, setSelectedLanguage] = useState(userLanguage);

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setErrorMessage("");
    }, 1000);
  });

  async function load() {
    const response = await loadUserPreferences();
    setPreferences(response);
  }

  async function submitForm() {
    await updateUserPreferences(preferences!);
    setUserLanguage(selectedLanguage);
    setRefresh(Date.now());
    setVisble(false);
  }

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.4)",
        }}
      >
        <View
          style={{
            width: 280,
            backgroundColor: "#fff",
            padding: 20,
            borderRadius: 10,
          }}
        >
          <Picker
            selectedValue={selectedLanguage}
            onValueChange={(value) => setSelectedLanguage(value)}
          >
            <Picker.Item label="Selecione uma opção" value="eng" />
            <Picker.Item label="English" value="eng" />
            <Picker.Item label="Português" value="br" />
          </Picker>
          <Text>{plataformLanguages.editPreferenceTitle[userLanguage]}</Text>
          {errorMessage ? (
            <Text style={{ color: "red" }}>{errorMessage}</Text>
          ) : null}

          <View style={{ display: "flex" }}>
            <Text>{plataformLanguages.MinHeigth[userLanguage]}</Text>

            <TextInput
              placeholder="ex: 60"
              value={preferences?.column_min_heigth.toString() || ""}
              onChangeText={(e) => {
                setPreferences((prev) =>
                  prev ? { ...prev, column_min_heigth: Number(e) } : null
                );
              }}
              style={{ borderWidth: 1, padding: 8 }}
            />
          </View>

          <View style={{ display: "flex" }}>
            <Text>{plataformLanguages.width[userLanguage]}:</Text>
            <TextInput
              placeholder="ex: 60"
              value={preferences?.column_min_width.toString() || ""}
              onChangeText={(e) => {
                setPreferences((prev) =>
                  prev ? { ...prev, column_min_width: Number(e) } : null
                );
              }}
              style={{ borderWidth: 1, padding: 8 }}
            />
          </View>

          <View style={{ display: "flex" }}>
            <Text>{plataformLanguages.primaryColorHeader[userLanguage]}:</Text>
            <TextInput
              placeholder="ex: #FFF"
              value={preferences?.primary_color_header.toString() || ""}
              onChangeText={(e) => {
                setPreferences((prev) =>
                  prev ? { ...prev, primary_color_header: String(e) } : null
                );
              }}
              style={{ borderWidth: 1, padding: 8 }}
            />
          </View>

          <View style={{ display: "flex" }}>
            <Text>
              {plataformLanguages.secondaryColorHeader[userLanguage]}:
            </Text>
            <TextInput
              placeholder="ex: #CCC"
              value={preferences?.secondary_color_header.toString() || ""}
              onChangeText={(e) => {
                setPreferences((prev) =>
                  prev ? { ...prev, secondary_color_header: String(e) } : null
                );
              }}
              style={{ borderWidth: 1, padding: 8 }}
            />
          </View>

          <View style={{ display: "flex" }}>
            <Text>{plataformLanguages.primaryColor[userLanguage]}:</Text>
            <TextInput
              placeholder="ex: #CCC"
              value={preferences?.primary_color.toString() || ""}
              onChangeText={(e) => {
                setPreferences((prev) =>
                  prev ? { ...prev, primary_color: String(e) } : null
                );
              }}
              style={{ borderWidth: 1, padding: 8 }}
            />
          </View>

          <View
            style={{
              marginBottom: 10,
              flexDirection: "column",
              alignContent: "space-between",
            }}
          >
            <Text>{plataformLanguages.secondaryColor[userLanguage]}:</Text>
            <TextInput
              placeholder="ex: #FFF"
              value={preferences?.secondary_color.toString() || ""}
              onChangeText={(e) => {
                setPreferences((prev) =>
                  prev ? { ...prev, secondary_color: String(e) } : null
                );
              }}
              style={{ borderWidth: 1, padding: 8 }}
            />
          </View>

          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <Pressable
              onPress={() => {
                setVisble(false);
              }}
              style={{ marginRight: 20 }}
            >
              <Text style={{ color: "red" }}>cancel</Text>
            </Pressable>

            <Pressable onPress={() => submitForm()}>
              <Text style={{ color: "green" }}>Insert</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
