// src/utils/calculator.ts

export interface MissedPeriod {
    startAge: number;
    endAge: number;
    fastsPerYear: number;
}

export interface CalculationInputs {
    currentAge: number;
    fidyaUnitWeight: number; // e.g., 0.8 kg
    ricePrice: number;       // e.g., 35 INR/kg
    sackWeight: number;      // e.g., 50 kg
    missedPeriods: MissedPeriod[];
    paymentPlanYears: number; // e.g., 10 years
}

// THIS INTERFACE WAS MISSING THE "grandTotalCost" FIELD
export interface CalculationResults {
    // Historical Totals (If paid today)
    totalQadaFasts: number;
    totalFidyaUnits: number;
    totalFidyaWeightKg: number;
    totalMonetaryValue: number;
    totalSacks: number;

    // Future-Proof Plan Results
    annualQadaFasts: number;
    annualFidyaWeightKg: number;
    annualMonetaryValue: number;
    annualSacks: number;
    
    // THE FIX: These must be defined here
    futurePenaltyUnits: number; 
    grandTotalCost: number;     
}

export function calculateShafiiFidya(inputs: CalculationInputs): CalculationResults {
    const { 
        currentAge, 
        fidyaUnitWeight, 
        ricePrice, 
        sackWeight, 
        missedPeriods, 
        paymentPlanYears 
    } = inputs;

    let totalQadaFasts = 0;
    let totalFidyaUnits = 0;

    // 1. Calculate Historical Debt (Up to Current Age)
    for (const period of missedPeriods) {
        if (period.startAge > period.endAge) continue;

        const yearsInPeriod = period.endAge - period.startAge + 1;
        totalQadaFasts += yearsInPeriod * period.fastsPerYear;

        for (let ageMissed = period.startAge; ageMissed <= period.endAge; ageMissed++) {
            const startDelayAge = ageMissed + 1; 
            const yearsOfDelay = currentAge - startDelayAge;
            
            if (yearsOfDelay >= 1) {
                totalFidyaUnits += period.fastsPerYear * yearsOfDelay;
            }
        }
    }

    // Historical Totals
    const totalFidyaWeightKg = totalFidyaUnits * fidyaUnitWeight;
    const totalMonetaryValue = totalFidyaWeightKg * ricePrice;
    const totalSacks = totalFidyaWeightKg / sackWeight;

    // 2. Future-Proof Plan (The Fix)
    const annualQadaFasts = Math.ceil(totalQadaFasts / paymentPlanYears);

    // Calculate Future Penalty (Sum of years 0 to N-1)
    const yearsOfFutureDelay = paymentPlanYears - 1;
    const sumOfFutureYears = (yearsOfFutureDelay * (yearsOfFutureDelay + 1)) / 2;
    const futurePenaltyUnits = annualQadaFasts * sumOfFutureYears;

    // Total Plan Values (Including Penalty)
    const totalPlanUnits = totalFidyaUnits + futurePenaltyUnits;
    const totalPlanWeight = totalPlanUnits * fidyaUnitWeight;
    const totalPlanValue = totalPlanWeight * ricePrice;
    const totalPlanSacks = totalPlanWeight / sackWeight;

    return {
        totalQadaFasts,
        totalFidyaUnits,
        totalFidyaWeightKg: parseFloat(totalFidyaWeightKg.toFixed(2)),
        totalMonetaryValue: Math.round(totalMonetaryValue),
        totalSacks: parseFloat(totalSacks.toFixed(2)),
        
        annualQadaFasts,
        annualFidyaWeightKg: parseFloat((totalPlanWeight / paymentPlanYears).toFixed(2)),
        annualMonetaryValue: Math.round(totalPlanValue / paymentPlanYears),
        annualSacks: parseFloat((totalPlanSacks / paymentPlanYears).toFixed(2)),
        
        // Exporting these fixes the build error
        futurePenaltyUnits,
        grandTotalCost: Math.round(totalPlanValue) 
    };
}