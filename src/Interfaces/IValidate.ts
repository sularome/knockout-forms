import { IValidationResult } from './IValidationResult';
import { AbstractControl } from '../AbstractControl';

export type IValidate<T> = (control: AbstractControl<T>)  => IValidationResult;
