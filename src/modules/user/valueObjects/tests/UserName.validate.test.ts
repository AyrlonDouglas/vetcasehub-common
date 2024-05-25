import { UserName, type UserNameProps } from "../UserName";
import { type Either } from "@/modules/shared/core/either";
import { type GuardResponseError } from "@/modules/shared/core/Guard";
import InvalidUserNameError from "../../errors/InvalidUserName";

const makeSut = (): { sut: (props: UserNameProps) => Either<GuardResponseError, string> } => {
  const sut = (props: UserNameProps): Either<GuardResponseError, string> => UserName.validate(props);

  return { sut };
};

describe("UserName.validade()", () => {
  test("Should return invalid when name is longer than 15 characters", () => {
    const { sut } = makeSut();
    const propsInvalid = { name: "A".repeat(16) };

    const result = sut(propsInvalid);

    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(InvalidUserNameError);
  });

  test("Should return invalid when name is less than 2 characters", () => {
    const { sut } = makeSut();
    const propsInvalid = { name: "A" };

    const result = sut(propsInvalid);

    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(InvalidUserNameError);
  });

  test("Should return invalid when name contain space", () => {
    const { sut } = makeSut();
    const propsInvalid = { name: "Ayr lon" };

    const result = sut(propsInvalid);

    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(InvalidUserNameError);
  });

  test("Should return valid when name is a param valid", () => {
    const { sut } = makeSut();
    const propsValid = { name: "NameValid" };

    const result = sut(propsValid);

    expect(result.isRight()).toBe(true);
    expect(result.value).toBe("valid");
  });

  test("Should return valid when name is a param valid", () => {
    const { sut } = makeSut();
    const propsValid = { name: "NameValid" };

    const result = sut(propsValid);

    expect(result.isRight()).toBe(true);
    expect(result.value).toBe("valid");
  });
});
