import { DuplicatedDataError, EmptyDataError } from "@/app/errors/input-errors";
import {
  CategoryColumnSchemaWithValue,
  PrimaryColumnSchemaWitchValue,
} from "@/app/models/schemas";
import { validEmptyColumn } from "@/app/utils/validations";
import { useCategoryDb } from "@/db/use-category-database";
import { useEffect, useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";

export function UpdateColumnOfRegistryModalForm({
  visible,
  setVisible,
  setRefresh,
  column,
  customRegistryId,
  setCustomRegistryId,
}: {
  setVisible: (value: boolean) => void;
  visible: boolean;
  setRefresh: (i: number) => void;
  column: CategoryColumnSchemaWithValue | PrimaryColumnSchemaWitchValue | null;
  customRegistryId: number | null;
  setCustomRegistryId: (value: number | null) => void;
}) {
  const { updatePrimaryRegistry, updateCustomColumnOfRegistry } =
    useCategoryDb();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [editingColumnValue, setEditingColumnValue] = useState<string>("");

  useEffect(() => {
    setEditingColumnValue(column?.value_text || "");
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setErrorMessage("");
    }, 1000);
  });

  function submitForm() {
    if (
      column?.name === "name" ||
      column?.name === "price" ||
      column?.name === "description"
    ) {
      updatePrimaryRegistry({
        id: column.id,
        name: column.name,
        value_text: editingColumnValue,
      });
      setEditingColumnValue("");
      setRefresh(Date.now());
    }

    if (customRegistryId) {
      updateCustomColumnOfRegistry(customRegistryId, {
        id: customRegistryId,
        name: "",
        value_text: editingColumnValue,
      });
      setEditingColumnValue("");
      setRefresh(Date.now());
      setCustomRegistryId(null);
    }
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
          {errorMessage ? (
            <Text style={{ color: "red" }}>{errorMessage}</Text>
          ) : null}
          {customRegistryId ? (
            <Text> Coluna personalizada </Text>
          ) : (
            <Text>{column?.name}</Text>
          )}
          <TextInput
            placeholder={column?.name}
            value={editingColumnValue}
            onChangeText={(e) => {
              setEditingColumnValue(e);
            }}
            style={{ borderWidth: 1, padding: 8 }}
          />

          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <Pressable
              onPress={() => {
                setVisible(false);
                setEditingColumnValue("");
              }}
            >
              <Text style={{ color: "red" }}>cancel</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                try {
                  validEmptyColumn(editingColumnValue);
                  setVisible(false);
                  submitForm();
                } catch (e: DuplicatedDataError | EmptyDataError | any) {
                  if (
                    e instanceof DuplicatedDataError ||
                    e instanceof EmptyDataError
                  ) {
                    setErrorMessage(e.message);
                    setEditingColumnValue("");
                  }
                }
              }}
            >
              <Text style={{ color: "green" }}>Update</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
