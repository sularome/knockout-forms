import { IValidationResult } from './IValidationResult';
import { IAbstractControl } from './IAbstractControl';

export type IValidate<T> = (control: IAbstractControl<T>)  => IValidationResult;
