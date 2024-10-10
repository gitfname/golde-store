import { Decimal } from 'decimal.js'; // Import a decimal library for precise calculations

interface GoldSaleCalculation {
    goldAmount: number;
    goldToRialRate: number;
}


export function goldToRial({
    goldAmount,
    goldToRialRate,
}: GoldSaleCalculation): { rialAmount: number; fee: number; finalRialAmount: number } {

    // Use Decimal.js for precise calculations
    const goldAmountDecimal = new Decimal(goldAmount);
    const goldToRialRateDecimal = new Decimal(goldToRialRate);

    const rialAmountDecimal = goldAmountDecimal.times(goldToRialRateDecimal);

    // Calculate fee
    const feePercentage = goldAmount < 25 ? 0.05 : 0.01;
    const feeDecimal = rialAmountDecimal.times(feePercentage);

    const finalRialAmountDecimal = rialAmountDecimal.minus(feeDecimal);



    return {
        rialAmount: rialAmountDecimal.toNumber(),
        fee: feeDecimal.toNumber(),
        finalRialAmount: finalRialAmountDecimal.toNumber(),
    };
}