export function objectHasProperties(object: Object): boolean {
    for (var prop in object) {
        if (object.hasOwnProperty(prop)) {
            return true;
        }
    }
    return false;
}