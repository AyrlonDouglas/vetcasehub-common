import { type Either, left, right } from "@/modules/shared/core/either";
import InvalidEmailError from "../errors/InvalidEmail";
import ValueObject from "@/modules/shared/domain/ValueObject";

export interface UserEmailProps {
  value: string;
}

export default class UserEmail extends ValueObject<UserEmailProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: UserEmailProps) {
    super(props);
  }

  private static isValidEmail(email: string): boolean {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  private static format(email: string): string {
    return email.trim().toLowerCase();
  }

  public static create(email: string): Either<InvalidEmailError, UserEmail> {
    if (!this.isValidEmail(email)) {
      return left(new InvalidEmailError(email));
    } else {
      return right(new UserEmail({ value: this.format(email) }));
    }
  }
}
