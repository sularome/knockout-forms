import { FormComponent } from "./FormComponent";
import { IFormatter } from "./Interfaces/IFormatter";
import * as ko from "knockout";
import { IParser } from "./Interfaces/IParser";
import { right, left } from "./functionalHelpers/Either";

describe("FormComponent", () => {
    it("should be able to pass initial value", () => {
        const initialValue: number = 5;
        const component: FormComponent<number, number> = new FormComponent({ initialValue: initialValue });
        expect(component.modelValue()).toEqual(initialValue);
    });
    it("should be able to pass observable as initial value", () => {
        const initialValue: ko.Observable<number> = ko.observable(5);
        const component: FormComponent<number, number> = new FormComponent({ initialValue: initialValue });
        expect(component.modelValue).toEqual(initialValue);
    });
    it("should set view value to initial value if no formatters", () => {
        const initialValue: number = 5;
        const component: FormComponent<number, number> = new FormComponent({ initialValue: initialValue });
        expect(component.viewValue()).toEqual(initialValue);
    });
    it("should update model value if viewValue changes", () => {
        const initialValue: number = 5;
        const expectedValue: number = 10;
        const component: FormComponent<number, number> = new FormComponent({ initialValue: initialValue });
        component.viewValue(expectedValue);
        expect(component.modelValue()).toEqual(expectedValue);
    });
    it("should format initial value using formatters", () => {
        const initialValue: number = 5;
        const formatter: IFormatter<number, string> = (v) => v === void 0 ? "" : v.toString();
        const component: FormComponent<number, string> = new FormComponent({ initialValue: initialValue, formatters: [formatter] });
        expect(component.viewValue()).toEqual(initialValue.toString());
    });
    it("should not change model value if change in viewValue didn't change", () => {
        const initialValue: number = 5;
        const modelValue: ko.Observable<number> = ko.observable(initialValue).extend({notify: "always"});
        const component: FormComponent<number, number> = new FormComponent({ initialValue: modelValue });
        const onModelValueChangedSpy: jasmine.Spy = jasmine.createSpy();
        modelValue.subscribe(onModelValueChangedSpy);
        component.viewValue(initialValue)
        expect(onModelValueChangedSpy).not.toHaveBeenCalled();
    });
    it("should parse view value to update model value", () => {
        const initialValue: number = 5;
        const parser: IParser<string, number> = (v) => right(parseInt(v.toString(), 10));
        const component: FormComponent<number, string> = new FormComponent({ initialValue: initialValue, parsers: [parser] });
        component.viewValue("10");
        expect(component.modelValue()).toEqual(10);
    });
    it("if a parser cannot parse a value the model value should stay untouched", () => {
        const initialValue: number = 5;
        const parser: IParser<string, number> = (v) => left("Error");
        const component: FormComponent<number, string> = new FormComponent({ initialValue: initialValue, parsers: [parser] });
        component.viewValue("10");
        expect(component.modelValue()).toEqual(initialValue);
    });
    it("if a parser cannot parse a value the model value should be set to undefined if allowInvalid flag is true", () => {
        const initialValue: number = 5;
        const parser: IParser<string, number> = (v) => left("Error");
        const component: FormComponent<number, string> = new FormComponent({ initialValue: initialValue, parsers: [parser], allowInvalid: true });
        component.viewValue("10");
        expect(component.modelValue()).toBeUndefined();
    });
    it("if a parser cannot parse a value errors object should have property parse with message the error that was returned by the parser", () => {
        const initialValue: number = 5;
        const parser: IParser<string, number> = (v) => left("Error");
        const component: FormComponent<number, string> = new FormComponent({ initialValue: initialValue, parsers: [parser], allowInvalid: true });
        component.viewValue("10");
        expect(component.errors()).toEqual({parse: "Error"});
    });
    it("should set control to pristine if user hasn't interacted with the control", () => {
        const initialValue: number = 5;
        const parser: IParser<string, number> = (v) => left("Error");
        const component: FormComponent<number, string> = new FormComponent({ initialValue: initialValue, parsers: [parser], allowInvalid: true });
        expect(component.pristine()).toEqual(true);
    });
    it("change in viewValue should set control to not pristine", () => {
        const initialValue: number = 5;
        const parser: IParser<string, number> = (v) => right(0);
        const component: FormComponent<number, string> = new FormComponent({ initialValue: initialValue, parsers: [parser], allowInvalid: true });
        component.viewValue("10");
        expect(component.pristine()).toEqual(false);
    });
    it("change in viewValue should set control to not pristine even if there is an error", () => {
        const initialValue: number = 5;
        const parser: IParser<string, number> = (v) => left("Error");
        const component: FormComponent<number, string> = new FormComponent({ initialValue: initialValue, parsers: [parser], allowInvalid: true });
        component.viewValue("10");
        expect(component.pristine()).toEqual(false);
    });
    it("should set control to not dirty if user hasn't interacted with the control", () => {
        const initialValue: number = 5;
        const parser: IParser<string, number> = (v) => left("Error");
        const component: FormComponent<number, string> = new FormComponent({ initialValue: initialValue, parsers: [parser], allowInvalid: true });
        expect(component.dirty()).toEqual(false);
    });
    it("change in viewValue should set control to dirty", () => {
        const initialValue: number = 5;
        const parser: IParser<string, number> = (v) => right(0);
        const component: FormComponent<number, string> = new FormComponent({ initialValue: initialValue, parsers: [parser], allowInvalid: true });
        component.viewValue("10");
        expect(component.dirty()).toEqual(true);
    });
    it("change in viewValue should set control to dirty even if there is an error", () => {
        const initialValue: number = 5;
        const parser: IParser<string, number> = (v) => left("Error");
        const component: FormComponent<number, string> = new FormComponent({ initialValue: initialValue, parsers: [parser], allowInvalid: true });
        component.viewValue("10");
        expect(component.dirty()).toEqual(true);
    });
    it("should be valid if no errors", () => {
        const initialValue: number = 5;
        const parser: IParser<string, number> = (v) => right(0);
        const component: FormComponent<number, string> = new FormComponent({ initialValue: initialValue, parsers: [parser], allowInvalid: true });
        component.viewValue("10");
        expect(component.valid()).toEqual(true);
        expect(component.invalid()).toEqual(false);
    });
    it("should be invalid if there are errors", () => {
        const initialValue: number = 5;
        const parser: IParser<string, number> = (v) => left("Error");
        const component: FormComponent<number, string> = new FormComponent({ initialValue: initialValue, parsers: [parser], allowInvalid: true });
        component.viewValue("10");
        expect(component.valid()).toEqual(false);
        expect(component.invalid()).toEqual(true);
    });
});