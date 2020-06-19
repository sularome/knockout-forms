import * as ko from 'knockout';
import { IValidate } from './Interfaces/IValidate';
import { IValidationResult } from './Interfaces/IValidationResult';
import { FormControlParent } from './FormControlParent';
export abstract class AbstractControl<T> {
  public dirty: ko.PureComputed<boolean> = ko.pureComputed(() => !this.pristine());
  public errors: ko.Observable<IValidationResult> = ko.observable({});
  public invalid: ko.PureComputed<boolean> = ko.pureComputed(() => !this.valid(), this);
  protected parent: AbstractControl<T> | undefined;
  public pristine: ko.Observable<boolean> = ko.observable(true);
  public valid: ko.PureComputed<boolean> = ko.pureComputed(() => this.calculateIsValid(), this);
  public abstract value: ko.Subscribable<T | undefined>;
  public validators: IValidate<T>[] = [];

  constructor(validators: IValidate<T>[]) {
    this.validators = validators;
  }

  protected abstract calculateIsValid(): boolean;

  public setParent(control: FormControlParent<any>): void {
    this.parent = control;
  }

  public setErrors(errors: IValidationResult): void {
    this.errors(errors);
  }
}
