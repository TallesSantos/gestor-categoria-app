import { initializer } from "@/db/initializer";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { AppVariablesProvider } from "./context/app-variables-context";
import { UserPreferenceProvider } from "./context/user-preference-context";

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="prod.db" onInit={initializer}>
      <AppVariablesProvider>
        <UserPreferenceProvider>
          <Stack />
        </UserPreferenceProvider>
      </AppVariablesProvider>
    </SQLiteProvider>
  );
}
