import * as ko from 'knockout';

import { AbstractControl } from './AbstractControl';
import { IAbstractControl } from './Interfaces/IAbstractControl';
import { IValidate } from './Interfaces/IValidate';
import { IValidationResult } from './Interfaces/IValidationResult';

export class FormGroup<T> extends AbstractControl<T> {
  public components: ko.Observable<Map<string, IAbstractControl<T>>> = ko.observable(new Map());
  public value: ko.Observable<T | undefined> = ko.observable();

  constructor(validators?: IValidate<T>[]) {
    super(validators || []);
  }

  public addControl(name: string, control: IAbstractControl<T>): void {
    const oldMap: Map<string, IAbstractControl<T>> = this.components();
    oldMap.set(name, control);
    this.components(new Map(oldMap));
    this.runValidation();
  }

  public contains(name: string): boolean {
    return this.components().has(name);
  }

  private runValidation(): void {
    const errors: IValidationResult = {};
    this.validators.reduce((pv, validator) => Object.assign(pv, validator(this)), errors);
    this.errors(errors);
  }
}
