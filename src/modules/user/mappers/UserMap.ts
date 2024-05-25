import type InvalidEmailError from "../errors/InvalidEmail";
import { type Mapper } from "@/modules/shared/infra/Mapper";
import { type Either, left, right } from "@/modules/shared/core/either";
import { type GuardResponseError } from "@/modules/shared/core/Guard";
import UniqueEntityID from "@/modules/shared/domain/UniqueEntityID";
import User from "../domain/User";
import { type UserPrepareToCreateProps } from "../domain/User.types";

export default class UserMap implements Mapper<User, unknown, unknown> {
  toDomain(params: UserPrepareToCreateProps): Either<InvalidEmailError | GuardResponseError, User> {
    const propsToDomainOrError = User.prepareToCreate(params);
    if (propsToDomainOrError.isLeft()) {
      return left(propsToDomainOrError.value);
    }

    const userOrError = User.create(propsToDomainOrError.value, new UniqueEntityID(params.id));

    if (userOrError.isLeft()) {
      return left(userOrError.value);
    }

    return right(userOrError.value);
  }

  toPersistence(param: User): unknown {
    throw new Error("Method not implemented.");
  }

  toDTO(param: any): unknown {
    throw new Error("Method not implemented.");
  }
}
