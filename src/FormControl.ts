import * as ko from 'knockout';

import { AbstractControl } from './AbstractControl';
import { chain, Either, isLeft, right } from './functionalHelpers/Either';
import { IFormatter } from './Interfaces/IFormatter';
import { IFormControlParams } from './Interfaces/IFormControlParams';
import { IParser } from './Interfaces/IParser';
import { IValidationResult } from './Interfaces/IValidationResult';
import { objectHasProperties } from './Utils';

export const PARSE_ERROR_KEY: string = 'parse';

export class FormControl<T = any, U = string> extends AbstractControl<T> {
  public viewValue: ko.Observable<U>;
  public formatters: IFormatter<T, U>[] = [];
  public parsers: IParser<U, T>[] = [];
  public value: ko.Observable<T | undefined>;
  private subscriptions: ko.Subscription[] = [];
  private allowInvalid: boolean = false;

  constructor(params: IFormControlParams<T, U>) {
    super(params.validators || []);
    this.value = ko.isObservable(params.initialValue)
                      ? params.initialValue
                      : ko.observable(params.initialValue);
    this.formatters = params.formatters || [];
    this.parsers = params.parsers || [];
    this.allowInvalid = !!params.allowInvalid;
    this.viewValue = ko.observable(this.transformModelValueToViewValue(this.value()));
    this.subscriptions.push(this.viewValue.subscribe(this.onViewValueChange, this));
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

  private onViewValueChange(viewValue: U): void {
    const newValue: Either<string, T | undefined> = this.transformViewValueToModelValue(viewValue);
    if (isLeft(newValue)) {
      this.pristine(false);
      this.errors({ [PARSE_ERROR_KEY]: newValue.left });
      if (this.allowInvalid) {
        this.value(void 0);
      }
    } else {
      this.errors({});
      if (newValue.right !== this.value()) {
        this.value(newValue.right);
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
      this.validators.reduce((pv, validator) => Object.assign(pv, validator(this)), errors);
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
