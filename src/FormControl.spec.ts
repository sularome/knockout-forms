import { FormControl } from './FormControl';
import * as ko from 'knockout';
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
  it('should set control to pristine if user hasn\'t interacted with the control', () => {
    const initialValue: number = 5;
    const component: FormControl<number, string> = new FormControl({ initialValue });
    expect(component.pristine()).toEqual(true);
  });
  it('change in value should set control to not pristine', () => {
    const initialValue: number = 5;
    const component: FormControl<number, string> = new FormControl({ initialValue });
    component.value(10);
    expect(component.pristine()).toEqual(false);
  });
  it('change in value should set control to not pristine even if there is an error', () => {
    const initialValue: number = 5;
    const component: FormControl<number, string> = new FormControl({ initialValue });
    component.value(10);
    expect(component.pristine()).toEqual(false);
  });
  it('should set control to not dirty if user hasn\'t interacted with the control', () => {
    const initialValue: number = 5;
    const component: FormControl<number, string> = new FormControl({ initialValue });
    expect(component.dirty()).toEqual(false);
  });
  it('change in value should set control to dirty', () => {
    const initialValue: number = 5;
    const component: FormControl<number, string> = new FormControl({ initialValue });
    component.value(10);
    expect(component.dirty()).toEqual(true);
  });
  it('change in alue should set control to dirty even if there is an error', () => {
    const initialValue: number = 5;
    const validator: IValidate<number> = () => ({ error: 'Error' });
    const component: FormControl<number, string> = new FormControl({ initialValue, validators: [validator] });
    component.value(10);
    expect(component.dirty()).toEqual(true);
  });
  it('should be valid if no errors', () => {
    const initialValue: number = 5;
    const component: FormControl<number, string> = new FormControl({ initialValue });
    component.value(10);
    expect(component.valid()).toEqual(true);
    expect(component.invalid()).toEqual(false);
  });
  it('should be invalid if there are errors', () => {
    const initialValue: number = 5;
    const validator: IValidate<number> = () => ({ error: 'Error' });
    const component: FormControl<number, string> = new FormControl({ initialValue, validators: [validator] });
    component.value(10);
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
  it('should mark value as valid if first invalid and after set to valid', () => {
    const initialValue: number = 5;
    const error: IValidationResult = { testError: 'Error' };
    const validator: IValidate<number> = c => c.value() === initialValue ? error : {};
    const component: FormControl<number, number> = new FormControl({ initialValue, validators: [validator] });
    expect(component.errors()).toEqual({ testError: 'Error' });
    component.value(10);
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
