import { FormInputComponent } from "./FormInputComponent";
import { IFormatter } from "./Interfaces/IFormatter";
import * as ko from "knockout";
import { IParser } from "./Interfaces/IParser";
import { right, left } from "./functionalHelpers/Either";

describe("FormInputComponent", () => {
    it("should be able to pass initial value", () => {
        const initialValue: number = 5;
        const component: FormInputComponent<number, number> = new FormInputComponent({ initialValue: initialValue });
        expect(component.modelValue()).toEqual(initialValue);
    });
    it("should be able to pass observable as initial value", () => {
        const initialValue: ko.Observable<number> = ko.observable(5);
        const component: FormInputComponent<number, number> = new FormInputComponent({ initialValue: initialValue });
        expect(component.modelValue).toEqual(initialValue);
    });
    it("should set view value to initial value if no formatters", () => {
        const initialValue: number = 5;
        const component: FormInputComponent<number, number> = new FormInputComponent({ initialValue: initialValue });
        expect(component.viewValue()).toEqual(initialValue);
    });
    it("should update model value if viewValue changes", () => {
        const initialValue: number = 5;
        const expectedValue: number = 10;
        const component: FormInputComponent<number, number> = new FormInputComponent({ initialValue: initialValue });
        component.viewValue(expectedValue);
        expect(component.modelValue()).toEqual(expectedValue);
    });
    it("should format initial value using formatters", () => {
        const initialValue: number = 5;
        const formatter: IFormatter<number, string> = (v) => v === void 0 ? "" : v.toString();
        const component: FormInputComponent<number, string> = new FormInputComponent({ initialValue: initialValue, formatters: [formatter] });
        expect(component.viewValue()).toEqual(initialValue.toString());
    });
    it("should not change model value if change in viewValue didn't change", () => {
        const initialValue: number = 5;
        const modelValue: ko.Observable<number> = ko.observable(initialValue).extend({notify: "always"});
        const component: FormInputComponent<number, number> = new FormInputComponent({ initialValue: modelValue });
        const onModelValueChangedSpy: jasmine.Spy = jasmine.createSpy();
        modelValue.subscribe(onModelValueChangedSpy);
        component.viewValue(initialValue)
        expect(onModelValueChangedSpy).not.toHaveBeenCalled();
    });
    it("should parse view value to update model value", () => {
        const initialValue: number = 5;
        const parser: IParser<string, number> = (v) => right(parseInt(v.toString(), 10));
        const component: FormInputComponent<number, string> = new FormInputComponent({ initialValue: initialValue, parsers: [parser] });
        component.viewValue("10");
        expect(component.modelValue()).toEqual(10);
    });
    it("if a parser cannot parse a value the model value should stay untouched", () => {
        const initialValue: number = 5;
        const parser: IParser<string, number> = (v) => left("Error");
        const component: FormInputComponent<number, string> = new FormInputComponent({ initialValue: initialValue, parsers: [parser] });
        component.viewValue("10");
        expect(component.modelValue()).toEqual(initialValue);
    });
    it("if a parser cannot parse a value the model value should be set to undefined if allowInvalid flag is true", () => {
        const initialValue: number = 5;
        const parser: IParser<string, number> = (v) => left("Error");
        const component: FormInputComponent<number, string> = new FormInputComponent({ initialValue: initialValue, parsers: [parser], allowInvalid: true });
        component.viewValue("10");
        expect(component.modelValue()).toBeUndefined();
    });
    it("if a parser cannot parse a value errors object should have property parse with message the error that was returned by the parser", () => {
        const initialValue: number = 5;
        const parser: IParser<string, number> = (v) => left("Error");
        const component: FormInputComponent<number, string> = new FormInputComponent({ initialValue: initialValue, parsers: [parser], allowInvalid: true });
        component.viewValue("10");
        expect(component.errors()).toEqual({parse: "Error"});
    });
});