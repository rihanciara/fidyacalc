// utils/calculator.ts

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
    totalQadaFasts: number;
    totalFidyaUnits: number;
    totalFidyaWeightKg: number;
    totalMonetaryValue: number;
    totalSacks: number;
    annualQadaFasts: number;
    annualFidyaWeightKg: number;
    annualMonetaryValue: number;
    annualSacks: number;
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

    for (const period of missedPeriods) {
        if (period.startAge > period.endAge) continue;

        // 1. Qada Fasts Calculation
        const yearsInPeriod = period.endAge - period.startAge + 1;
        totalQadaFasts += yearsInPeriod * period.fastsPerYear;

        // 2. Compounded Fidya Calculation (Shafi'i Logic)
        for (let ageMissed = period.startAge; ageMissed <= period.endAge; ageMissed++) {
            // Delay starts the year *after* the missed Ramadan (age + 1)
            const startDelayAge = ageMissed + 1; 
            
            // The number of full years the fasts were delayed until the current age
            const yearsOfDelay = currentAge - startDelayAge;
            
            if (yearsOfDelay >= 1) {
                const fidyaForOneYear = period.fastsPerYear * yearsOfDelay;
                totalFidyaUnits += fidyaForOneYear;
            }
        }
    }

    // --- Final Summary Calculations (Paid Now) ---
    const totalFidyaWeightKg = totalFidyaUnits * fidyaUnitWeight;
    const totalMonetaryValue = totalFidyaWeightKg * ricePrice;
    const totalSacks = totalFidyaWeightKg / sackWeight;

    // --- N-Year Payment Plan Calculation ---
    const annualQadaFasts = Math.ceil(totalQadaFasts / paymentPlanYears); 
    const annualFidyaWeightKg = totalFidyaWeightKg / paymentPlanYears;
    const annualMonetaryValue = totalMonetaryValue / paymentPlanYears;
    const annualSacks = totalSacks / paymentPlanYears;

    return {
        totalQadaFasts,
        totalFidyaUnits,
        totalFidyaWeightKg,
        totalMonetaryValue,
        totalSacks,
        annualQadaFasts,
        annualFidyaWeightKg,
        annualMonetaryValue,
        annualSacks,
    };
}