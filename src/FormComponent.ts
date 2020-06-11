import { IFormatter } from './Interfaces/IFormatter';
import * as ko from 'knockout';
import { IParser } from './Interfaces/IParser';
import { IFormComponentParams } from './Interfaces/IFormComponentParams';
import { right, isLeft, Either, chain } from './functionalHelpers/Either';
import { objectHasProperties } from './Utils';
import { IValidate } from './Interfaces/IValidate';
import { IValidationResult } from './Interfaces/IValidationResult';
import { IAbstractControl } from './Interfaces/IAbstractControl';

export const PARSE_ERROR_KEY: string = 'parse';

export class FormComponent<T = any, U = string> implements IAbstractControl {
  public errors: ko.Observable<IValidationResult> = ko.observable({});
  public pristine: ko.Observable<boolean> = ko.observable(true);
  public viewValue: ko.Observable<U>;
  public formatters: IFormatter<T, U>[] = [];
  public modelValue: ko.Observable<T | undefined>;
  public parsers: IParser<U, T>[] = [];
  public validators: IValidate<T, U>[] = [];
  public valid: ko.Computed<boolean> = ko.computed(() => !objectHasProperties(this.errors()), this);
  public invalid: ko.Computed<boolean> = ko.computed(() => !this.valid(), this);
  public dirty: ko.Computed<boolean> = ko.computed(() => !this.pristine());
  private subscriptions: ko.Subscription[] = [];
  private allowInvalid: boolean = false;

  constructor(params: IFormComponentParams<T, U>) {
    this.modelValue = ko.isObservable(params.initialValue)
                      ? params.initialValue
                      : ko.observable(params.initialValue);
    this.formatters = params.formatters || [];
    this.parsers = params.parsers || [];
    this.validators = params.validators || [];
    this.allowInvalid = !!params.allowInvalid;
    this.viewValue = ko.observable(this.transformModelValueToViewValue(this.modelValue()));
    this.subscriptions.push(this.viewValue.subscribe(this.onViewValueChange, this));
    this.subscriptions.push(this.modelValue.subscribe(this.onModelValueChange, this));
    this.runValidation();
  }

  public dispose(): void {
    delete this.modelValue;
    this.subscriptions.forEach(s => s.dispose());
  }

  private onViewValueChange(viewValue: U): void {
    const newValue: Either<string, T | undefined> = this.transformViewValueToModelValue(viewValue);
    if (isLeft(newValue)) {
      this.pristine(false);
      this.errors({ [PARSE_ERROR_KEY]: newValue.left });
      if (this.allowInvalid) {
        this.modelValue(void 0);
      }
    } else {
      this.errors({});
      if (newValue.right !== this.modelValue()) {
        this.modelValue(newValue.right);
        this.pristine(false);
      }
      this.runValidation();
    }
  }

  private onModelValueChange(modelValue: T | undefined): void {
    const newValue: U = this.transformModelValueToViewValue(modelValue);
    if (newValue !== this.viewValue()) {
      this.viewValue(newValue);
    }
  }

  private runValidation(): void {
    if (!this.hasParseErrors()) {
      const errors: IValidationResult = {};
      this.validators.reduce((pv, validator) => Object.assign(pv, validator(this.modelValue(), this.viewValue())), errors);
      this.errors(errors);
    }
  }

  private hasParseErrors(): boolean {
    return this.errors().hasOwnProperty(PARSE_ERROR_KEY);
  }

  private transformModelValueToViewValue(modelValue: T | undefined): U {
    return this.formatters.reduce<U>((pv, formatter) => formatter(pv), modelValue as any as U);
  }

  private transformViewValueToModelValue(viewValue: U): Either<string, T> {
    const reducer = (pv: Either<string, T>, parser: IParser<U, T>) => chain(pv, parser);
    const initialValue = right(viewValue) as any as Either<string, T>;
    return this.parsers.reduce<Either<string, T>>(reducer, initialValue);
  }
}
