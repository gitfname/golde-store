export function subtractPercentage(value: number, percentage: number): number {
  // Calculate the amount to subtract
  const amountToSubtract = value * (percentage / 100);

  // Subtract the amount from the original value
  const newValue = value - amountToSubtract;

  // Return the new value
  return newValue;
}
