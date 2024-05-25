import { type Either, left, right } from "./either";

export type GuardResponse = string;

export interface IGuardArgument<T = any> {
  argument: T;
  argumentName: string;
}

export type GuardArgumentCollection<T = any> = Array<IGuardArgument<T>>;

export const GUARD_RESPONSE_SUCCESS = "ok";

export class GuardResponseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GuardResponseError";
  }
}

// class Guard {
// public static inRange(
//   num: number,
//   min: number,
//   max: number,
//   argumentName: string,
// ): Result<GuardResponse> {
//   const isInRange = num >= min && num <= max;
//   if (!isInRange) {
//     return Result.fail<GuardResponse>(
//       `${argumentName} is not within range ${min} to ${max}.`,
//     );
//   } else {
//     return Result.ok<GuardResponse>();
//   }
// }
// public static allInRange(
//   numbers: number[],
//   min: number,
//   max: number,
//   argumentName: string,
// ): Result<GuardResponse> {
//   let failingResult: Result<GuardResponse> = null;
//   for (const num of numbers) {
//     const numIsInRangeResult = this.inRange(num, min, max, argumentName);
//     if (!numIsInRangeResult.isFailure) failingResult = numIsInRangeResult;
//   }
//   if (failingResult) {
//     return Result.fail<GuardResponse>(
//       `${argumentName} is not within the range.`,
//     );
//   } else {
//     return Result.ok<GuardResponse>();
//   }
// }
// }

const combineEitherResults = (eitherResults: Array<Either<any, any>>): Either<any, string> => {
  const leftFound = eitherResults.find((result) => result.isLeft());
  return leftFound ?? right(GUARD_RESPONSE_SUCCESS);
};

const greaterThan = (minValue: number, actualValue: number): Either<GuardResponseError, GuardResponse> => {
  return actualValue > minValue
    ? right(GUARD_RESPONSE_SUCCESS)
    : left(new GuardResponseError(`Number given {${actualValue}} is not greater than {${minValue}}`));
};

const againstAtLeast = (numChars: number, text: string): Either<GuardResponseError, GuardResponse> => {
  return text.length >= numChars
    ? right(GUARD_RESPONSE_SUCCESS)
    : left(new GuardResponseError(`Text is not at least ${numChars} chars.`));
};

const againstAtMost = (numChars: number, text: string): Either<GuardResponseError, GuardResponse> => {
  return text.length <= numChars
    ? right(GUARD_RESPONSE_SUCCESS)
    : left(new GuardResponseError(`Text is greater than ${numChars} chars.`));
};

const againstNullOrUndefined = (argument: any, argumentName: string): Either<GuardResponseError, GuardResponse> => {
  if (argument === null || argument === undefined) {
    return left(new GuardResponseError(`${argumentName} is null or undefined`));
  } else {
    return right(GUARD_RESPONSE_SUCCESS);
  }
};

const againstNullOrUndefinedBulk = (args: GuardArgumentCollection): Either<GuardResponseError, GuardResponse> => {
  for (const arg of args) {
    const result = againstNullOrUndefined(arg.argument, arg.argumentName);
    if (result.isLeft()) return result;
  }

  return right(GUARD_RESPONSE_SUCCESS);
};

const isOneOf = (value: any, validValues: any[], argumentName: string): Either<GuardResponseError, GuardResponse> => {
  let isValid = false;
  for (const validValue of validValues) {
    if (value === validValue) {
      isValid = true;
    }
  }

  if (isValid) {
    return right(GUARD_RESPONSE_SUCCESS);
  } else {
    return left(
      new GuardResponseError(
        `${argumentName} isn't oneOf the correct types in ${JSON.stringify(validValues)}. Got "${value}".`
      )
    );
  }
};

const againstEmpty = (argument: unknown, argumentName: string): Either<GuardResponseError, GuardResponse> => {
  const errorResponse = (argumentName: any) => new GuardResponseError(`${argumentName} is empty`);
  if (argument === null || argument === undefined || argument === "") return left(errorResponse(argumentName));

  if (Array.isArray(argument) && argument.length === 0) return left(errorResponse(argumentName));

  if (typeof argument === "object" && argument !== null && Object.keys(argument).length === 0)
    return left(errorResponse(argumentName));

  return right(GUARD_RESPONSE_SUCCESS);
};

const againstEmptyBulk = (args: GuardArgumentCollection): Either<GuardResponseError, GuardResponse> => {
  for (const arg of args) {
    const result = againstEmpty(arg.argument, arg.argumentName);
    if (result.isLeft()) return result;
  }

  return right(GUARD_RESPONSE_SUCCESS);
};

const againstSpaceInString = (argument: string, argumentName: string): Either<GuardResponseError, GuardResponse> => {
  return /\s/.test(argument)
    ? left(new GuardResponseError(`${argumentName} contains spaces`))
    : right(GUARD_RESPONSE_SUCCESS);
};

const againstSpaceInStringBulk = (args: GuardArgumentCollection<string>) => {
  for (const arg of args) {
    const result = againstSpaceInString(arg.argument, arg.argumentName);
    if (result.isLeft()) return result;
  }

  return right(GUARD_RESPONSE_SUCCESS);
};

export default {
  combineEitherResults,
  greaterThan,
  againstAtLeast,
  againstAtMost,
  againstNullOrUndefined,
  againstNullOrUndefinedBulk,
  isOneOf,
  againstEmpty,
  againstEmptyBulk,
  againstSpaceInString,
  againstSpaceInStringBulk,
};
