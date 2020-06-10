import { IValidate } from './Interfaces/IValidate';
import { IValidationResult } from './Interfaces/IValidationResult';
import isString from 'lodash/isString';
export const requiredError: IValidationResult = Object.freeze({ required: 'Value is required' });
export const maxLengthError: IValidationResult = Object.freeze({ required: 'Value is too long' });
export const emptyError: IValidationResult = Object.freeze({ });
// tslint:disable-next-line: variable-name
export const required: IValidate<any, any> = (_modelValue: any, viewValue: any) => {
  if (viewValue === void 0 || viewValue === null || viewValue === '' || (typeof viewValue === 'number' && isNaN(viewValue))) {
    return requiredError;
  }
  return emptyError;
};
export const maxLength: (max: number) => IValidate<any, any> = (max: number) => {
  // tslint:disable-next-line: variable-name
  return (_modelValue: any, viewValue: any) => {
    if (isString(viewValue) && viewValue.length > max) {
      return  maxLengthError;
    }
    return emptyError;
  };
};
