export class FormInputComponent<T> {
    public value: T;
    constructor(initialValue: T) {
        this.value = initialValue;
    }
}