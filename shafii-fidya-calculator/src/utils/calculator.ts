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
    currentYear: number;     // New: Needed for Year-based calculation
    fidyaUnitWeight: number; // New: Now dynamic
    ricePrice: number;       
    sackWeight: number;      
    missedPeriods: MissedPeriod[];   // For Age Method
    missedSpecificYears: SpecificYear[]; // For Year Method
    paymentPlanYears: number; 
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

    let totalQadaFasts = 0;
    let totalFidyaUnits = 0;

    // --- STRATEGY 1: AGE BASED CALCULATION ---
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

    // --- STRATEGY 2: SPECIFIC YEAR BASED CALCULATION ---
    for (const record of missedSpecificYears) {
        if (record.days <= 0) continue;
        
        totalQadaFasts += record.days;

        // Logic: Fast missed in 2000. Due in 2001.
        // If Current Year is 2024. Delay = 2024 - 2001 = 23 years.
        const dueYear = record.year + 1;
        const yearsOfDelay = Math.max(0, currentYear - dueYear);

        if (yearsOfDelay >= 1) {
            totalFidyaUnits += record.days * yearsOfDelay;
        }
    }

    // --- COMMON TOTALS ---
    const totalFidyaWeightKg = totalFidyaUnits * fidyaUnitWeight;
    const totalMonetaryValue = totalFidyaWeightKg * ricePrice;
    const totalSacks = totalFidyaWeightKg / sackWeight;

    // --- FUTURE PLAN LOGIC ---
    const annualQadaFasts = Math.ceil(totalQadaFasts / paymentPlanYears);

    const yearsOfFutureDelay = paymentPlanYears - 1;
    const sumOfFutureYears = (yearsOfFutureDelay * (yearsOfFutureDelay + 1)) / 2;
    const futurePenaltyUnits = annualQadaFasts * sumOfFutureYears;

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
        
        futurePenaltyUnits,
        grandTotalCost: Math.round(totalPlanValue) 
    };
}