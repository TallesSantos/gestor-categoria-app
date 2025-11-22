import { useEffect, useState } from "react";
import { Switch } from "react-native";

export function PersonalizableSwitch({
  execFunction,
  isActive,
}: {
  execFunction: (e: boolean) => void;
  isActive?: number;
}) {
  const [value, setValue] = useState<boolean>(false);
  useEffect(() => {
    if (isActive) {
      setValue(isActive === 1 ? true : false);
    }
  }, []);
  return (
    <Switch
      value={value}
      onValueChange={(e) => {
        setValue(e);
        execFunction(e);
      }}
    />
  );
}
