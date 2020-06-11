import * as Validators from './Validators';
import { FormControl } from '../FormControl';
describe('Validators', () => {
  describe('required', () => {
    it('should return error if view value is empty string', () => {
      expect(Validators.required(new FormControl({ initialValue: '' }))).toEqual(Validators.requiredError);
    });
    it('should return error if view value is null', () => {
      expect(Validators.required(new FormControl({ initialValue: null }))).toEqual(Validators.requiredError);
    });
    it('should return error if view value is undefined', () => {
      expect(Validators.required(new FormControl({ initialValue: undefined }))).toEqual(Validators.requiredError);
    });
    it('should return error if view value is NaN', () => {
      expect(Validators.required(new FormControl({ initialValue: NaN }))).toEqual(Validators.requiredError);
    });
    it('should return empty error object if view value is not empty string', () => {
      expect(Validators.required(new FormControl({ initialValue: 'test' }))).toEqual(Validators.emptyError);
    });
    it('should return empty error object if view value is number', () => {
      expect(Validators.required(new FormControl({ initialValue: 5 }))).toEqual(Validators.emptyError);
    });
  });
  describe('maxLength', () => {
    it('should be valid if value is empty', () => {
      expect(Validators.maxLength(5)(new FormControl({ initialValue: null }))).toEqual(Validators.emptyError);
      expect(Validators.maxLength(5)(new FormControl({ initialValue: undefined }))).toEqual(Validators.emptyError);
      expect(Validators.maxLength(5)(new FormControl({ initialValue: NaN }))).toEqual(Validators.emptyError);
      expect(Validators.maxLength(5)(new FormControl({ initialValue: 'test' }))).toEqual(Validators.emptyError);
    });
    it('should return error object if view value is number', () => {
      expect(Validators.maxLength(1)(new FormControl({ initialValue: '12' }))).toEqual(Validators.maxLengthError);
    });
    it('should return empty error object if view value length is less or equal to max length', () => {
      expect(Validators.maxLength(1)(new FormControl({ initialValue: '1' }))).toEqual(Validators.emptyError);
    });
    it('should return empty error object if view value is empty string', () => {
      expect(Validators.maxLength(1)(new FormControl({ initialValue: '' }))).toEqual(Validators.emptyError);
    });
  });
});
