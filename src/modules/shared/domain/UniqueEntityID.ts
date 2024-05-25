import Identifier from "./Identifier";

export default class UniqueEntityID extends Identifier<string | number> {
  constructor(id?: string | number) {
    super(id ?? UniqueEntityID.generateUUID());
  }

  private static generateUUID(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }
}
