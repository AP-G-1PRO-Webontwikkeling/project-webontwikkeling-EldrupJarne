import { Product, Type } from "../interfaces/interfaces";

function getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
}
function getRandomNumbers(min: number, max: number, count: number): number[] {
    const result: number[] = [];
    while (result.length < count) {
        const randomNumber = getRandomNumber(min, max);
        if (!result.includes(randomNumber)) {
            result.push(randomNumber);
        }
    }
    return result;
}
function compareProducts(a: Product, b: Product, sortParam: string): number {
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
function compareTypes(a: Type, b: Type, sortParam: string): number {
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
function toggleDirection(direction: string): string {
    if (direction === "0" || direction === "") {
        return "1";
    } else if (direction === "1") {
        return "2";
    } else {
        return "0";
    }
}
export { getRandomNumber, getRandomNumbers, compareProducts, compareTypes, toggleDirection }