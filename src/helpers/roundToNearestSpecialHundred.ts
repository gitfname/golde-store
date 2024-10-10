export function roundToNearestSpecialHundred(number: number): number {
    // Extract the last three digits of the number
    const lastThreeDigits = number % 1000;

    // Determine the base of the number without the last three digits
    const base = number - lastThreeDigits;

    // Decide the rounding based on the last three digits
    if (lastThreeDigits >= 500) {
        return base + 1000; // Round up to the next thousand
    } else {
        return base + Math.floor(lastThreeDigits / 100) * 100; // Round to the nearest lower hundred
    }
}