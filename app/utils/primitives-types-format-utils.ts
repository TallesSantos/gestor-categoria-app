export function formatCustomRegistry(s: string) {
  const arr = s.split("|divisor|");
  const formatedArr = {
    value_text: arr[0],
    id: arr[1],
    href: arr[2],
    isActive: arr[3],
  };

  return formatedArr;
}

export function formatBoolean(s: number | string) {
  if (s === 1) {
    return true;
  } else if (s === 0) {
    return false;
  } else if (s === "NULL") {
    return "NULL";
  }
}
