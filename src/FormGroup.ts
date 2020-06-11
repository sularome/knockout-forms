import { IAbstractControl } from './Interfaces/IAbstractControl';
import * as ko from 'knockout';
import { objectHasProperties } from './Utils';
import { IValidationResult } from './Interfaces/IValidationResult';
import { IValidate } from './Interfaces/IValidate';
export class FormGroup<T> implements IAbstractControl<T> {
  public components: ko.Observable<Map<string, IAbstractControl<T>>> = ko.observable(new Map());
  public errors: ko.Observable<IValidationResult> = ko.observable({});
  public value: ko.Observable<T | undefined> = ko.observable();
  public validators: IValidate<T>[] = [];
  public invalid: ko.Computed<boolean> = ko.pureComputed(() => !this.valid());
  public valid: ko.Computed<boolean> = ko.pureComputed(() => !objectHasProperties(this.errors()));

  public addControl(name: string, control: IAbstractControl<T>): void {
    const oldMap: Map<string, IAbstractControl<T>> = this.components();
    oldMap.set(name, control);
    this.components(new Map(oldMap));
  }

  public contains(name: string): boolean {
    return this.components().has(name);
  }
}
