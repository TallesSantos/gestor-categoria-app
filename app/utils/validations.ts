import { DuplicatedDataError, EmptyDataError } from "../errors/input-errors";

export function validDuplicatedColumn<T>(
  text: string,
  arr: T[],
  propName: keyof T
) {
  const exists = arr.some((item) => item[propName] === text);

  if (exists) {
    throw new DuplicatedDataError("Coluna já adicionada");
  }
}

export function validEmptyColumn(text: string) {
  if (text.trim() === "") {
    throw new EmptyDataError("Coluna vazia não pode ser adicionada");
  }
}
