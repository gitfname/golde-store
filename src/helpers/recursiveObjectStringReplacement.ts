type ReplacementMap = { [key: string]: any };

function recursiveObjectStringReplacement(obj: any, replacements: ReplacementMap): any {
    // Helper function to replace strings based on the replacements map
    const replaceString = (input: string): any => {
        let result: any = input;
        for (const pattern in replacements) {
            const regex = new RegExp(pattern, 'g');
            // Check if the input string matches the pattern exactly
            if (input.match(regex) && input === pattern) {
                // If the entire string is the pattern, return the replacement directly
                return replacements[pattern];
            }
            // Otherwise, perform a replace operation (for partial matches within strings)
            result = result.replace(regex, replacements[pattern]);
        }
        return result;
    };

    // Recursive function to traverse and modify the object
    const traverseAndReplace = (element: any): any => {
        if (element && typeof element === 'object') {
            for (const key in element) {
                if (element.hasOwnProperty(key)) {
                    const value = element[key];
                    if (typeof value === 'string') {
                        element[key] = replaceString(value);
                    } else if (typeof value === 'object') {
                        traverseAndReplace(value);
                    }
                }
            }
        }
    };

    // Create a deep copy of the object to avoid mutating the original object
    const clonedObj = JSON.parse(JSON.stringify(obj));
    traverseAndReplace(clonedObj);
    return clonedObj;
}

// Usage example:
// const obj = {
//     user: "{{CURRENT_USER}}",
//     details: {
//         email: "example@{{DOMAIN}}",
//         username: "{{CURRENT_USER}}_name"
//     }
// };

// const replacements = {
//     "{{CURRENT_USER}}": "john_doe",
//     "{{DOMAIN}}": "example.com"
// };

// const updatedObj = recursiveObjectStringReplacement(obj, replacements);
// console.log(updatedObj);

export default recursiveObjectStringReplacement
