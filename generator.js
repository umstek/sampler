import Chance from 'chance';
const chance = new Chance();

/**
 * Goes through an array to generate contents. 
 * @param {!Array.<(string|object)>} a 
 */
function traverseArray(a) {
    if (a === undefined) {
        throw new Error("Array argument must be provided.");
    }

    if (a === null) {
        throw new Error("Array argument must not be null.");
    }

    if (a.constructor !== [].constructor) {
        throw new Error("Only an array can be provided.")
    }

    if (a.length == 0) {
        return [];
    }
}

export { traverseArray };