import { type Either, left, right } from "@/modules/shared/core/either";
import Guard, { type GuardResponseError } from "@/modules/shared/core/Guard";
import { USER_STATUS, type UserDomainProps, type UserPrepareToCreateProps, type UserStatusType } from "./User.types";
import { Entity } from "@/modules/shared/domain/Entity";
import type InvalidEmailError from "../errors/InvalidEmail";
import type UniqueEntityID from "@/modules/shared/domain/UniqueEntityID";
import UserEmail from "../valueObjects/UserEmail";
import { UserName } from "../valueObjects/UserName";

export default class User extends Entity<UserDomainProps> {
  private constructor(props: UserDomainProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(user: UserDomainProps, id?: UniqueEntityID): Either<GuardResponseError, User> {
    const userPropsResult = Guard.againstEmptyBulk([
      { argument: user.username, argumentName: "username" },
      { argument: user.email, argumentName: "email" },
      { argument: user.firstName, argumentName: "firstName" },
      { argument: user.lastName, argumentName: "lastName" },
      { argument: user.status, argumentName: "status" },
      { argument: user.password, argumentName: "password" },
    ]);
    const statusResult = Guard.isOneOf(user.status, Object.values(USER_STATUS), "status");

    const combineResultOrError = Guard.combineEitherResults([userPropsResult, statusResult]);
    if (combineResultOrError.isLeft()) {
      return left(combineResultOrError.value);
    }

    const newUser = new User(user, id);
    return right(newUser);
  }

  public update(props: Partial<UserDomainProps>) {
    return User.create({ ...this.props, ...props }, this._id);
  }

  public static prepareToCreate(
    params: UserPrepareToCreateProps
  ): Either<InvalidEmailError | GuardResponseError, UserDomainProps> {
    const emailOrError = UserEmail.create(params.email);
    if (emailOrError.isLeft()) {
      return left(emailOrError.value);
    }

    const userNameOrError = UserName.create({ name: params.username });
    if (userNameOrError.isLeft()) {
      return left(userNameOrError.value);
    }

    const statusResult = Guard.isOneOf(params.status, Object.values(USER_STATUS), "status");
    if (statusResult.isLeft()) {
      return left(statusResult.value);
    }

    const userCreateProps: UserDomainProps = {
      username: userNameOrError.value,
      email: emailOrError.value,
      firstName: params.firstName,
      lastName: params.lastName,
      password: params.password,
      status: params.status as UserStatusType,
    };

    return right(userCreateProps);
  }
}
