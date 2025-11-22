import { useUserPreferenceContext } from "@/app/context/user-preference-context";
import { DuplicatedDataError, EmptyDataError } from "@/app/errors/input-errors";
import {
  CategoryColumnSchema,
  CategorySchemaForRequest,
} from "@/app/models/schemas";
import { plataformLanguages } from "@/app/models/user-preference";
import {
  validDuplicatedColumn,
  validEmptyColumn,
} from "@/app/utils/validations";
import { useCategoryDb } from "@/db/use-category-database";
import { Button } from "@react-navigation/elements";
import { useEffect, useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";

type FormProps = {
  setVisble: (value: boolean) => void;
  visible: boolean;
  setRefresh: (i: number) => void;
};

export function InsertCategoryForm({
  visible,
  setVisble,
  setRefresh,
}: FormProps) {
  const { insertIntoCategory } = useCategoryDb();
  const [extraColumns, setExtraColumns] = useState<
    Omit<CategoryColumnSchema, "id">[]
  >([]);
  const [categoryName, setCategoryName] = useState("");
  const [editingColumn, setEditingColumn] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { userLanguage } = useUserPreferenceContext();

  useEffect(() => {
    setTimeout(() => {
      setErrorMessage("");
    }, 1000);
  });

  function submitForm() {
    const newCategory: CategorySchemaForRequest = {
      name: categoryName,
      category_columns: extraColumns,
    };
    insertIntoCategory(newCategory);
    setVisble(false);
    setRefresh(Date.now());
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
          <Text>{plataformLanguages.insertCategoryTitle[userLanguage]}</Text>
          <TextInput
            placeholder={plataformLanguages.name[userLanguage]}
            value={categoryName}
            onChangeText={(e) => {
              setCategoryName(e);
            }}
            style={{ borderWidth: 1, padding: 8 }}
          />

          {extraColumns.length > 0 ? (
            <Text> {extraColumns.map((colum) => colum.name).join(" - ")}</Text>
          ) : (
            <Text>Nenhuma coluna extra adicionada</Text>
          )}

          {errorMessage ? (
            <Text style={{ color: "red" }}>{errorMessage}</Text>
          ) : null}

          <TextInput
            placeholder={plataformLanguages.extraColumnName[userLanguage]}
            value={editingColumn}
            onChangeText={(e) => {
              setEditingColumn(e);
            }}
            style={{ borderWidth: 1, padding: 8 }}
          />
          <Button
            onPress={() => {
              try {
                validDuplicatedColumn<Omit<CategoryColumnSchema, "id">>(
                  editingColumn,
                  extraColumns,
                  "name"
                );
                validEmptyColumn(editingColumn);
                setExtraColumns((prev) => [...prev, { name: editingColumn }]);
                setEditingColumn("");
              } catch (e: DuplicatedDataError | EmptyDataError | any) {
                if (
                  e instanceof DuplicatedDataError ||
                  e instanceof EmptyDataError
                ) {
                  setErrorMessage(e.message);
                  setEditingColumn("");
                }
              }
            }}
          >
            {plataformLanguages.add[userLanguage]}
          </Button>
          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <Pressable
              onPress={() => {
                setExtraColumns([]);
                setCategoryName("");
                setVisble(false);
              }}
              style={{ marginRight: 20 }}
            >
              <Text style={{ color: "red" }}>
                {plataformLanguages.cancel[userLanguage]}
              </Text>
            </Pressable>

            <Pressable onPress={() => submitForm()}>
              <Text style={{ color: "green" }}>
                {plataformLanguages.insert[userLanguage]}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
