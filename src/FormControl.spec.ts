import { FormControl } from './FormControl';
import { IFormatter } from './Interfaces/IFormatter';
import * as ko from 'knockout';
import { IParser } from './Interfaces/IParser';
import { right, left } from './functionalHelpers/Either';
import { IFormControlParams } from './Interfaces/IFormControlParams';
import { IValidate } from './Interfaces/IValidate';
import { IValidationResult } from './Interfaces/IValidationResult';
import { FormGroup } from './FormGroup';

describe('FormControl', () => {
  it('should be able to pass initial value', () => {
    const initialValue: number = 5;
    const component: FormControl<number, number> = new FormControl({ initialValue });
    expect(component.value()).toEqual(initialValue);
  });
  it('should be able to pass observable as initial value', () => {
    const initialValue: ko.Observable<number> = ko.observable(5);
    const component: FormControl<number, number> = new FormControl({ initialValue });
    expect(component.value).toEqual(initialValue);
  });
  it('should set view value to initial value if no formatters', () => {
    const initialValue: number = 5;
    const component: FormControl<number, number> = new FormControl({ initialValue });
    expect(component.viewValue()).toEqual(initialValue);
  });
  it('should update model value if viewValue changes', () => {
    const initialValue: number = 5;
    const expectedValue: number = 10;
    const component: FormControl<number, number> = new FormControl({ initialValue });
    component.viewValue(expectedValue);
    expect(component.value()).toEqual(expectedValue);
  });
  it('should format initial value using formatters', () => {
    const initialValue: number = 5;
    const formatter: IFormatter<number, string> = v => v === void 0 ? '' : v.toString();
    const parameters: IFormControlParams<number, string> = { initialValue, formatters: [formatter] };
    const component: FormControl<number, string> = new FormControl(parameters);
    expect(component.viewValue()).toEqual(initialValue.toString());
  });
  it('should not change model value if change in viewValue didn\'t change', () => {
    const initialValue: number = 5;
    const modelValue: ko.Observable<number> = ko.observable(initialValue).extend({ notify: 'always' });
    const component: FormControl<number, number> = new FormControl({ initialValue: modelValue });
    const onModelValueChangedSpy: jasmine.Spy = jasmine.createSpy();
    modelValue.subscribe(onModelValueChangedSpy);
    component.viewValue(initialValue);
    expect(onModelValueChangedSpy).not.toHaveBeenCalled();
  });
  it('should parse view value to update model value', () => {
    const initialValue: number = 5;
    const parser: IParser<string, number> = v => right(parseInt(v.toString(), 10));
    const component: FormControl<number, string> = new FormControl({ initialValue, parsers: [parser] });
    component.viewValue('10');
    expect(component.value()).toEqual(10);
  });
  it('if a parser cannot parse a value the model value should stay untouched', () => {
    const initialValue: number = 5;
    const parser: IParser<string, number> = v => left('Error');
    const component: FormControl<number, string> = new FormControl({ initialValue, parsers: [parser] });
    component.viewValue('10');
    expect(component.value()).toEqual(initialValue);
  });
  it('if a parser cannot parse a value the model value should be set to undefined if allowInvalid flag is true', () => {
    const initialValue: number = 5;
    const parser: IParser<string, number> = v => left('Error');
    const component: FormControl<number, string> = new FormControl({ initialValue, parsers: [parser], allowInvalid: true });
    component.viewValue('10');
    expect(component.value()).toBeUndefined();
  });
  // tslint:disable-next-line: max-line-length
  it('if a parser cannot parse a value errors object should have property parse with message the error that was returned by the parser', () => {
    const initialValue: number = 5;
    const parser: IParser<string, number> = v => left('Error');
    const component: FormControl<number, string> = new FormControl({ initialValue, parsers: [parser], allowInvalid: true });
    component.viewValue('10');
    expect(component.errors()).toEqual({ parse: 'Error' });
  });
  it('should set control to pristine if user hasn\'t interacted with the control', () => {
    const initialValue: number = 5;
    const parser: IParser<string, number> = v => left('Error');
    const component: FormControl<number, string> = new FormControl({ initialValue, parsers: [parser], allowInvalid: true });
    expect(component.pristine()).toEqual(true);
  });
  it('change in viewValue should set control to not pristine', () => {
    const initialValue: number = 5;
    const parser: IParser<string, number> = v => right(0);
    const component: FormControl<number, string> = new FormControl({ initialValue, parsers: [parser], allowInvalid: true });
    component.viewValue('10');
    expect(component.pristine()).toEqual(false);
  });
  it('change in viewValue should set control to not pristine even if there is an error', () => {
    const initialValue: number = 5;
    const parser: IParser<string, number> = v => left('Error');
    const component: FormControl<number, string> = new FormControl({ initialValue, parsers: [parser], allowInvalid: true });
    component.viewValue('10');
    expect(component.pristine()).toEqual(false);
  });
  it('should set control to not dirty if user hasn\'t interacted with the control', () => {
    const initialValue: number = 5;
    const parser: IParser<string, number> = v => left('Error');
    const component: FormControl<number, string> = new FormControl({ initialValue, parsers: [parser], allowInvalid: true });
    expect(component.dirty()).toEqual(false);
  });
  it('change in viewValue should set control to dirty', () => {
    const initialValue: number = 5;
    const parser: IParser<string, number> = v => right(0);
    const component: FormControl<number, string> = new FormControl({ initialValue, parsers: [parser], allowInvalid: true });
    component.viewValue('10');
    expect(component.dirty()).toEqual(true);
  });
  it('change in viewValue should set control to dirty even if there is an error', () => {
    const initialValue: number = 5;
    const parser: IParser<string, number> = v => left('Error');
    const component: FormControl<number, string> = new FormControl({ initialValue, parsers: [parser], allowInvalid: true });
    component.viewValue('10');
    expect(component.dirty()).toEqual(true);
  });
  it('should be valid if no errors', () => {
    const initialValue: number = 5;
    const parser: IParser<string, number> = v => right(0);
    const component: FormControl<number, string> = new FormControl({ initialValue, parsers: [parser], allowInvalid: true });
    component.viewValue('10');
    expect(component.valid()).toEqual(true);
    expect(component.invalid()).toEqual(false);
  });
  it('should be invalid if there are errors', () => {
    const initialValue: number = 5;
    const parser: IParser<string, number> = v => left('Error');
    const component: FormControl<number, string> = new FormControl({ initialValue, parsers: [parser], allowInvalid: true });
    component.viewValue('10');
    expect(component.valid()).toEqual(false);
    expect(component.invalid()).toEqual(true);
  });
  it('should be able to pass validator which should update error object if the value is not valid', () => {
    const initialValue: number = 5;
    const validator: IValidate<number> = () => ({ testError: 'Error' });
    const component: FormControl<number, string> = new FormControl({ initialValue, validators: [validator] });
    expect(component.valid()).toEqual(false);
    expect(component.invalid()).toEqual(true);
    expect(component.errors()).toEqual({ testError: 'Error' });
  });
  it('should not run validators if view value cannot be parsed', () => {
    const initialValue: number = 5;
    const spy: jasmine.Spy = jasmine.createSpy();
    const parsers: IParser<string, number>[] = [v => left('Error')];
    const component: FormControl<number, string> = new FormControl({ initialValue, parsers, validators: [spy] });
    spy.calls.reset();
    component.viewValue('10');
    expect(spy).not.toHaveBeenCalled();
  });
  it('should mark value as valid if first invalid and after set to valid', () => {
    const initialValue: number = 5;
    const error: IValidationResult = { testError: 'Error' };
    const validator: IValidate<number> = c => c.value() === initialValue ? error : {};
    const component: FormControl<number, number> = new FormControl({ initialValue, validators: [validator] });
    expect(component.errors()).toEqual({ testError: 'Error' });
    component.viewValue(10);
    expect(component.errors()).toEqual({ });
  });
  it('should be able to set errors manually', () => {
    const component: FormControl<number, number> = new FormControl({ initialValue: 0 });
    component.setErrors({ someError: 'Some error' });
    expect(component.errors()).toEqual({ someError: 'Some error' });
  });
  it('should allow the user to set errors manually and the control should be invalid', () => {
    const component: FormControl<number, number> = new FormControl({ initialValue: 0 });
    component.setErrors({ someError: 'Some error' });
    expect(component.invalid()).toEqual(true);
  });
  it('should allow the user to set errors manually and the parent should also be marked as invalid', () => {
    const component: FormControl<number, number> = new FormControl({ initialValue: 0 });
    const parent: FormGroup<{ component: number }> = new FormGroup();
    parent.addControl('component', component);
    component.setErrors({ someError: 'Some error' });
    expect(parent.invalid()).toEqual(true);
  });
});
