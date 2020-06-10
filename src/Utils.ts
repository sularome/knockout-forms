export function objectHasProperties(object: Object): boolean {
  for (const prop in object) {
    if (object.hasOwnProperty(prop)) {
      return true;
    }
  }
  return false;
}
