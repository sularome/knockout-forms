import { IValidationResult } from './IValidationResult';
export interface IAbstractControl<T> {
  errors: ko.Subscribable<IValidationResult>;
  invalid: ko.Subscribable<boolean>;
  valid: ko.Subscribable<boolean>;
  value: ko.Subscribable<T | undefined>;
}
