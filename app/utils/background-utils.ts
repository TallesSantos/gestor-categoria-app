export function calcBackgroundColor(index: number) {
  if (index % 2 === 0) {
    return "#b1aeae";
  }
  return "#cfcece";
}
export function onSelect(id: number, setSelectedId: (id: number) => void) {
  setSelectedId(id);
}
