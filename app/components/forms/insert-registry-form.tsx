import { CategoryColumnSchema, RegistryRequest } from "@/app/models/schemas";
import { plataformLanguages } from "@/app/models/user-preference";

import { useAppVariablesContext } from "@/app/context/app-variables-context";
import { useUserPreferenceContext } from "@/app/context/user-preference-context";
import { useCategoryDb } from "@/db/use-category-database";
import { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { PersonalizableSwitch } from "../commons/personalizable-switch";

type FormProps = {
  setVisble: (value: boolean) => void;
  visible: boolean;
};

export function InsertRegistryForm({ visible, setVisble }: FormProps) {
  const { getCategoryByIdWhitchAllColumns, insertRegistry } = useCategoryDb();
  const { content, setRefresh, setRefreshContent, setSelectedId } =
    useAppVariablesContext();
  const [registrySchema, setRegistrySchema] = useState<RegistryRequest | null>(
    null
  );
  const { userLanguage } = useUserPreferenceContext();

  useEffect(() => {
    load();
  }, []);
  async function load() {
    if (content?.header.id) {
      const response = await getCategoryByIdWhitchAllColumns(
        content?.header.id
      );
      setRegistrySchema({
        name: "",
        price: 0,
        description: "",
        extra_columns:
          response?.category_columns?.map((colum) => ({
            ...colum,
            value_text: "NULL",
          })) || [],
      });
    } else {
      throw new Error("Category not found");
    }
  }

  async function submitForm() {
    setVisble(false);
    insertRegistry(content?.header.id!, registrySchema!);

    setRefresh(Date.now());
    setSelectedId(content?.header.id!);
  }

  function handleEditRegistrationSchema(
    column: CategoryColumnSchema,
    propertyOfColumn: "value_text" | "href" | "isActive",
    valueOfColumn: string | boolean
  ) {
    setRegistrySchema((prev) => {
      if (!prev) return prev;

      const updatedColumns = prev.extra_columns.map((item) =>
        item.id === column.id
          ? { ...item, [propertyOfColumn]: valueOfColumn }
          : item
      );

      return {
        ...prev,
        extra_columns: updatedColumns,
      };
    });
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={true}>
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
              height: 400,
              width: 280,
              backgroundColor: "#fff",
              padding: 20,
              borderRadius: 10,
            }}
          >
            <Text>{plataformLanguages.insertRegistryTitle[userLanguage]}</Text>
            <TextInput
              placeholder="Name"
              onChangeText={(e) => {
                setRegistrySchema((prev) =>
                  prev ? { ...prev, name: e } : prev
                );
              }}
              style={{ borderWidth: 1, padding: 8 }}
            />
            <TextInput
              placeholder="Price"
              textContentType="flightNumber"
              onChangeText={(e) => {
                setRegistrySchema((prev) =>
                  prev ? { ...prev, price: Number(e) } : prev
                );
              }}
              style={{ borderWidth: 1, padding: 8 }}
            />

            <TextInput
              placeholder="Description"
              onChangeText={(e) => {
                setRegistrySchema((prev) =>
                  prev ? { ...prev, description: e } : prev
                );
              }}
              style={{ borderWidth: 1, padding: 8 }}
            />
            <Text>Extra columns</Text>
            <FlatList
              data={registrySchema?.extra_columns}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item: column }) => (
                <View
                  key={column.id}
                  style={{ marginTop: 8, backgroundColor: "beige" }}
                >
                  <Text>{column.name}</Text>
                  <View>
                    <TextInput
                      placeholder="Value"
                      onChangeText={(value) => {
                        handleEditRegistrationSchema(
                          column,
                          "value_text",
                          value
                        );
                      }}
                      style={{ borderWidth: 1, padding: 8 }}
                    />
                    <View>
                      <TextInput
                        placeholder={"Link to external url"}
                        onChangeText={(value) => {
                          handleEditRegistrationSchema(column, "href", value);
                        }}
                      ></TextInput>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Text>É uma coluna boolean?</Text>
                        <PersonalizableSwitch
                          execFunction={(e) => {
                            handleEditRegistrationSchema(
                              column,
                              "isActive",
                              Boolean(e)
                            );
                          }}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              )}
            />

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
    </ScrollView>
  );
}
