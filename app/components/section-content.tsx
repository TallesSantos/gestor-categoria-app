import { useCategoryDb } from "@/db/use-category-database";
import { useEffect, useState } from "react";
import {
  Button,
  FlatList,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import {
  CategoryColumnSchemaWithValue,
  PrimaryColumnSchemaWitchValue,
} from "../models/schemas";
import {
  plataformLanguages,
  UserPreferences,
  UserPreferenceSizes,
} from "../models/user-preference";

import { useAppVariablesContext } from "../context/app-variables-context";
import { useUserPreferenceContext } from "../context/user-preference-context";
import { genRandonKey } from "../utils/key-utils";
import {
  formatBoolean,
  formatCustomRegistry,
} from "../utils/primitives-types-format-utils";
import { DeleteButton } from "./commons/delete-buttom";
import { ConfirmDeleteModal } from "./commons/delete-modal";
import { EditButton } from "./commons/edit-button";
import { InsertButton } from "./commons/insert-button";
import { PersonalizableSwitch } from "./commons/personalizable-switch";
import { ConfigButton } from "./commons/table-configuration-button";
import { ConfigModalForm } from "./forms/configure-table-form";
import { InsertRegistryForm } from "./forms/insert-registry-form";
import { UpdateColumnOfRegistryModalForm } from "./forms/update-column-of-registry-form";

export function SectionContent() {
  const {
    deleteRegistryById,
    loadUserPreferences,
    toggleBooleanValueOfRegistryColumnSchema,
  } = useCategoryDb();
  const { content, setRefresh, categoryMenuVisible } = useAppVariablesContext();
  const [isDeleteRegistryModalVisible, setIsDeleteRegistryModalVisible] =
    useState(false);
  const [registryToDelete, setRegistryToDelete] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isInsertRegistryModalVisible, setIsInsertRegistryModalVisible] =
    useState(false);
  const [isConfigModalVisible, setIsConfigModalVisible] = useState(false);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    column_min_heigth: 60,
    column_min_width: 60,
    id: 1,
    primary_color: "#ffffff",
    primary_color_header: "#ffffff",
    secondary_color: "#f0f0f0",
    secondary_color_header: "#f0f0f0",
  });
  const [userPreferencesSize, setUserPreferencesSize] =
    useState<UserPreferenceSizes>();
  const [refreshTable, setRefreshTable] = useState(0);
  const [
    isUpdateColumnRegistryModalVisible,
    setIsUpdateColumnRegistryModalVisible,
  ] = useState(false);

  const [updateColumn, setUpdateColumn] = useState<
    CategoryColumnSchemaWithValue | PrimaryColumnSchemaWitchValue | null
  >(null);
  const [customRegistryId, setCustomRegistryId] = useState<number | null>(null);
  const { userLanguage } = useUserPreferenceContext();

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    load();
  }, [refreshTable]);

  async function load() {
    const response = await loadUserPreferences();
    if (response) {
      setUserPreferences(response!);
      setUserPreferencesSize({
        minHeigth: response.column_min_heigth,
        width: response.column_min_width,
        padding: 8,
      });
    }
  }

  function handleToggleIsActive(registryId: number) {
    toggleBooleanValueOfRegistryColumnSchema(registryId);
  }

  function onSelect(id: number) {
    setSelectedId(id);
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={true} // opcional
    >
      <View>
        {!isDeleteRegistryModalVisible && !isConfigModalVisible && (
          <>
            {!categoryMenuVisible && (
              <Text style={{ marginLeft: 10, fontSize: 24 }}>
                {content?.header.name}
              </Text>
            )}
            <View
              style={{
                backgroundColor: "#676868",

                flexDirection: "row",
              }}
            >
              <Text
                style={[
                  userPreferencesSize,
                  { backgroundColor: userPreferences.secondary_color_header },
                ]}
              >
                <ConfigButton
                  onPress={() => {
                    setIsConfigModalVisible(true);
                  }}
                />
              </Text>
              <Text
                style={[
                  userPreferencesSize,
                  { backgroundColor: userPreferences.primary_color_header },
                ]}
              >
                Id
              </Text>
              <Text
                style={[
                  userPreferencesSize,
                  { backgroundColor: userPreferences.secondary_color_header },
                ]}
              >
                {plataformLanguages.name[userLanguage]}
              </Text>
              <Text
                style={[
                  userPreferencesSize,
                  { backgroundColor: userPreferences.primary_color_header },
                ]}
              >
                {plataformLanguages.price[userLanguage]}
              </Text>
              <Text
                style={[
                  userPreferencesSize,
                  { backgroundColor: userPreferences.secondary_color_header },
                ]}
              >
                {plataformLanguages.description[userLanguage]}
              </Text>

              {content?.header.category_columns?.map((colum, index) => (
                <Text
                  style={[
                    index % 2 == 0
                      ? [
                          userPreferencesSize,
                          {
                            backgroundColor:
                              userPreferences.primary_color_header,
                          },
                        ]
                      : [
                          userPreferencesSize,
                          {
                            backgroundColor:
                              userPreferences.secondary_color_header,
                          },
                        ],
                  ]}
                  key={genRandonKey()}
                >
                  {colum.name}
                </Text>
              ))}
            </View>

            <FlatList
              data={content?.items}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <Pressable
                  key={genRandonKey()}
                  onPress={() => onSelect(item.id)}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignContent: "center",
                      borderBottomWidth: 1,
                      borderBottomColor: "black",
                    }}
                  >
                    <Text
                      style={[
                        userPreferencesSize,
                        { backgroundColor: userPreferences.secondary_color },
                      ]}
                    >
                      <DeleteButton
                        key={genRandonKey()}
                        onPress={() => {
                          setRegistryToDelete(item.id);
                          setIsDeleteRegistryModalVisible(true);
                        }}
                      />
                    </Text>
                    <Text
                      style={[
                        userPreferencesSize,
                        { backgroundColor: userPreferences.primary_color },
                      ]}
                    >
                      {item.id}
                    </Text>
                    <Text
                      style={[
                        userPreferencesSize,
                        { backgroundColor: userPreferences.secondary_color },
                      ]}
                    >
                      {item.name}
                      <EditButton
                        onPress={() => {
                          setIsUpdateColumnRegistryModalVisible(true);
                          setUpdateColumn({
                            id: item.id,
                            name: "name",
                            value_text: item.name,
                          });
                        }}
                      />
                    </Text>
                    <Text
                      style={[
                        userPreferencesSize,
                        { backgroundColor: userPreferences.primary_color },
                      ]}
                    >
                      {item.price}
                      <EditButton
                        onPress={() => {
                          setIsUpdateColumnRegistryModalVisible(true);
                          setUpdateColumn({
                            id: item.id,
                            name: "price",
                            value_text: String(item.price),
                          });
                        }}
                      />
                    </Text>
                    <Text
                      style={[
                        userPreferencesSize,
                        { backgroundColor: userPreferences.secondary_color },
                      ]}
                    >
                      {item.description}
                      <EditButton
                        onPress={() => {
                          setIsUpdateColumnRegistryModalVisible(true);
                          setUpdateColumn({
                            id: item.id,
                            name: "description",
                            value_text: item.description,
                          });
                        }}
                      />
                    </Text>
                    {item.all_values &&
                      item.all_values.split(" - ").map((item, i) => {
                        const customResgistryFormated =
                          formatCustomRegistry(item);
                        return (
                          <View
                            style={[
                              { display: "flex", flexDirection: "column" },
                              i % 2 == 0
                                ? [
                                    userPreferencesSize,
                                    {
                                      backgroundColor:
                                        userPreferences.primary_color,
                                    },
                                  ]
                                : [
                                    userPreferencesSize,
                                    {
                                      backgroundColor:
                                        userPreferences.secondary_color,
                                    },
                                  ],
                            ]}
                            key={genRandonKey()}
                          >
                            {customResgistryFormated.href !== "NULL" ? (
                              <Button
                                title={customResgistryFormated.value_text}
                                onPress={() => {
                                  Linking.canOpenURL(
                                    customResgistryFormated.href
                                  )
                                    .then((ok) => {
                                      if (ok)
                                        Linking.openURL(
                                          customResgistryFormated.href
                                        );
                                    })
                                    .catch(
                                      (err) =>
                                        new Error(
                                          plataformLanguages.canotOpenLink[
                                            userLanguage
                                          ] + err
                                        )
                                    );
                                }}
                              ></Button>
                            ) : (
                              <Text> {customResgistryFormated.value_text}</Text>
                            )}
                            <View
                              style={{ display: "flex", flexDirection: "row" }}
                            >
                              {formatBoolean(
                                customResgistryFormated.isActive
                              ) !== "NULL" && (
                                <PersonalizableSwitch
                                  isActive={Number(
                                    customResgistryFormated.isActive
                                  )}
                                  execFunction={(e) => {
                                    handleToggleIsActive(
                                      Number(customResgistryFormated.id)
                                    );
                                  }}
                                />
                              )}
                              <EditButton
                                onPress={() => {
                                  setIsUpdateColumnRegistryModalVisible(true);
                                  setCustomRegistryId(
                                    Number(customResgistryFormated.id)
                                  );
                                }}
                              />
                            </View>
                          </View>
                        );
                      })}
                  </View>
                </Pressable>
              )}
            />

            {content?.header.id && (
              <InsertButton
                onPress={() => {
                  setIsInsertRegistryModalVisible(true);
                }}
              />
            )}
          </>
        )}
        {isDeleteRegistryModalVisible && (
          <ConfirmDeleteModal
            onConfirm={() => {
              deleteRegistryById(registryToDelete!);
              setRefresh(new Date().getTime());
              setRegistryToDelete(null);
              setIsDeleteRegistryModalVisible(false);
            }}
            onCancel={() => {
              setIsDeleteRegistryModalVisible(false);
              setRegistryToDelete(null);
            }}
            visible={isDeleteRegistryModalVisible}
          ></ConfirmDeleteModal>
        )}

        {isInsertRegistryModalVisible && (
          <InsertRegistryForm
            visible={isInsertRegistryModalVisible}
            setVisble={setIsInsertRegistryModalVisible}
          ></InsertRegistryForm>
        )}

        {isUpdateColumnRegistryModalVisible && (
          <UpdateColumnOfRegistryModalForm
            visible={isUpdateColumnRegistryModalVisible}
            setVisible={setIsUpdateColumnRegistryModalVisible}
            column={updateColumn!}
            setRefresh={setRefresh}
            customRegistryId={customRegistryId}
            setCustomRegistryId={setCustomRegistryId}
          ></UpdateColumnOfRegistryModalForm>
        )}

        {isConfigModalVisible && (
          <ConfigModalForm
            visible={isConfigModalVisible}
            setVisble={setIsConfigModalVisible}
            setRefresh={setRefreshTable}
          ></ConfigModalForm>
        )}
      </View>
    </ScrollView>
  );
}
