// src/utils/calculator.ts

export interface MissedPeriod {
    startAge: number;
    endAge: number;
    fastsPerYear: number;
}

export interface SpecificYear {
    year: number;
    days: number;
}

export interface CalculationInputs {
    currentAge: number;
    currentYear: number;     
    fidyaUnitWeight: number; 
    ricePrice: number;       
    sackWeight: number;      
    missedPeriods: MissedPeriod[];   
    missedSpecificYears: SpecificYear[]; 
    paymentPlanYears: number; 
}

export interface CalculationResults {
    // Historical
    totalQadaFasts: number;
    totalFidyaUnits: number;
    totalFidyaWeightKg: number;
    totalMonetaryValue: number;
    totalSacks: number;
    
    // Future Plan
    annualQadaFasts: number;
    annualFidyaWeightKg: number;
    annualMonetaryValue: number;
    annualSacks: number;
    
    // Metadata for UI
    futurePenaltyUnits: number; 
    grandTotalCost: number;     
}

export function calculateShafiiFidya(inputs: CalculationInputs): CalculationResults {
    const { 
        currentAge,
        currentYear,
        fidyaUnitWeight, 
        ricePrice, 
        sackWeight, 
        missedPeriods, 
        missedSpecificYears,
        paymentPlanYears 
    } = inputs;

    // --- SAFETY GUARDS (Fixes Division by Zero) ---
    // If payment years is 0 or empty, default to 1 to prevent crash
    const safePaymentYears = paymentPlanYears <= 0 ? 1 : paymentPlanYears;
    // If sack weight is 0, default to 1 to prevent crash
    const safeSackWeight = sackWeight <= 0 ? 1 : sackWeight;

    let totalQadaFasts = 0;
    let totalFidyaUnits = 0;

    // --- STRATEGY 1: AGE BASED ---
    for (const period of missedPeriods) {
        if (period.startAge > period.endAge) continue;
        const yearsInPeriod = period.endAge - period.startAge + 1;
        totalQadaFasts += yearsInPeriod * period.fastsPerYear;

        for (let ageMissed = period.startAge; ageMissed <= period.endAge; ageMissed++) {
            const startDelayAge = ageMissed + 1; 
            const yearsOfDelay = Math.max(0, currentAge - startDelayAge);
            if (yearsOfDelay >= 1) {
                totalFidyaUnits += period.fastsPerYear * yearsOfDelay;
            }
        }
    }

    // --- STRATEGY 2: YEAR BASED ---
    for (const record of missedSpecificYears) {
        if (record.days <= 0) continue;
        
        totalQadaFasts += record.days;

        const dueYear = record.year + 1;
        const yearsOfDelay = Math.max(0, currentYear - dueYear);

        if (yearsOfDelay >= 1) {
            totalFidyaUnits += record.days * yearsOfDelay;
        }
    }

    // --- COMMON TOTALS ---
    const totalFidyaWeightKg = totalFidyaUnits * fidyaUnitWeight;
    const totalMonetaryValue = totalFidyaWeightKg * ricePrice;
    
    // Fix: Use safeSackWeight to avoid Infinity
    const totalSacks = totalFidyaWeightKg / safeSackWeight;

    // --- FUTURE PLAN LOGIC ---
    // Fix: Use safePaymentYears
    const annualQadaFasts = Math.ceil(totalQadaFasts / safePaymentYears);

    const yearsOfFutureDelay = safePaymentYears - 1;
    const sumOfFutureYears = (yearsOfFutureDelay * (yearsOfFutureDelay + 1)) / 2;
    const futurePenaltyUnits = annualQadaFasts * sumOfFutureYears;

    const totalPlanUnits = totalFidyaUnits + futurePenaltyUnits;
    const totalPlanWeight = totalPlanUnits * fidyaUnitWeight;
    const totalPlanValue = totalPlanWeight * ricePrice;
    
    // Fix: Use safeSackWeight
    const totalPlanSacks = totalPlanWeight / safeSackWeight;

    return {
        totalQadaFasts,
        totalFidyaUnits,
        totalFidyaWeightKg: parseFloat(totalFidyaWeightKg.toFixed(2)),
        totalMonetaryValue: Math.round(totalMonetaryValue),
        totalSacks: parseFloat(totalSacks.toFixed(2)),
        
        annualQadaFasts,
        annualFidyaWeightKg: parseFloat((totalPlanWeight / safePaymentYears).toFixed(2)),
        annualMonetaryValue: Math.round(totalPlanValue / safePaymentYears),
        annualSacks: parseFloat((totalPlanSacks / safePaymentYears).toFixed(2)),
        
        futurePenaltyUnits,
        grandTotalCost: Math.round(totalPlanValue) 
    };
}