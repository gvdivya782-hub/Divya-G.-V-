import React from 'react';
import { Sparkles, CheckCircle, Info, BrainCircuit } from 'lucide-react';
import { LifeBridgeProcessedResult } from '../types';

interface StageUnderstandProps {
  data: LifeBridgeProcessedResult;
}

export const StageUnderstand: React.FC<StageUnderstandProps> = ({ data }) => {
  return (
    <div id="stage-understand-container" className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Stage Number & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center font-mono font-bold text-xs">
            1
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-wide uppercase flex items-center gap-2">
              <span>STAGE 1: UNDERSTAND</span>
              <span className="text-xs font-mono font-normal text-cyan-400 lowercase">
                (Gemini Cognitive Extraction)
              </span>
            </h3>
          </div>
        </div>

        {/* Intent Badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Detected Intent:</span>
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-400/10 text-cyan-300 border border-cyan-400/30 font-mono flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            {data.intent}
          </span>
        </div>
      </div>

      {/* Synopsis */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 sm:p-4 mb-4">
        <div className="text-[11px] uppercase font-bold tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
          <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" />
          Semantic Understanding
        </div>
        <p className="text-sm text-slate-200 leading-relaxed font-medium">
          {data.summary}
        </p>
      </div>

      {/* Grid: Important Facts & Required System Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Important Facts */}
        <div className="bg-slate-950/50 border border-slate-800/70 rounded-xl p-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2.5 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            Extracted Real-World Facts
          </div>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {data.importantFacts.map((fact, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
                <span className="text-cyan-400 font-bold">•</span>
                <span className="font-medium text-slate-200">{fact}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Required Sub-Actions */}
        <div className="bg-slate-950/50 border border-slate-800/70 rounded-xl p-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2.5 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            System Verification Pipeline Triggered
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {data.actions_required.map((act, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 bg-slate-900/60 border border-cyan-500/20 text-cyan-200 text-xs px-3 py-2 rounded-lg font-mono font-medium"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="capitalize">{act}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
