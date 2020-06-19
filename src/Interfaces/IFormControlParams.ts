import * as ko from 'knockout';
import { IValidate } from './IValidate';

export interface IFormControlParams<T, U> {
  initialValue: ko.MaybeObservable<T>;
  validators?: IValidate<T>[];
}
