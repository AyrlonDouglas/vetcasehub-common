import { type Either } from "../core/either";

export abstract class Mapper<Domain, Persistence, DTO> {
  abstract toDomain(param: Persistence): Domain | Either<any, Domain>;
  abstract toPersistence(param: Domain): Persistence | Either<any, Persistence>;
  abstract toDTO(param: Domain | Persistence): DTO | Either<any, DTO>;
}
