import { FormInputComponent } from "./FormInputComponent";

describe("FormInputComponent", () => {
    it("should be able to pass initial value", () => {
        const initialValue: number = 5;
        const component: FormInputComponent<number> = new FormInputComponent(initialValue);
        expect(component.value).toEqual(initialValue);
    });
});