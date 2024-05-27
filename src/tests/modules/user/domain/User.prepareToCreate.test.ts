import { USER_STATUS, type UserDomainProps, type UserPrepareToCreateProps } from "@/modules/user/domain/User.types";
import { type Either } from "@/modules/shared/core/either";
import { GuardResponseError } from "@/modules/shared/core/Guard";
import InvalidEmailError from "@/modules/user/errors/InvalidEmail";
import InvalidUserNameError from "@/modules/user/errors/InvalidUserName";
import User from "@/modules/user/domain/User";
import UserEmail from "@/modules/user/valueObjects/UserEmail";
import UserName from "@/modules/user/valueObjects/UserName";

const makeSut = (): {
  sut: (props: UserPrepareToCreateProps) => Either<InvalidEmailError | GuardResponseError, UserDomainProps>;
  propsValid: UserPrepareToCreateProps;
} => {
  const propsValid: UserPrepareToCreateProps = {
    email: "teste@test.com",
    firstName: "Teste",
    lastName: "Teste",
    password: "123",
    status: USER_STATUS.ACTIVE,
    username: "teste1",
  };

  const sut = (props: UserPrepareToCreateProps) => User.prepareToCreate(props);

  return { sut, propsValid };
};

describe("User.prepareToCreate()", () => {
  test("Should return error when email is invalid", () => {
    const { sut, propsValid } = makeSut();
    const propsInvalid: UserPrepareToCreateProps = {
      ...propsValid,
      email: "1",
    };

    const result = sut(propsInvalid);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidEmailError);
  });

  test("Should return error when username is invalid", () => {
    const { sut, propsValid } = makeSut();
    const propsInvalid: UserPrepareToCreateProps = {
      ...propsValid,
      username: "a",
    };

    const result = sut(propsInvalid);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidUserNameError);
  });

  test("Should return error when status is invalid", () => {
    const { sut, propsValid } = makeSut();
    const propsInvalid: UserPrepareToCreateProps = {
      ...propsValid,
      status: "invalidStatus",
    };

    const result = sut(propsInvalid);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(GuardResponseError);
  });

  test("Should return the props to create a User", () => {
    const { sut, propsValid } = makeSut();

    const result = sut(propsValid);

    expect(result.isRight()).toBe(true);
  });

  test("Should return the correct props to create a User", () => {
    const { sut, propsValid } = makeSut();

    const result = sut(propsValid);

    if (result.isLeft()) {
      throw new Error("invalid props");
    }
    expect(result.value.email).toBeInstanceOf(UserEmail);
    expect(result.value.username).toBeInstanceOf(UserName);
    expect(result.value.firstName).toBe(propsValid.firstName);
    expect(result.value.lastName).toBe(propsValid.lastName);
    expect(result.value.password).toBe(propsValid.password);
    expect(result.value.status).toBe(propsValid.status);
  });
});
