export function moneyToGoldGrams(moneyAmount: number, goldPricePerGram: number): number {
    if (isNaN(moneyAmount) || goldPricePerGram <= 0) {
        console.error("Invalid input. Money amount and gold price must be numbers, and gold price must be positive.");
        return NaN;
    }

    // Calculate the gold weight in grams.
    const goldGrams = moneyAmount / goldPricePerGram;

    return goldGrams;
}