import {
  CategoryColumnSchema,
  CategoryColumnSchemaWithValue,
  CategoryRegistryColumnJunction,
  CategorySchema,
  CategorySchemaForRequest,
  CollectionOfCategoryRegistryWithHeader,
  PrimaryColumnSchemaWitchValue,
  RegistryRequest,
  RegistryWithExtraColumns,
} from "@/app/models/schemas";
import { UserPreferences } from "@/app/models/user-preference";
import { useSQLiteContext } from "expo-sqlite";

export function useCategoryDb() {
  const database = useSQLiteContext();

  async function findAllCategories() {
    try {
      const query = "SELECT * FROM category;";
      const response = await database.getAllAsync<CategorySchema>(query);
      return response;
    } catch (e) {
      console.log(e);
    }
  }

  async function getCategoryByIdWhitchAllColumns(
    id: number
  ): Promise<CategorySchema | null> {
    try {
      const categoryQuery = "SELECT * FROM category  WHERE id = ?";
      const categoryResponse = await database.getFirstAsync<CategorySchema>(
        categoryQuery,
        [id]
      );
      if (!categoryResponse) {
        throw new Error("Category not found");
      }

      const columnsQuery =
        "SELECT * FROM category_column WHERE category_id = ?";
      const columnsResponse = await database.getAllAsync<CategoryColumnSchema>(
        columnsQuery,
        [id]
      );
      if (columnsResponse) {
        categoryResponse.category_columns = columnsResponse;
      }
      return categoryResponse;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async function getAllRegistryWitchExtraCulumnsValue(id: number) {
    try {
      const query = `SELECT 
                      cr.id,
                      COALESCE(crcj.value_text, 'NULL'),
                      cr.price,
                      COALESCE(crcj.value_text, 'NULL'),
                      GROUP_CONCAT(
                          printf(
                              '%s|divisor|%s|divisor|%s|divisor|%s',
                              COALESCE(crcj.value_text, 'NULL'),
                              COALESCE(crcj.id, 'NULL'),
                              COALESCE(crcj.href, 'NULL'),
                              COALESCE(crcj.isActive, 'NULL')
                          ),
                          ' - '
                      ) AS all_values
                  FROM category_registry_column_junction AS crcj
                  RIGHT JOIN category_registry AS cr 
                      ON cr.id = crcj.category_registry_id
                  WHERE cr.category_id = ?
                  GROUP BY 
                    cr.id, cr.name, cr.price, cr.description;`;
      const response = await database.getAllAsync<RegistryWithExtraColumns>(
        query,
        [id]
      );

      return response;
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  async function getContentByCategory(
    id: number
  ): Promise<CollectionOfCategoryRegistryWithHeader | null> {
    try {
      const header = await getCategoryByIdWhitchAllColumns(id);
      if (!header) {
        throw new Error("Category not found");
      }

      const registry = await getAllRegistryWitchExtraCulumnsValue(id);

      const collection: CollectionOfCategoryRegistryWithHeader = {
        header: header,
        items: registry ? registry : [],
      };
      return collection;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async function insertIntoCategory(category: CategorySchemaForRequest) {
    try {
      const responseCategory = await database.runAsync(
        "INSERT INTO category(name) VALUES (?)",
        [category.name]
      );
      const categoryId = responseCategory.lastInsertRowId;

      for (let i = 0; i < category.category_columns.length; i++) {
        const column = category.category_columns[i];
        await database.runAsync(
          "INSERT INTO category_column(name, category_id) VALUES (?, ?)",
          [column.name, categoryId]
        );
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function insertRegistry(
    categoryId: number,
    registryRequest: RegistryRequest
  ) {
    const response = await database.runAsync(
      "INSERT INTO category_registry(name, price, description, category_id) VALUES (?, ? ,?, ?)",
      [
        registryRequest.name,
        registryRequest.price,
        registryRequest.description,
        categoryId,
      ]
    );

    const registryId = response.lastInsertRowId;
    for (let i = 0; i < registryRequest.extra_columns.length; i++) {
      let templateParamns = "?, ?, ?";
      if (
        registryRequest.extra_columns[i].href !== null &&
        registryRequest.extra_columns[i].href !== undefined
      ) {
        templateParamns += ", ?";
      }
      if (
        registryRequest.extra_columns[i].isActive !== null &&
        registryRequest.extra_columns[i].isActive !== undefined &&
        registryRequest.extra_columns[i].isActive !== false
      ) {
        templateParamns += ", ?";
      }

      const registryColumnId = registryRequest.extra_columns[i].id;
      const registryColumnValueText =
        registryRequest.extra_columns[i].value_text;

      const registryHrefValue = registryRequest.extra_columns[i].href;
      const href = registryHrefValue ? ",href" : "";

      const registryIsActiveValue =
        registryRequest.extra_columns[i].isActive === true ? 0 : null;
      const isActive = registryIsActiveValue !== null ? ",isActive" : "";

      const params = [registryColumnValueText, registryColumnId, registryId];
      if (registryHrefValue) {
        params.push(registryHrefValue);
      }
      if (registryIsActiveValue !== null) {
        params.push(registryIsActiveValue);
      }

      const query = `INSERT INTO category_registry_column_junction(value_text, category_column_id,  category_registry_id ${href} ${isActive}) VALUES (${templateParamns})`;

      try {
        await database.runAsync(query, [...params]);
      } catch (e) {
        console.log(e);
      }
    }
  }

  async function toggleBooleanValueOfRegistryColumnSchema(registryId: number) {
    const selectQuery =
      "SELECT * FROM category_registry_column_junction  WHERE id = ?";
    const categoryResponse =
      await database.getFirstAsync<CategoryRegistryColumnJunction>(
        selectQuery,
        [registryId]
      );
    const newIsActive = categoryResponse?.isActive === 0 ? 1 : 0;
    const updateQuery = `
      UPDATE category_registry_column_junction
      SET isActive = ?
      WHERE id = ?`;
    await database.runAsync(updateQuery, [newIsActive, registryId]);
  }

  async function updatePrimaryRegistry(request: PrimaryColumnSchemaWitchValue) {
    const columnName = request.name;
    await database.runAsync(
      `UPDATE category_registry 
       SET ${columnName} = ? WHERE id = ?`,
      [
        request.name === "price"
          ? Number(request.value_text)
          : request.value_text,
        request.id,
      ]
    );
  }

  async function getCustomRegistryById(id: number) {
    await database.getFirstAsync(
      `SELECT * FROM category_registry_column_junction WHERE id = ?";`,
      [id]
    );
  }

  async function updateCustomColumnOfRegistry(
    id: number,
    request: CategoryColumnSchemaWithValue
  ) {
    await database.runAsync(
      `UPDATE category_registry_column_junction 
       SET value_text = ? WHERE id = ${id}`,
      [request.value_text]
    );
  }

  async function deleteCategoryById(id: number) {
    return await database.runAsync("DELETE FROM category WHERE id = ?", [id]);
  }

  async function deleteRegistryById(id: number) {
    try {
      const response = await database.runAsync(
        "DELETE FROM category_registry WHERE id = ?",
        [id]
      );
      return response;
    } catch (e) {
      console.log(e);
    }
  }

  async function loadUserPreferences() {
    return await database.getFirstAsync<UserPreferences>(
      "SELECT * from user_preferences WHERE id = 1"
    );
  }

  async function updateUserPreferences(request: UserPreferences) {
    await database.runAsync(
      `UPDATE user_preferences 
       SET primary_color_header = ?, 
           secondary_color_header = ?, 
           primary_color = ?, 
           secondary_color = ?, 
           column_min_width = ?, 
           column_min_heigth = ? 
       WHERE id = ?`,
      [
        request.primary_color_header,
        request.secondary_color_header,
        request.primary_color,
        request.secondary_color,
        request.column_min_width,
        request.column_min_heigth,
        request.id,
      ]
    );
  }

  return {
    findAllCategories,
    getContentByCategory,
    deleteCategoryById,
    deleteRegistryById,
    insertIntoCategory,
    getCategoryByIdWhitchAllColumns,
    insertRegistry,
    loadUserPreferences,
    updateUserPreferences,
    updatePrimaryRegistry,
    updateCustomColumnOfRegistry,
    getCustomRegistryById,
    toggleBooleanValueOfRegistryColumnSchema,
  };
}
