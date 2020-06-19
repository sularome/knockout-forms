import * as ko from 'knockout';

import { AbstractControl } from './AbstractControl';
import { IFormControlParams } from './Interfaces/IFormControlParams';
import { IValidationResult } from './Interfaces/IValidationResult';
import { objectHasProperties } from './Utils';

export class FormControl<T = any, U = string> extends AbstractControl<T> {
  public value: ko.Observable<T | undefined>;
  private subscriptions: ko.Subscription[] = [];

  constructor(params: IFormControlParams<T, U>) {
    super(params.validators || []);
    this.value = ko.isObservable(params.initialValue)
                      ? params.initialValue
                      : ko.observable(params.initialValue);
    this.subscriptions.push(this.value.subscribe(this.onModelValueChange, this));
    this.runValidation();
  }

  protected calculateIsValid(): boolean {
    return !objectHasProperties(this.errors());
  }

  public dispose(): void {
    delete this.value;
    this.subscriptions.forEach(s => s.dispose());
  }

  private onModelValueChange(modelValue: T | undefined): void {
    this.pristine(false);
    this.runValidation();
  }

  private runValidation(): void {
    const errors: IValidationResult = {};
    this.validators.reduce((pv, validator) => Object.assign(pv, validator(this)), errors);
    this.errors(errors);
  }
}
