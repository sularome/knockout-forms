import { IAbstractControl } from './Interfaces/IAbstractControl';
import * as ko from 'knockout';
import { objectHasProperties } from './Utils';
import { IValidationResult } from './Interfaces/IValidationResult';
export class FormGroup<T> implements IAbstractControl {
  public valid: ko.Computed<boolean> = ko.pureComputed(() => !objectHasProperties(this.errors()));
  public invalid: ko.Computed<boolean> = ko.pureComputed(() => !this.valid());
  public errors: ko.Computed<IValidationResult> = ko.pureComputed(() => this.internalErrors());
  private internalErrors: ko.Observable<IValidationResult> = ko.observable({});
  public components: ko.Observable<Map<string, IAbstractControl>> = ko.observable(new Map());

  public addControl(name: string, control: IAbstractControl): void {
    const oldMap: Map<string, IAbstractControl> = this.components();
    oldMap.set(name, control);
    this.components(new Map(oldMap));
  }

  public contains(name: string): boolean {
    return this.components().has(name);
  }
}
