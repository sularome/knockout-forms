import { IValidate } from '../Interfaces/IValidate';
import { IValidationResult } from '../Interfaces/IValidationResult';
import isString from 'lodash/isString';
import { isEmptyValue } from './PlainValidators';
import { AbstractControl } from '../AbstractControl';
export const requiredError: IValidationResult = Object.freeze({ required: 'Value is required' });
export const maxLengthError: IValidationResult = Object.freeze({ required: 'Value is too long' });
export const emptyError: IValidationResult = Object.freeze({ });
// tslint:disable-next-line: variable-name
export const required: IValidate<any> = (component: AbstractControl<any>) => {
  if (isEmptyValue(component.value())) {
    return requiredError;
  }
  return emptyError;
};

export const maxLength: (max: number) => IValidate<any> = (max: number) => {
  // tslint:disable-next-line: variable-name
  return (component: AbstractControl<any>) => {
    if (isString(component.value()) && component.value().length > max) {
      return  maxLengthError;
    }
    return emptyError;
  };
};
