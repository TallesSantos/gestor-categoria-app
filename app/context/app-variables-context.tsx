import { useCategoryDb } from "@/db/use-category-database";
import React, {
  createContext,
  ReactNode,
  use,
  useEffect,
  useState,
} from "react";
import {
  CategorySchema,
  CollectionOfCategoryRegistryWithHeader,
} from "../models/schemas";

type UserPreferenceContextType = {
  categories: CategorySchema[];
  setCategories: React.Dispatch<React.SetStateAction<CategorySchema[]>>;
  selectedId: number | null;
  setSelectedId: React.Dispatch<React.SetStateAction<number | null>>;
  content: CollectionOfCategoryRegistryWithHeader | null;
  setContent: React.Dispatch<
    React.SetStateAction<CollectionOfCategoryRegistryWithHeader | null>
  >;
  refresh: number;
  setRefresh: React.Dispatch<React.SetStateAction<number>>;
  refreshContent: number;
  setRefreshContent: React.Dispatch<React.SetStateAction<number>>;
  categoryMenuVisible: boolean;
  setCategoryMenuVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const AppVariablesContext = createContext<UserPreferenceContextType | null>(
  null
);

export const AppVariablesProvider = ({ children }: { children: ReactNode }) => {
  const { getContentByCategory, findAllCategories } = useCategoryDb();
  const [categories, setCategories] = useState<CategorySchema[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [content, setContent] =
    useState<CollectionOfCategoryRegistryWithHeader | null>(null);
  const [refresh, setRefresh] = useState<number>(1);
  const [refreshContent, setRefreshContent] = useState<number>(1);
  const [categoryMenuVisible, setCategoryMenuVisible] = useState<boolean>(true);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadCategories();
    loadContent();
  }, [refresh, refreshContent]);

  useEffect(() => {
    loadContent();
  }, [selectedId]);

  async function loadCategories() {
    const cats = await findAllCategories();
    if (cats) {
      setCategories(cats);
      if (!selectedId) {
        setSelectedId(cats[0].id);
      }
    }
  }
  async function loadContent() {
    if (categories.length !== 0) {
      const response = await getContentByCategory(
        selectedId ? selectedId : categories[0].id
      );
      setContent(response);
    }
  }

  return (
    <AppVariablesContext.Provider
      value={{
        categories,
        setCategories,
        selectedId,
        setSelectedId,
        content,
        setContent,
        refresh,
        setRefresh,
        refreshContent,
        setRefreshContent,
        categoryMenuVisible,
        setCategoryMenuVisible,
      }}
    >
      {children}
    </AppVariablesContext.Provider>
  );
};

// Hook opcional para facilitar o uso
export const useAppVariablesContext = () => {
  const ctx = use(AppVariablesContext);
  if (!ctx)
    throw new Error(
      "useAppVariablesContext deve ser usado dentro de <AppVariablesProvider>"
    );
  return ctx;
};
