import { IParser } from './IParser';
import { IFormatter } from './IFormatter';
import * as ko from 'knockout';
import { IValidate } from './IValidate';

export interface IFormComponentParams<T, U> {
  initialValue: ko.MaybeObservable<T>;
  formatters?: IFormatter<T, U>[];
  parsers?: IParser<U, T>[];
  validators?: IValidate<T>[];
  allowInvalid?: boolean;
}
