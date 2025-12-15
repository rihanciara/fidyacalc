// src/app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
// Import Calculator Logic & Types
import { calculateShafiiFidya, CalculationInputs, CalculationResults, MissedPeriod, SpecificYear } from '@/utils/calculator';
// Import Translations
import { translations, Language } from '@/utils/translations';
// Import Icons
import { Trash2, PlusCircle, AlertTriangle, Calculator, Calendar, Settings2, Languages, BookOpen } from 'lucide-react';

// Default Data
const defaultPeriods: MissedPeriod[] = [
  { startAge: 15, endAge: 25, fastsPerYear: 25 },
];

const defaultYears: SpecificYear[] = [
  { year: new Date().getFullYear() - 10, days: 30 },
];

export default function Home() {
  // --- STATE ---
  const [lang, setLang] = useState<Language>('en'); // Language State
  const t = translations[lang]; // Translation Helper

  // Calculation Settings
  const [currentAge, setCurrentAge] = useState(59);
  const [paymentYears, setPaymentYears] = useState(10);
  const [ricePrice, setRicePrice] = useState(35);
  const [sackWeight, setSackWeight] = useState(50);
  const [fidyaUnitWeight, setFidyaUnitWeight] = useState(0.8);

  // Calculation Mode
  const [calcMode, setCalcMode] = useState<'age' | 'year'>('age');

  // Input Data
  const [missedPeriods, setMissedPeriods] = useState<MissedPeriod[]>(defaultPeriods);
  const [missedYears, setMissedYears] = useState<SpecificYear[]>(defaultYears);
  
  const [results, setResults] = useState<CalculationResults | null>(null);

  // --- EFFECT: CALCULATE ---
  useEffect(() => {
    const inputs: CalculationInputs = {
      currentAge,
      currentYear: new Date().getFullYear(),
      paymentPlanYears: paymentYears,
      ricePrice,
      sackWeight,
      fidyaUnitWeight,
      // Pass the specific array based on selected mode
      missedPeriods: calcMode === 'age' ? missedPeriods : [],
      missedSpecificYears: calcMode === 'year' ? missedYears : []
    };
    setResults(calculateShafiiFidya(inputs));
  }, [currentAge, paymentYears, ricePrice, sackWeight, fidyaUnitWeight, missedPeriods, missedYears, calcMode]);

  // --- HANDLERS: AGE MODE ---
  const updatePeriod = (index: number, field: keyof MissedPeriod, val: number) => {
    const newPeriods = [...missedPeriods];
    newPeriods[index] = { ...newPeriods[index], [field]: val };
    setMissedPeriods(newPeriods);
  };
  const removePeriod = (index: number) => setMissedPeriods(missedPeriods.filter((_, i) => i !== index));
  const addPeriod = () => setMissedPeriods([...missedPeriods, { startAge: 20, endAge: 25, fastsPerYear: 10 }]);

  // --- HANDLERS: YEAR MODE ---
  const updateYearRow = (index: number, field: keyof SpecificYear, val: number) => {
    const newYears = [...missedYears];
    newYears[index] = { ...newYears[index], [field]: val };
    setMissedYears(newYears);
  };
  const removeYearRow = (index: number) => setMissedYears(missedYears.filter((_, i) => i !== index));
  const addYearRow = () => setMissedYears([...missedYears, { year: new Date().getFullYear() - 5, days: 5 }]);

  return (
    <main className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-100 font-sans selection:bg-purple-500/30 pb-20">
      
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
        
        {/* --- TOP BAR: NAVIGATION & LANGUAGE --- */}
        <div className="flex justify-between items-center mb-6">
            {/* Guide Link */}
            <Link href="/guide" className="flex items-center gap-2 text-slate-400 hover:text-purple-300 transition text-sm font-medium group">
                <div className="p-1.5 bg-white/5 rounded-lg group-hover:bg-purple-500/20 transition">
                    <BookOpen size={18} />
                </div>
                <span className="hidden md:inline">{t.readGuide}</span>
                <span className="md:hidden">Guide</span>
            </Link>

            {/* Language Switcher */}
            <button 
                onClick={() => setLang(lang === 'en' ? 'ml' : 'en')}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition text-sm font-medium"
            >
                <Languages size={16} className="text-purple-300" />
                {lang === 'en' ? 'മലയാളം' : 'English'}
            </button>
        </div>

        {/* Header */}
        <header className="mb-8 md:mb-12 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 tracking-tight">
            {t.appTitle}
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto">
            {t.appSubtitle}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* --- LEFT COLUMN: INPUTS --- */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* 1. Global Settings Card */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 shadow-lg backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
                <Settings2 size={18} className="text-purple-400"/>
                <h2 className="text-base font-semibold text-purple-200">{t.settings}</h2>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <InputGroup label={t.currentAge} value={currentAge} onChange={setCurrentAge} />
                    <InputGroup label={t.planDuration} value={paymentYears} onChange={setPaymentYears} />
                </div>
                <div className="grid grid-cols-3 gap-3">
                   <InputGroup label={t.ricePrice} value={ricePrice} onChange={setRicePrice} />
                   <InputGroup label={t.sackSize} value={sackWeight} onChange={setSackWeight} />
                   <InputGroup label={t.fidyaWeight} value={fidyaUnitWeight} onChange={setFidyaUnitWeight} step={0.1} />
                </div>
              </div>
            </div>

            {/* 2. Calculation Method Tabs */}
            <div className="p-1 rounded-xl bg-white/5 border border-white/10 flex">
                <button 
                    onClick={() => setCalcMode('age')}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition ${calcMode === 'age' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                >
                    {t.ageMethod}
                </button>
                <button 
                    onClick={() => setCalcMode('year')}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition ${calcMode === 'year' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                >
                    {t.yearMethod}
                </button>
            </div>

            {/* 3. Dynamic Input List */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 shadow-lg backdrop-blur-sm">
              <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-purple-400"/>
                  <h2 className="text-base font-semibold text-purple-200">{t.missedTitle}</h2>
                </div>
                <button 
                  onClick={calcMode === 'age' ? addPeriod : addYearRow} 
                  className="text-emerald-400 hover:text-emerald-300 p-1 bg-emerald-500/10 rounded-full transition active:scale-95"
                >
                  <PlusCircle size={20} />
                </button>
              </div>
              
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                
                {/* MODE: AGE INPUTS */}
                {calcMode === 'age' && missedPeriods.map((period, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-black/30 border border-white/5 relative group transition">
                    <button onClick={() => removePeriod(idx)} className="absolute top-2 right-2 text-rose-500/70 hover:text-rose-400 p-1">
                      <Trash2 size={16} />
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                      <InputGroup label={t.ageFrom} value={period.startAge} onChange={(v) => updatePeriod(idx, 'startAge', v)} compact />
                      <InputGroup label={t.ageTo} value={period.endAge} onChange={(v) => updatePeriod(idx, 'endAge', v)} compact />
                      <div className="col-span-2">
                        <InputGroup label={t.fastsPerYear} value={period.fastsPerYear} onChange={(v) => updatePeriod(idx, 'fastsPerYear', v)} compact />
                      </div>
                    </div>
                  </div>
                ))}

                {/* MODE: YEAR INPUTS */}
                {calcMode === 'year' && missedYears.map((row, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-black/30 border border-white/5 relative group transition">
                    <button onClick={() => removeYearRow(idx)} className="absolute top-2 right-2 text-rose-500/70 hover:text-rose-400 p-1">
                      <Trash2 size={16} />
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                      <InputGroup label={t.calendarYear} value={row.year} onChange={(v) => updateYearRow(idx, 'year', v)} compact />
                      <InputGroup label={t.daysMissed} value={row.days} onChange={(v) => updateYearRow(idx, 'days', v)} compact />
                    </div>
                  </div>
                ))}

              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN: RESULTS --- */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Warning / Ruling Card */}
            <div className="p-4 rounded-xl bg-amber-900/20 border border-amber-500/20 flex gap-3 items-start">
              <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={20} />
              <div>
                <h3 className="text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">{t.rulingTitle}</h3>
                <p className="text-amber-100/80 text-xs leading-relaxed">
                  {results && t.rulingText(fidyaUnitWeight, results.futurePenaltyUnits.toLocaleString())}
                </p>
              </div>
            </div>

            {/* High Level Stats Grid */}
            {results && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard label={t.totalCost} value={`₹${results.grandTotalCost.toLocaleString()}`} sub={t.withPenalty} highlight />
                <StatCard label={t.totalQada} value={results.totalQadaFasts} sub={t.days} />
                <StatCard label={t.totalRice} value={results.totalFidyaWeightKg.toLocaleString()} sub="Kg" />
                <StatCard label={t.totalSacks} value={results.totalSacks} sub={t.bags} />
              </div>
            )}

            {/* Mobile: Card View */}
            {results && (
              <div className="block md:hidden space-y-3">
                 <div className="flex justify-between items-center px-2">
                    <h3 className="font-semibold text-lg text-white">{t.paymentPlan}</h3>
                    <span className="text-xs font-mono text-purple-300 bg-purple-500/20 px-2 py-1 rounded border border-purple-500/30">
                      {paymentYears} {t.year}
                    </span>
                 </div>
                 {Array.from({ length: paymentYears }).map((_, i) => (
                   <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-3">
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="font-bold text-white">{t.year} {i + 1}</span>
                        <span className="text-emerald-300 font-mono font-bold text-lg">₹{results.annualMonetaryValue.toLocaleString()}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-black/20 rounded p-2">
                          <div className="text-[10px] text-slate-500 uppercase">{t.totalQada}</div>
                          <div className="text-purple-300 font-medium">{results.annualQadaFasts}</div>
                        </div>
                        <div className="bg-black/20 rounded p-2">
                          <div className="text-[10px] text-slate-500 uppercase">{t.totalRice}</div>
                          <div className="text-slate-200 font-medium">{results.annualFidyaWeightKg}kg</div>
                        </div>
                        <div className="bg-black/20 rounded p-2">
                          <div className="text-[10px] text-slate-500 uppercase">{t.totalSacks}</div>
                          <div className="text-slate-200 font-medium">{results.annualSacks}</div>
                        </div>
                      </div>
                   </div>
                 ))}
              </div>
            )}

            {/* Desktop: Table View */}
            {results && (
              <div className="hidden md:block rounded-2xl bg-white/5 border border-white/10 overflow-hidden shadow-lg">
                <div className="p-5 border-b border-white/10 flex justify-between items-center bg-white/5">
                  <h3 className="font-semibold text-lg text-white">{t.paymentPlan}</h3>
                  <span className="text-xs font-mono text-purple-300 bg-purple-500/20 px-2 py-1 rounded border border-purple-500/30">
                    {paymentYears} {t.year}
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="text-slate-400 border-b border-white/10 bg-black/20">
                        <th className="p-4 font-medium">{t.year}</th>
                        <th className="p-4 font-medium">{t.totalQada}</th>
                        <th className="p-4 font-medium">{t.totalRice} (Kg)</th>
                        <th className="p-4 font-medium">{t.totalSacks}</th>
                        <th className="p-4 font-medium text-right">{t.annualCost}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                      {Array.from({ length: paymentYears }).map((_, i) => (
                        <tr key={i} className="hover:bg-white/5 transition">
                          <td className="p-4 font-medium text-white">{t.year} {i + 1}</td>
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
function InputGroup({ 
  label, 
  value, 
  onChange, 
  compact = false, 
  step = 1 
}: { 
  label: string, 
  value: number, 
  onChange: (v: number) => void, 
  compact?: boolean, 
  step?: number 
}) {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Handle empty deletion safely: send 0 to calculator
    if (val === '') {
      onChange(0);
      return;
    }
    const num = parseFloat(val);
    if (!isNaN(num)) {
      onChange(num);
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500 px-1 truncate">
        {label}
      </label>
      <input
        type="number"
        inputMode="decimal" // Better mobile keyboard
        pattern="[0-9]*"
        step={step}
        // If value is 0, show empty string placeholder so user can type freely without deleting '0'
        value={value === 0 ? '' : value}
        onChange={handleChange}
        placeholder="0"
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