import { USER_STATUS, type UserDomainProps } from "../User.types";
import User from "../User";
import UserEmail from "../../valueObjects/UserEmail";

const makeSut = () => {
  const propsToCreateValid = User.prepareToCreate({
    email: "teste@teste.com",
    firstName: "teste",
    lastName: "teste",
    password: "123",
    status: USER_STATUS.ACTIVE,
    username: "teste",
  });

  if (propsToCreateValid.isLeft()) {
    throw new Error("PropsToCreateInvalid");
  }

  const userOrError = User.create(propsToCreateValid.value);
  if (userOrError.isLeft()) throw new Error("userOrError");

  const sut = (props: Partial<UserDomainProps>) => userOrError.value.update(props);

  return { sut, oldUser: userOrError.value };
};

describe("new User().update()", () => {
  test("Should return error when invalid props", () => {
    const { sut, oldUser } = makeSut();
    const invalidProps: UserDomainProps = {
      ...oldUser.props,
      lastName: "",
    };

    const result = sut(invalidProps);

    expect(result.isLeft()).toBe(true);
  });

  test("Should update when passing valid props", () => {
    const { sut, oldUser } = makeSut();

    const emailOrError = UserEmail.create("ayr@ta.com");

    if (emailOrError.isLeft()) {
      throw new Error("email invalid to test");
    }

    const propsToUpdate: Partial<UserDomainProps> = {
      ...oldUser.props,
      email: emailOrError.value,
      status: USER_STATUS.INACTIVE,
    };

    const result = sut(propsToUpdate);
    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.props.email).toEqual(emailOrError.value);
      expect(result.value.props).toEqual(propsToUpdate);
    }
  });
});
