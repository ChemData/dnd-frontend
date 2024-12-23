export function replaceAll(str, search, replacement) {
    const searchRegex = new RegExp(search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g');
    return str.replace(searchRegex, replacement);
}


/**
 * Shuffles an array in place using the Fisher-Yates algorithm.
 * @template T The type of elements in the array.
 * @param {[]} array - The array to shuffle.
 * @returns {[]} The shuffled array.
 */
export function shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
    }
    return array;
}


export function stringHash(str: string, seed:number = 0) {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for(let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1  = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2  = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}


/**
 * Makes a random choice from an array based on provided weights.
 *
 * @template T
 * @param {T[]} options - An array of options to choose from.
 * @param {number[]} weights - An array of weights corresponding to the options. Must have the same length as `options`.
 * @returns {T} - A randomly selected element from `options` based on the weights.
 * @throws {Error} If the lengths of `options` and `weights` do not match, or if `weights` contains non-positive values.
 */
export function choice<T>(options: T[], weights?: number[]): T {
    if (! weights){
        weights = Array(options.length).fill(1)
    }
    if (options.length !== weights.length) {
        throw new Error("The length of options and weights must match.");
    }

    if (weights.some(weight => weight <= 0)) {
        throw new Error("All weights must be positive numbers.");
    }

    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    const threshold = Math.random() * totalWeight;

    let cumulativeWeight = 0;
    for (let i = 0; i < options.length; i++) {
        cumulativeWeight += weights[i];
        if (threshold <= cumulativeWeight) {
            return options[i];
        }
    }

    // Fallback in case of unexpected behavior
    throw new Error("Unable to select an option. This should not happen.");
}

/**
 * Rolls a set of dice based on the input string and returns the total sum.
 *
 * The input string must be in the format 'MdN+P', where:
 * - M is the number of dice to roll (e.g., 2 for two dice).
 * - N is the size of the dice (e.g., 6 for a six-sided die).
 * - P is an optional constant to add to the result (e.g., +3).
 *
 * Examples:
 * - '2d6+3' rolls two six-sided dice and adds 3 to the result.
 * - '4d10' rolls four ten-sided dice with no additional modifier.
 *
 * @param {string} diceString - The string representing the dice roll configuration.
 * @returns {number} The total sum of the dice rolls plus the optional modifier.
 * @throws {Error} If the input string format is invalid or contains non-positive numbers.
 */
export function roll(diceString: string): number {
    const dicePattern = /^\d+d\d+(\+\d+)?$/; // Regex pattern to validate the input

    if (!dicePattern.test(diceString)) {
        throw new Error("Invalid dice string format. Use the format 'MdN+P'");
    }

    // Parse the input string
    const [dicePart, modifierPart] = diceString.split("+");
    const [numDice, diceSize] = dicePart.split("d").map(Number);
    const modifier = modifierPart ? parseInt(modifierPart, 10) : 0;

    if (numDice < 0 || diceSize < 0) {
        throw new Error("Number of dice and dice size must be greater than or equal to zero.");
    }

    // Roll the dice and calculate the sum
    let sum = 0;
    for (let i = 0; i < numDice; i++) {
        sum += Math.floor(Math.random() * diceSize) + 1;
    }

    // Add the modifier (if any)
    return sum + modifier;
}