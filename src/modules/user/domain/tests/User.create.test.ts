import { USER_STATUS, type UserDomainProps } from "../User.types";
import { GuardResponseError } from "@/modules/shared/core/Guard";
import UniqueEntityID from "@/modules/shared/domain/UniqueEntityID";
import User from "../User";

const makeSut = () => {
  const validProps = User.prepareToCreate({
    email: "valid@valid.com",
    firstName: "teste",
    lastName: "teste",
    password: "123",
    status: USER_STATUS.ACTIVE,
    username: "teste1",
  });
  if (validProps.isLeft()) {
    throw validProps.value;
  }
  const sut = (props: UserDomainProps) => User.create(props, new UniqueEntityID());

  return { sut, validProps: validProps.value };
};

describe("User.create()", () => {
  test("Should return error when dont have all parameters required filled", () => {
    const { sut, validProps } = makeSut();
    const invalidProps: UserDomainProps = {
      ...validProps,
      lastName: "",
    };

    const result = sut(invalidProps);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(GuardResponseError);
  });

  test("Should return success when all parameters required filled", () => {
    const { sut, validProps } = makeSut();

    const result = sut(validProps);

    expect(result.isRight()).toBe(true);
    expect(result.value).toBeInstanceOf(User);
  });

  test("Should return the correct props when all parameters required filled", () => {
    const { sut, validProps } = makeSut();

    const result = sut(validProps);
    if (result.isLeft()) {
      throw Error("Invalid props");
    }

    expect(result.value.props.email).toBe(validProps.email);
    expect(result.value.props.firstName).toBe(validProps.firstName);
    expect(result.value.props.lastName).toBe(validProps.lastName);
    expect(result.value.props.password).toBe(validProps.password);
    expect(result.value.props.status).toBe(validProps.status);
    expect(result.value.props.username).toBe(validProps.username);
  });
});
