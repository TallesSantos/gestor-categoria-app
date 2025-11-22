export class DuplicatedDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DuplicatedData";
  }
}

export class EmptyDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EmptyData";
  }
}
