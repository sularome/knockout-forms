import { IValidationResult } from './IValidationResult';

export type IValidate<T, U> = (modelValue: T | undefined, viewValue: U)  => IValidationResult;
