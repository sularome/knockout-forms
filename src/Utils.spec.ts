import { objectHasProperties } from "./Utils";

describe("Utils", () => {
    describe("objectHasProperties", () => {
        it("should return true if object has any own properties", () => {
            expect(objectHasProperties({a: 1})).toEqual(true);
        });
        it("should return false if object has NO own properties", () => {
            expect(objectHasProperties({})).toEqual(false);
        });
    });
});