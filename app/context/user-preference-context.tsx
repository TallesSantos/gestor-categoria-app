import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  use,
  useEffect,
  useState,
} from "react";
import { Languages } from "../models/user-preference";

type UserPreferenceContextType = {
  userLanguage: Languages;
  setUserLanguage: (language: Languages) => void;
};

const UserPreferenceContext = createContext<UserPreferenceContextType | null>(
  null
);

export const UserPreferenceProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [userLanguage, setUserLanguage] = useState<Languages>("eng");

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("lang", userLanguage);
    load();
  }, [userLanguage]);

  async function load() {
    const lang = await AsyncStorage.getItem("lang");
    if (lang !== null) {
      if (lang === "eng" || lang === "br") setUserLanguage(lang);
    }
  }

  return (
    <UserPreferenceContext.Provider
      value={{
        userLanguage,
        setUserLanguage,
      }}
    >
      {children}
    </UserPreferenceContext.Provider>
  );
};

export const useUserPreferenceContext = () => {
  const ctx = use(UserPreferenceContext);
  if (!ctx)
    throw new Error(
      "useUserPreferenceContext deve ser usado dentro de <UserProvider>"
    );
  return ctx;
};
