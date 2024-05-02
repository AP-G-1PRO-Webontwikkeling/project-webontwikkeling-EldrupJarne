import { Product, Type } from "../interfaces/interfaces";

export function getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
}
export function getRandomNumbers(min: number, max: number, count: number): number[] {
    const result: number[] = [];
    while (result.length < count) {
        const randomNumber = getRandomNumber(min, max);
        if (!result.includes(randomNumber)) {
            result.push(randomNumber);
        }
    }
    return result;
}
export function compareProducts(a: Product, b: Product, sortParam: string): number {
    if (sortParam === 'type') {
        return a.type.typeName.localeCompare(b.type.typeName);
    } else if (typeof a[sortParam] === 'string' && typeof b[sortParam] === 'string') {
        return a[sortParam].localeCompare(b[sortParam]);
    } else if (typeof a[sortParam] === 'number' && typeof b[sortParam] === 'number') {
        return a[sortParam] - b[sortParam];
    } else {
        return a[sortParam] === b[sortParam] ? 0 : a[sortParam] === true && b[sortParam] === false ? -1 : 1;
    }
}
export function compareTypes(a: Type, b: Type, sortParam: string): number {
    if (sortParam === 'tags') {
        return a.tags.join("").localeCompare(b.tags.join(""));
    } else if (typeof a[sortParam] === 'string' && typeof b[sortParam] === 'string') {
        return a[sortParam].localeCompare(b[sortParam]);
    } else if (typeof a[sortParam] === 'number' && typeof b[sortParam] === 'number') {
        return a[sortParam] - b[sortParam];
    } else {
        return a[sortParam] === b[sortParam] ? 0 : a[sortParam] === true && b[sortParam] === false ? -1 : 1;
    }
}
export function toggleDirection(direction: string): string {
    if (direction === "0" || direction === "") {
        return "1";
    } else if (direction === "1") {
        return "2";
    } else {
        return "0";
    }
}
export function isValid(value: any): { isValid: boolean, errorCode?: "empty" | "to long" | "negative" } {

    if (typeof value === "string") {
        if (value === "") return { isValid: false, errorCode: "empty" }
        else if (value.length > 200) return { isValid: false, errorCode: "to long" }
        else return { isValid: true }
    } else if (typeof value === "number") {
        if (value < 0) return { isValid: false, errorCode: "negative" }
        else return { isValid: true }
    } else if (isOfType<Type>(value, value)) {
        // input: select so can never be wrong (unless i coded wrong)
        return { isValid: true }
    } else {
        // log value to know if i missed a check
        console.log(value);
        return { isValid: false }
    }
}
/**
 * a function to check if an abject is of a certain type <T>
 * @param obj the object
 * @param type the object again
 * @returns true if obj id of type <T>
 */
export function isOfType<T>(obj: any, type: { new(): T }): boolean {
    return typeof obj === typeof type;
}
