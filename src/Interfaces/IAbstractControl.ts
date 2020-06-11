import { IValidationResult } from './IValidationResult';
export interface IAbstractControl<T> {
  value: ko.Subscribable<T | undefined>;
  valid: ko.Subscribable<boolean>;
  invalid: ko.Subscribable<boolean>;
  errors: ko.Subscribable<IValidationResult>;
}
