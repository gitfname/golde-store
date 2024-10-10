export function convertStringToNestedObject(path: string, value: any): object {
    // Split the path into keys
    const keys = path.split('.');
    // Create the root object
    let currentObject: any = {};
    // Initialize a variable to keep track of the current level in the nested structure
    let temp = currentObject;

    // Iterate through each key in the array except for the last one
    keys.forEach((key, index) => {
        if (index === keys.length - 1) {
            // Set the last key to the provided value
            temp[key] = value;
        } else {
            // Create a new object at the current key
            temp[key] = {};
            // Move the reference to the new object
            temp = temp[key];
        }
    });

    return currentObject;
}