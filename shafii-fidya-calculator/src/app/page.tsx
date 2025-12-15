// app/page.tsx (or pages/index.tsx)

'use client'; // Required for Next.js App Router for client-side components

import React, { useState, useEffect } from 'react';
import { calculateShafiiFidya, CalculationInputs, CalculationResults, MissedPeriod } from '../utils/calculator';

// Helper to format currency for Indian Rupees
const formatCurrency = (value: number) => {
    return value.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 });
};

// Helper to format general numbers
const formatNumber = (value: number, decimals: number = 0) => {
    return value.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
};

const defaultPeriods: MissedPeriod[] = [
    { startAge: 15, endAge: 25, fastsPerYear: 25 },
    { startAge: 28, endAge: 50, fastsPerYear: 8 },
];

export default function Home() {
    const [currentAge, setCurrentAge] = useState(59);
    const [fidyaUnitWeight, setFidyaUnitWeight] = useState(0.8);
    const [ricePrice, setRicePrice] = useState(35);
    const [sackWeight, setSackWeight] = useState(50);
    const [paymentPlanYears, setPaymentPlanYears] = useState(10);
    const [missedPeriods, setMissedPeriods] = useState<MissedPeriod[]>(defaultPeriods);
    const [results, setResults] = useState<CalculationResults | null>(null);

    useEffect(() => {
        handleCalculate();
    }, [currentAge, fidyaUnitWeight, ricePrice, sackWeight, missedPeriods, paymentPlanYears]);

    const handleCalculate = () => {
        const inputs: CalculationInputs = {
            currentAge,
            fidyaUnitWeight,
            ricePrice,
            sackWeight,
            missedPeriods,
            paymentPlanYears,
        };
        const calculatedResults = calculateShafiiFidya(inputs);
        setResults(calculatedResults);
    };

    const handlePeriodChange = (index: number, field: keyof MissedPeriod, value: number) => {
        const newPeriods = [...missedPeriods];
        newPeriods[index] = { ...newPeriods[index], [field]: value };
        setMissedPeriods(newPeriods);
    };

    const addPeriod = () => {
        setMissedPeriods([...missedPeriods, { startAge: currentAge, endAge: currentAge, fastsPerYear: 1 }]);
    };

    const removePeriod = (index: number) => {
        setMissedPeriods(missedPeriods.filter((_, i) => i !== index));
    };

    const renderInput = (label: string, value: number, setter: (v: number) => void, step: number = 1) => (
        <div className="input-group">
            <label>{label}</label>
            <input
                type="number"
                value={value}
                onChange={(e) => setter(parseFloat(e.target.value) || 0)}
                min={0}
                step={step}
                className="input-field"
            />
        </div>
    );

    const renderResultsTable = (title: string, data: { label: string, value: number, unit: string, decimals?: number, currency?: boolean }[]) => (
        <div className="result-section">
            <h2 className="heading">{title}</h2>
            <table className="results-table">
                <thead>
                    <tr><th>Obligation Category</th><th>Value</th><th>Unit</th></tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index} className={index >= data.length - 3 ? 'highlight' : ''}>
                            <td>{item.label}</td>
                            <td>
                                {item.currency 
                                    ? formatCurrency(item.value) 
                                    : formatNumber(item.value, item.decimals)}
                            </td>
                            <td>{item.unit}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="container">
            <style jsx global>{`
                body { font-family: 'Arial', sans-serif; background-color: #f4f7f6; color: #333; line-height: 1.6; padding: 20px; }
                .container { max-width: 900px; margin: 30px auto; padding: 25px; background: #fff; border-radius: 12px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); }
                .heading { color: #007bff; border-bottom: 2px solid #007bff; padding-bottom: 10px; margin-top: 25px; }
                .input-group { margin-bottom: 15px; }
                label { display: block; margin-bottom: 5px; font-weight: bold; }
                .input-field { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 5px; box-sizing: border-box; }
                .period-container { border: 1px dashed #ccc; padding: 15px; border-radius: 8px; margin-top: 10px; background-color: #fafafa; display: flex; flex-wrap: wrap; gap: 10px; align-items: flex-end; }
                .period-container > div { flex: 1 1 200px; }
                .remove-btn { background-color: #dc3545; color: white; padding: 10px 15px; border: none; border-radius: 5px; cursor: pointer; }
                .add-btn { background-color: #28a745; color: white; padding: 12px 20px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; margin-top: 20px; transition: background-color 0.3s; }
                .results-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                .results-table th, .results-table td { border: 1px solid #dee2e6; padding: 12px; text-align: left; }
                .results-table th { background-color: #007bff; color: white; }
                .highlight { background-color: #fff3cd; font-weight: bold; }
                .warning { color: red; font-weight: bold; margin-top: 15px; border: 2px dashed red; padding: 10px; border-radius: 5px; }
            `}</style>

            <h1 className="heading">🕌 Shafi'i Compounded Fidya Calculator</h1>
            <p>Calculates the cumulative debt (Qada & Fidya) for delayed fasts based on the strict Shafi'i Madhab ruling.</p>

            {/* General Data */}
            <h2 className="heading">1. General Rates & Age</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                {renderInput("Current Age (Years):", currentAge, setCurrentAge)}
                {renderInput("Fidya Unit Weight (kg, e.g., 0.8):", fidyaUnitWeight, setFidyaUnitWeight, 0.1)}
                {renderInput("Local Rice Price (₹ per kg):", ricePrice, setRicePrice)}
                {renderInput("Standard Sack Weight (kg, e.g., 50):", sackWeight, setSackWeight)}
                {renderInput("Payment Plan (Years):", paymentPlanYears, setPaymentPlanYears)}
            </div>

            {/* Missed Fasts Data */}
            <h2 className="heading">2. Missed Fasts Data (Periods)</h2>
            <p>Enter the age ranges where you missed fasts and failed to make them up before the next Ramadan.</p>
            <div>
                {missedPeriods.map((period, index) => (
                    <div key={index} className="period-container">
                        <div style={{ flex: '1 1 100%' }}><strong>Period {index + 1}</strong></div>
                        {renderInput("Start Age Missed:", period.startAge, (v) => handlePeriodChange(index, 'startAge', v))}
                        {renderInput("End Age Missed:", period.endAge, (v) => handlePeriodChange(index, 'endAge', v))}
                        {renderInput("Fasts Missed Per Year:", period.fastsPerYear, (v) => handlePeriodChange(index, 'fastsPerYear', v))}
                        <button className="remove-btn" onClick={() => removePeriod(index)}>Remove</button>
                    </div>
                ))}
                <button className="add-btn" onClick={addPeriod}>+ Add Another Period</button>
            </div>

            {/* Results */}
            {results && (
                <>
                    {/* Final Obligation Summary */}
                    {renderResultsTable("3. Final Obligation Summary (Paid Now at Age " + currentAge + ")", [
                        { label: "Total Qada Fasts Owed", value: results.totalQadaFasts, unit: "Days" },
                        { label: "Total Compounded Fidya Penalty", value: results.totalFidyaUnits, unit: "Units" },
                        { label: "Total Fidya Weight Owed", value: results.totalFidyaWeightKg, unit: "kg", decimals: 2 },
                        { label: "Total Monetary Value Owed", value: results.totalMonetaryValue, unit: "₹", currency: true },
                        { label: "Total Sacks Required (" + sackWeight + " kg)", value: results.totalSacks, unit: "Sacks", decimals: 2 },
                    ])}
                    <div className="warning">
                        **Shafi'i Confirmation:** Since you are able to fast, you must perform **{results.totalQadaFasts} Qada Fasts** AND pay the **{formatCurrency(results.totalMonetaryValue)} Fidya** penalty.
                    </div>

                    {/* N-Year Plan */}
                    {renderResultsTable(`4. ${paymentPlanYears}-Year Payment Plan`, [
                        { label: "Annual Qada Fasts (Round Up)", value: results.annualQadaFasts, unit: "Days" },
                        { label: "Annual Fidya Weight", value: results.annualFidyaWeightKg, unit: "kg", decimals: 2 },
                        { label: "Annual Monetary Value", value: results.annualMonetaryValue, unit: "₹", currency: true },
                        { label: "Annual Sacks Required", value: results.annualSacks, unit: "Sacks", decimals: 2 },
                    ])}
                </>
            )}
        </div>
    );
}