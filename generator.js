import Chance from 'chance';
const chance = new Chance();

/**
 * Traverse through an array to generate contents. 
 * @param {!Array.<(string|object|Array)>} a 
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

/**
 * Traverse through an object to generate contents. 
 * @param {!Object.<string, (string|object|Array)>} o 
 */
function traverseObject(o) {
    if (o === undefined) {
        throw new Error("Object argument must be provided.");
    }

    if (o === null) {
        throw new Error("Object argument must not be null.");
    }

    if (o.constructor !== {}.constructor) {
        throw new Error("Only an object can be provided.")
    }

}

export { traverseArray, traverseObject };