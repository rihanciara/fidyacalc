// src/app/guide/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { translations, Language } from '@/utils/translations';
import { ArrowLeft, BookOpen, Languages } from 'lucide-react';

export default function GuidePage() {
  const [lang, setLang] = useState<Language>('en');
  const t = translations[lang];

  return (
    <main className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-100 font-sans selection:bg-purple-500/30 pb-20">
      
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        
        {/* Navigation Bar */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">{t.backHome}</span>
          </Link>

          <button 
            onClick={() => setLang(lang === 'en' ? 'ml' : 'en')}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition text-sm font-medium"
          >
            <Languages size={16} className="text-purple-300" />
            {lang === 'en' ? 'മലയാളം' : 'English'}
          </button>
        </div>

        {/* Title */}
        <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-6">
          <div className="p-3 bg-purple-500/20 rounded-xl">
            <BookOpen size={32} className="text-purple-400" />
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-white tracking-tight">
            {t.guideTitle}
          </h1>
        </div>

        {/* Content Cards */}
        <div className="space-y-6">
          <InfoCard title={t.sec1Title} text={t.sec1Text} />
          <InfoCard title={t.sec2Title} text={t.sec2Text} highlight />
          <InfoCard title={t.sec3Title} text={t.sec3Text} />
          <InfoCard title={t.sec4Title} text={t.sec4Text} />
          <InfoCard title={t.sec5Title} text={t.sec5Text} highlight />
        </div>

      </div>
    </main>
  );
}

function InfoCard({ title, text, highlight = false }: { title: string, text: string, highlight?: boolean }) {
  return (
    <div className={`p-6 rounded-2xl border ${highlight ? 'bg-purple-900/10 border-purple-500/30' : 'bg-white/5 border-white/10'} shadow-lg backdrop-blur-sm transition hover:bg-white/10`}>
      <h2 className={`text-lg md:text-xl font-bold mb-3 ${highlight ? 'text-purple-300' : 'text-emerald-300'}`}>
        {title}
      </h2>
      <p className="text-slate-300 leading-relaxed whitespace-pre-line text-sm md:text-base">
        {text.split('**').map((chunk, i) => 
          i % 2 === 1 ? <strong key={i} className="text-white font-semibold">{chunk}</strong> : chunk
        )}
      </p>
    </div>
  );
}