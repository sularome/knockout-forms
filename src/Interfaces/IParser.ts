import { Either } from '../functionalHelpers/Either';

export type IParser<T, U> = (value: T | U)  => Either<string, U>;
