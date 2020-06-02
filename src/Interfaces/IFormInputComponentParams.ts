import { IParser } from "./IParser";
import { IFormatter } from "./IFormatter";
import * as ko from "knockout";

export interface IFormInputComponentParams<T, U> {
    initialValue: ko.MaybeObservable<T>; 
    formatters?: IFormatter<T, U>[]; 
    parsers?: IParser<U, T>[];
    allowInvalid?: boolean;
}