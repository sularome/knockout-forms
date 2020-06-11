import { IAbstractControl } from './Interfaces/IAbstractControl';
import * as ko from 'knockout';
import { IValidate } from './Interfaces/IValidate';
import { IValidationResult } from './Interfaces/IValidationResult';
import { objectHasProperties } from './Utils';
import { FormControlParent } from './FormControlParent';
export class AbstractControl<T> implements IAbstractControl<T> {
  public dirty: ko.PureComputed<boolean> = ko.pureComputed(() => !this.pristine());
  public errors: ko.Observable<IValidationResult> = ko.observable({});
  public invalid: ko.PureComputed<boolean> = ko.pureComputed(() => !this.valid(), this);
  protected parent: IAbstractControl<T> | undefined;
  public pristine: ko.Observable<boolean> = ko.observable(true);
  public valid: ko.PureComputed<boolean> = ko.pureComputed(() => !objectHasProperties(this.errors()), this);
  public value: ko.Observable<T | undefined> = ko.observable();
  public validators: IValidate<T>[] = [];

  constructor(validators: IValidate<T>[]) {
    this.validators = validators;
  }

  protected setParent(control: FormControlParent<any>): void {
    this.parent = control;
  }
}
