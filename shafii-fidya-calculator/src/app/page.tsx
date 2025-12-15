// src/app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
// We use the @ alias which is standard in Next.js
import { calculateShafiiFidya, CalculationInputs, CalculationResults, MissedPeriod } from '@/utils/calculator';
import { Trash2, PlusCircle, AlertTriangle, Calculator, Calendar } from 'lucide-react';

const defaultPeriods: MissedPeriod[] = [
  { startAge: 15, endAge: 25, fastsPerYear: 25 },
  { startAge: 28, endAge: 50, fastsPerYear: 8 },
];

export default function Home() {
  const [currentAge, setCurrentAge] = useState(59);
  const [paymentYears, setPaymentYears] = useState(10);
  const [ricePrice, setRicePrice] = useState(35);
  const [sackWeight, setSackWeight] = useState(50);
  const [missedPeriods, setMissedPeriods] = useState<MissedPeriod[]>(defaultPeriods);
  const [results, setResults] = useState<CalculationResults | null>(null);

  useEffect(() => {
    const inputs: CalculationInputs = {
      currentAge,
      paymentPlanYears: paymentYears,
      ricePrice,
      sackWeight,
      fidyaUnitWeight: 0.8,
      missedPeriods
    };
    setResults(calculateShafiiFidya(inputs));
  }, [currentAge, paymentYears, ricePrice, sackWeight, missedPeriods]);

  const updatePeriod = (index: number, field: keyof MissedPeriod, val: number) => {
    const newPeriods = [...missedPeriods];
    newPeriods[index] = { ...newPeriods[index], [field]: val };
    setMissedPeriods(newPeriods);
  };

  const removePeriod = (index: number) => setMissedPeriods(missedPeriods.filter((_, i) => i !== index));
  const addPeriod = () => setMissedPeriods([...missedPeriods, { startAge: 20, endAge: 25, fastsPerYear: 10 }]);

  return (
    <main className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-100 font-sans selection:bg-purple-500/30 pb-20">
      
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
        
        {/* Header */}
        <header className="mb-8 md:mb-12 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 tracking-tight">
            Shafi'i Fidya Planner
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto">
            Strict compounding calculation with future-proof planning.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* --- INPUT SECTION --- */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Settings Card */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 shadow-lg backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
                <Calculator size={18} className="text-purple-400"/>
                <h2 className="text-base font-semibold text-purple-200">Settings</h2>
              </div>
              <div className="space-y-4">
                <InputGroup label="Current Age" value={currentAge} onChange={setCurrentAge} />
                <InputGroup label="Plan Duration (Years)" value={paymentYears} onChange={setPaymentYears} />
                <div className="grid grid-cols-2 gap-3">
                   <InputGroup label="Rice Price (₹)" value={ricePrice} onChange={setRicePrice} />
                   <InputGroup label="Sack Size (Kg)" value={sackWeight} onChange={setSackWeight} />
                </div>
              </div>
            </div>

            {/* Missed Periods Card */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 shadow-lg backdrop-blur-sm">
              <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-purple-400"/>
                  <h2 className="text-base font-semibold text-purple-200">Missed Days</h2>
                </div>
                <button onClick={addPeriod} className="text-emerald-400 hover:text-emerald-300 p-1 bg-emerald-500/10 rounded-full transition active:scale-95">
                  <PlusCircle size={20} />
                </button>
              </div>
              
              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
                {missedPeriods.map((period, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-black/30 border border-white/5 relative group transition">
                    <button 
                      onClick={() => removePeriod(idx)} 
                      className="absolute top-2 right-2 text-rose-500/70 hover:text-rose-400 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                      <InputGroup label="Age From" value={period.startAge} onChange={(v) => updatePeriod(idx, 'startAge', v)} compact />
                      <InputGroup label="Age To" value={period.endAge} onChange={(v) => updatePeriod(idx, 'endAge', v)} compact />
                      <div className="col-span-2">
                        <InputGroup label="Fasts Per Year" value={period.fastsPerYear} onChange={(v) => updatePeriod(idx, 'fastsPerYear', v)} compact />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* --- RESULTS SECTION --- */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Warning Box */}
            <div className="p-4 rounded-xl bg-amber-900/20 border border-amber-500/20 flex gap-3 items-start">
              <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={20} />
              <div>
                <h3 className="text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">Ruling Confirmation</h3>
                <p className="text-amber-100/80 text-xs leading-relaxed">
                  Includes <strong>{results?.futurePenaltyUnits.toLocaleString()} extra units</strong> for future delays over {paymentYears} years (Shafi'i Madhab).
                </p>
              </div>
            </div>

            {/* High Level Stats Grid */}
            {results && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard label="Total Cost" value={`₹${results.grandTotalCost.toLocaleString()}`} sub="With Penalty" highlight />
                <StatCard label="Total Qada" value={results.totalQadaFasts} sub="Days" />
                <StatCard label="Total Rice" value={results.totalFidyaWeightKg.toLocaleString()} sub="Kg" />
                <StatCard label="Total Sacks" value={results.totalSacks} sub="Bags" />
              </div>
            )}

            {/* APP-STYLE CARD LIST (Visible on Mobile) */}
            {results && (
              <div className="block md:hidden space-y-3">
                 <div className="flex justify-between items-center px-2">
                    <h3 className="font-semibold text-lg text-white">Payment Plan</h3>
                    <span className="text-xs font-mono text-purple-300 bg-purple-500/20 px-2 py-1 rounded border border-purple-500/30">
                      {paymentYears} Years
                    </span>
                 </div>
                 {Array.from({ length: paymentYears }).map((_, i) => (
                   <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-3">
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="font-bold text-white">Year {i + 1}</span>
                        <span className="text-emerald-300 font-mono font-bold text-lg">₹{results.annualMonetaryValue.toLocaleString()}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-black/20 rounded p-2">
                          <div className="text-[10px] text-slate-500 uppercase">Qada</div>
                          <div className="text-purple-300 font-medium">{results.annualQadaFasts}</div>
                        </div>
                        <div className="bg-black/20 rounded p-2">
                          <div className="text-[10px] text-slate-500 uppercase">Rice</div>
                          <div className="text-slate-200 font-medium">{results.annualFidyaWeightKg}kg</div>
                        </div>
                        <div className="bg-black/20 rounded p-2">
                          <div className="text-[10px] text-slate-500 uppercase">Sacks</div>
                          <div className="text-slate-200 font-medium">{results.annualSacks}</div>
                        </div>
                      </div>
                   </div>
                 ))}
              </div>
            )}

            {/* DESKTOP TABLE (Hidden on Mobile) */}
            {results && (
              <div className="hidden md:block rounded-2xl bg-white/5 border border-white/10 overflow-hidden shadow-lg">
                <div className="p-5 border-b border-white/10 flex justify-between items-center bg-white/5">
                  <h3 className="font-semibold text-lg text-white">Equal Payment Schedule</h3>
                  <span className="text-xs font-mono text-purple-300 bg-purple-500/20 px-2 py-1 rounded border border-purple-500/30">
                    {paymentYears} Years
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="text-slate-400 border-b border-white/10 bg-black/20">
                        <th className="p-4 font-medium">Year</th>
                        <th className="p-4 font-medium">Qada (Days)</th>
                        <th className="p-4 font-medium">Rice (Kg)</th>
                        <th className="p-4 font-medium">Sacks</th>
                        <th className="p-4 font-medium text-right">Annual Cost</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                      {Array.from({ length: paymentYears }).map((_, i) => (
                        <tr key={i} className="hover:bg-white/5 transition">
                          <td className="p-4 font-medium text-white">Year {i + 1}</td>
                          <td className="p-4 text-purple-300">{results.annualQadaFasts}</td>
                          <td className="p-4">{results.annualFidyaWeightKg} kg</td>
                          <td className="p-4">{results.annualSacks}</td>
                          <td className="p-4 text-right font-mono text-emerald-300 font-bold">
                            ₹{results.annualMonetaryValue.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}

// Optimized Input Component with Numeric Keypad Support
function InputGroup({ label, value, onChange, compact = false }: { label: string, value: number, onChange: (v: number) => void, compact?: boolean }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500 px-1">{label}</label>
      <input
        type="number"
        inputMode="decimal"
        pattern="[0-9]*"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className={`w-full bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:bg-black/60 focus:ring-1 focus:ring-purple-500/50 transition duration-200 ${compact ? 'p-2 text-sm' : 'p-3 text-base'}`}
      />
    </div>
  );
}

function StatCard({ label, value, sub, highlight }: { label: string, value: string | number, sub: string, highlight?: boolean }) {
  return (
    <div className={`p-4 rounded-xl border flex flex-col justify-center min-h-[100px] ${highlight ? 'bg-purple-900/20 border-purple-500/30' : 'bg-white/5 border-white/10'}`}>
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">{label}</span>
      <span className={`text-xl md:text-2xl font-bold ${highlight ? 'text-white' : 'text-slate-200'} truncate`}>{value}</span>
      <span className="text-[10px] text-slate-500 mt-1">{sub}</span>
    </div>
  );
}