import { IFormatter } from "./Interfaces/IFormatter";
import * as ko from "knockout";
import { IParser } from "./Interfaces/IParser";
import { IFormInputComponentParams } from "./Interfaces/IFormInputComponentParams";

export class FormInputComponent<T, U> {
    public modelValue: ko.Observable<T>;
    public viewValue: ko.Observable<U>;
    public formatters: IFormatter<T, U>[] = []; 
    public parsers: IParser<U, T>[] = []; 
    private subscriptions: ko.Subscription[] = [];

    constructor(params: IFormInputComponentParams<T, U>) {
        this.modelValue = ko.isObservable(params.initialValue) ? params.initialValue : ko.observable(params.initialValue);
        this.formatters = params.formatters || [];
        this.parsers = params.parsers || [];
        this.viewValue = ko.observable(this.transformModelValueToViewValue(this.modelValue()));
        this.subscriptions.push(this.viewValue.subscribe(this.onViewValueChange, this));
        this.subscriptions.push(this.modelValue.subscribe(this.onModelValueChange, this));
    }

    public dispose(): void {
        delete this.modelValue;
        this.subscriptions.forEach(s => s.dispose());
    }

    private onViewValueChange(viewValue: U): void {
        const newValue: T = this.transformViewValueToModelValue(viewValue);
        if(newValue !== this.modelValue()) {
            this.modelValue(newValue);
        }
    }

    private onModelValueChange(modelValue: T): void {
        const newValue: U = this.transformModelValueToViewValue(modelValue);
        if(newValue !== this.viewValue()) {
            this.viewValue(newValue);
        }
    }

    private transformModelValueToViewValue(modelValue: T): U {
        return this.formatters.reduce<U>((pv, formatter) => formatter(pv), modelValue as any as U);
    }

    private transformViewValueToModelValue(viewValue: U): T {
        return this.parsers.reduce<T>((pv, parser) => parser(pv), viewValue as any as T);
    }
    
}