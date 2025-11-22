import { useCategoryDb } from "@/db/use-category-database";
import { useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { useAppVariablesContext } from "../context/app-variables-context";
import { DeleteButton } from "./commons/delete-buttom";
import { ConfirmDeleteModal } from "./commons/delete-modal";
import { EditButton } from "./commons/edit-button";
import { InsertButton } from "./commons/insert-button";
import { InsertCategoryForm } from "./forms/insert-category-form";

export function SectionMenu() {
  const { deleteCategoryById } = useCategoryDb();
  const { categories, selectedId, setSelectedId, setRefresh } =
    useAppVariablesContext();
  const [isDeleteCategoryModalVisible, setIsDeleteCategoryModalVisible] =
    useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const [isInsertCategoryModalVisible, setIsInsertCategoryModalVisible] =
    useState(false);

  return (
    <View style={{ width: 120, backgroundColor: "#eee" }}>
      {!isDeleteCategoryModalVisible && !isInsertCategoryModalVisible && (
        <>
          <FlatList
            data={categories}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Pressable
                key={item.id}
                onPress={() => setSelectedId(item.id)}
                style={{
                  padding: 12,
                  backgroundColor:
                    selectedId === item.id ? "#ddd" : "transparent",
                }}
              >
                <Text>{item.name}</Text>
                <View style={{ flexDirection: "row", marginTop: 8 }}>
                  <EditButton onPress={() => {}} />
                  <DeleteButton
                    key={item.id}
                    onPress={() => {
                      setCategoryToDelete(item.id);
                      setIsDeleteCategoryModalVisible(true);
                    }}
                  ></DeleteButton>
                </View>
              </Pressable>
            )}
          />
          <InsertButton
            onPress={() => {
              setIsInsertCategoryModalVisible(true);
            }}
          ></InsertButton>
        </>
      )}
      {isDeleteCategoryModalVisible && (
        <ConfirmDeleteModal
          onConfirm={() => {
            deleteCategoryById(categoryToDelete!);
            setRefresh(new Date().getTime());
            setCategoryToDelete(null);
            setIsDeleteCategoryModalVisible(false);
          }}
          onCancel={() => {
            setIsDeleteCategoryModalVisible(false);
            setCategoryToDelete(null);
          }}
          visible={isDeleteCategoryModalVisible}
        ></ConfirmDeleteModal>
      )}

      {isInsertCategoryModalVisible && (
        <InsertCategoryForm
          visible={isInsertCategoryModalVisible}
          setVisble={setIsInsertCategoryModalVisible}
          setRefresh={setRefresh}
        ></InsertCategoryForm>
      )}
    </View>
  );
}
