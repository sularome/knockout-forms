import * as ko from 'knockout';

import { AbstractControl } from './AbstractControl';
import { IAbstractControl } from './Interfaces/IAbstractControl';
import { IValidate } from './Interfaces/IValidate';
import { IValidationResult } from './Interfaces/IValidationResult';
import { objectHasProperties } from './Utils';

export class FormGroup<T> extends AbstractControl<T> {
  public components: ko.Observable<Map<string, IAbstractControl<any>>> = ko.observable(new Map());
  public value: ko.Observable<T | undefined> = ko.observable();

  constructor(validators?: IValidate<T>[]) {
    super(validators || []);
  }

  protected calculateIsValid(): boolean {
    return !objectHasProperties(this.errors()) && Array.from(this.components().values()).every(c => c.valid());
  }

  public addControl<U>(name: string, control: IAbstractControl<U>): void {
    const oldMap: Map<string, IAbstractControl<U>> = this.components();
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
