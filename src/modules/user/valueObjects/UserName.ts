import { type Either, left, right } from "@/modules/shared/core/either";
import Guard, { type GuardResponseError } from "@/modules/shared/core/Guard";
import InvalidUserNameError from "../errors/InvalidUserName";
import ValueObject from "@/modules/shared/domain/ValueObject";

export interface UserNameProps {
  name: string;
}

export default class UserName extends ValueObject<UserNameProps> {
  public static maxLength: number = 15;
  public static minLength: number = 2;

  get value(): string {
    return this.props.name;
  }

  private constructor(props: UserNameProps) {
    super(props);
  }

  public static create(props: UserNameProps): Either<GuardResponseError, UserName> {
    const validateOrError = UserName.validate(props);

    if (validateOrError.isLeft()) {
      return left(validateOrError.value);
    }

    return right(new UserName(props));
  }

  static validate(props: UserNameProps): Either<GuardResponseError, string> {
    const usernameResult = Guard.againstEmpty(props.name, "username");
    const minLengthResult = Guard.againstAtLeast(UserName.minLength, props.name);
    const maxLengthResult = Guard.againstAtMost(UserName.maxLength, props.name);
    const spaceInStringResult = Guard.againstSpaceInString(props.name, "username");

    const combineOrError = Guard.combineEitherResults([
      usernameResult,
      minLengthResult,
      maxLengthResult,
      spaceInStringResult,
    ]);

    if (combineOrError.isLeft()) {
      return left(new InvalidUserNameError(props.name));
    }

    return right("valid");
  }
}
