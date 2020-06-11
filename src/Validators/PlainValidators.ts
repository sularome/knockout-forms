export function isEmptyValue(value: any): boolean {
  return value === void 0 || value === null || value === '' || (typeof value === 'number' && isNaN(value));
}
