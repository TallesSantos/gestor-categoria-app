export type CategorySchema = {
  id: number;
  name: string;
  category_columns?: CategoryColumnSchema[];
};

export type CategorySchemaForRequest = Omit<
  CategorySchema,
  "id" | "category_columns"
> & {
  category_columns: Omit<CategoryColumnSchema, "id">[];
};

export type CategoryColumnSchema = {
  id: number;
  name: string;
};

type CategoryColumnValueSchema = {
  id: number;
  category_column_id: number;
  category_registry_id: number;
  value_text: string;
};

export type CategoryRegistrySchema = {
  id: number;
  name: string;
  price?: number;
  description?: string;
  extra_columns?: CategoryColumnValueSchema[];
};

export type CollectionOfCategoryRegistryWithHeader = {
  header: CategorySchema;
  items: RegistryWithExtraColumns[];
};

export type RegistryWithExtraColumns = {
  id: number;
  name: string;
  price: number;
  description: string;
  all_values: string;
};

export interface CategoryColumnSchemaWithValue extends CategoryColumnSchema {
  value_text: string;
  href?: string;
  isActive?: boolean;
}

export interface RegistryRequest
  extends Omit<RegistryWithExtraColumns, "id" | "all_values"> {
  extra_columns: CategoryColumnSchemaWithValue[];
}

export interface PrimaryColumnSchemaWitchValue {
  id: number;
  name: string;
  value_text: string;
}

export interface CategoryRegistryColumnJunction {
  id: number;
  value_text: string;
  href: string | null;
  isActive: number | null;
  category_column_id: number;
  category_registry_id: number;
}
