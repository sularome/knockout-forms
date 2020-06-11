import { IValidationResult } from './IValidationResult';
export interface IAbstractControl {
  valid: ko.Subscribable<boolean>;
  invalid: ko.Subscribable<boolean>;
  errors: ko.Subscribable<IValidationResult>;
}
