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
export { getRandomNumber, getRandomNumbers }