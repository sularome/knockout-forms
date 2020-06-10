import * as Validators from './Validators';
describe('Validators', () => {
  describe('required', () => {
    it('should return error if view value is empty string', () => {
      expect(Validators.required(null, '')).toEqual(Validators.requiredError);
    });
    it('should return error if view value is null', () => {
      expect(Validators.required(null, null)).toEqual(Validators.requiredError);
    });
    it('should return error if view value is undefined', () => {
      expect(Validators.required(null, undefined)).toEqual(Validators.requiredError);
    });
    it('should return error if view value is NaN', () => {
      expect(Validators.required(null, NaN)).toEqual(Validators.requiredError);
    });
    it('should return empty error object if view value is not empty string', () => {
      expect(Validators.required(null, 'test')).toEqual(Validators.emptyError);
    });
    it('should return empty error object if view value is number', () => {
      expect(Validators.required(null, 5)).toEqual(Validators.emptyError);
    });
  });
  describe('maxLength', () => {
    it('should be valid if value is empty', () => {
      expect(Validators.maxLength(5)(null, null)).toEqual(Validators.emptyError);
      expect(Validators.maxLength(5)(null, undefined)).toEqual(Validators.emptyError);
      expect(Validators.maxLength(5)(null, NaN)).toEqual(Validators.emptyError);
      expect(Validators.maxLength(5)(null, 'test')).toEqual(Validators.emptyError);
    });
    it('should return error object if view value is number', () => {
      expect(Validators.maxLength(1)(null, '12')).toEqual(Validators.maxLengthError);
    });
    it('should return empty error object if view value length is less or equal to max length', () => {
      expect(Validators.maxLength(1)(null, '1')).toEqual(Validators.emptyError);
    });
    it('should return empty error object if view value is empty string', () => {
      expect(Validators.maxLength(1)(null, '')).toEqual(Validators.emptyError);
    });
  });
});
