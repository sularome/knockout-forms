import { IFormatter } from "./Interfaces/IFormatter";
import * as ko from "knockout";
import { IParser } from "./Interfaces/IParser";
import { IFormComponentParams } from "./Interfaces/IFormComponentParams";
import { right, isLeft, Either, chain } from "./functionalHelpers/Either";

export class FormComponent<T = any, U = string> {
    public modelValue: ko.Observable<T | undefined>;
    public viewValue: ko.Observable<U>;
    public formatters: IFormatter<T, U>[] = []; 
    public parsers: IParser<U, T>[] = []; 
    public errors: ko.Observable<Object> = ko.observable({}); 
    private subscriptions: ko.Subscription[] = [];
    private allowInvalid: boolean = false;

    constructor(params: IFormComponentParams<T, U>) {
        this.modelValue = ko.isObservable(params.initialValue) ? params.initialValue : ko.observable(params.initialValue);
        this.formatters = params.formatters || [];
        this.parsers = params.parsers || [];
        this.allowInvalid = !!params.allowInvalid;
        this.viewValue = ko.observable(this.transformModelValueToViewValue(this.modelValue()));
        this.subscriptions.push(this.viewValue.subscribe(this.onViewValueChange, this));
        this.subscriptions.push(this.modelValue.subscribe(this.onModelValueChange, this));
    }

    public dispose(): void {
        delete this.modelValue;
        this.subscriptions.forEach(s => s.dispose());
    }

    private onViewValueChange(viewValue: U): void {
        const newValue: Either<string, T | undefined> = this.transformViewValueToModelValue(viewValue);
        if (isLeft(newValue)) {
            this.errors(Object.assign({}, this.errors(), {parse: newValue.left}));
            if (this.allowInvalid) {
                this.modelValue(void 0);
            }
        } else {
            if(newValue.right !== this.modelValue()) {
                this.modelValue(newValue.right);
            }
        }
    }

    private onModelValueChange(modelValue: T | undefined): void {
        const newValue: U = this.transformModelValueToViewValue(modelValue);
        if(newValue !== this.viewValue()) {
            this.viewValue(newValue);
        }
    }

    private transformModelValueToViewValue(modelValue: T | undefined): U {
        return this.formatters.reduce<U>((pv, formatter) => formatter(pv), modelValue as any as U);
    }

    private transformViewValueToModelValue(viewValue: U): Either<string, T> {
        return this.parsers.reduce<Either<string, T>>((pv, parser) => chain(pv, parser), right(viewValue) as any as Either<string, T>);
    }
    
}