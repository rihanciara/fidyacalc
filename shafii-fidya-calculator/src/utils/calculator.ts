// src/utils/calculator.ts

export interface MissedPeriod {
    startAge: number;
    endAge: number;
    fastsPerYear: number;
}

export interface CalculationInputs {
    currentAge: number;
    fidyaUnitWeight: number; // e.g., 0.8 kg
    ricePrice: number;      // e.g., 35 INR/kg
    sackWeight: number;     // e.g., 50 kg
    missedPeriods: MissedPeriod[];
    paymentPlanYears: number; // e.g., 10 years
}

export interface CalculationResults {
    // Historical Totals (If paid today)
    totalQadaFasts: number;
    totalFidyaUnits: number;
    totalFidyaWeightKg: number;
    totalMonetaryValue: number;
    totalSacks: number;

    // Future-Proof Plan Results (Includes Future Penalty)
    annualQadaFasts: number;
    annualFidyaWeightKg: number;
    annualMonetaryValue: number;
    annualSacks: number;
    
    // New field: Shows how much extra penalty was added for the future delay
    futurePenaltyUnits: number; 
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

    // --- Final Summary Calculations (Paid Now) ---
    const totalFidyaWeightKg = totalFidyaUnits * fidyaUnitWeight;
    const totalMonetaryValue = totalFidyaWeightKg * ricePrice;
    const totalSacks = totalFidyaWeightKg / sackWeight;

    // --- N-Year Payment Plan Calculation (With Future Compounding) ---
    const annualQadaFasts = Math.ceil(totalQadaFasts / paymentPlanYears);

    // Calculate the EXTRA penalty for delaying these fasts into the future years.
    // Logic: 
    // Year 1 of plan: 0 years extra delay.
    // Year 2 of plan: 1 year extra delay.
    // ...
    // Year 10 of plan: 9 years extra delay.
    
    // Sum of integers from 0 to (Years - 1)
    const yearsOfFutureDelay = paymentPlanYears - 1;
    const sumOfFutureYears = (yearsOfFutureDelay * (yearsOfFutureDelay + 1)) / 2;
    
    // Total EXTRA units = (Fasts Per Year) * (Sum of Delays)
    const futurePenaltyUnits = annualQadaFasts * sumOfFutureYears;

    // Add this future penalty to the existing total
    const totalPlanUnits = totalFidyaUnits + futurePenaltyUnits;
    const totalPlanWeight = totalPlanUnits * fidyaUnitWeight;
    const totalPlanValue = totalPlanWeight * ricePrice;
    const totalPlanSacks = totalPlanWeight / sackWeight;

    // Calculate Annual Averages based on this NEW total
    const annualFidyaWeightKg = totalPlanWeight / paymentPlanYears;
    const annualMonetaryValue = totalPlanValue / paymentPlanYears;
    const annualSacks = totalPlanSacks / paymentPlanYears;

    return {
        totalQadaFasts,
        totalFidyaUnits,
        totalFidyaWeightKg: parseFloat(totalFidyaWeightKg.toFixed(2)),
        totalMonetaryValue: Math.round(totalMonetaryValue),
        totalSacks: parseFloat(totalSacks.toFixed(2)),
        
        annualQadaFasts,
        annualFidyaWeightKg: parseFloat(annualFidyaWeightKg.toFixed(2)),
        annualMonetaryValue: Math.round(annualMonetaryValue),
        annualSacks: parseFloat(annualSacks.toFixed(2)),
        
        futurePenaltyUnits // Useful to show user "Extra penalty for delay"
    };
}