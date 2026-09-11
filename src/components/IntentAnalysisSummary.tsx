import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Building,
  Heart,
  Scale,
  Zap,
} from 'lucide-react';
import { BridgeCompilationResult } from '../types';

interface IntentAnalysisSummaryProps {
  data: BridgeCompilationResult;
}

export const IntentAnalysisSummary: React.FC<IntentAnalysisSummaryProps> = ({ data }) => {
  const { intentAnalysis, targetSystems, systemFailureRiskScore, failureRiskFactors } = data;

  const riskScore = systemFailureRiskScore || 65;
  const isHighRisk = riskScore >= 70;
  const isMedRisk = riskScore >= 40 && riskScore < 70;

  return (
    <div id="intent-analysis-summary" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-lg space-y-6">
      {/* Top Banner: Objective and Risk Meter */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400/10 text-amber-300 border border-amber-400/20">
              {intentAnalysis.humanRightsCategory || 'Societal Protection'}
            </span>
            <span className="text-xs text-slate-400">
              Vulnerability: <strong className="text-slate-300 font-medium">{intentAnalysis.societalVulnerability}</strong>
            </span>
          </div>
          <h3 className="text-xl font-bold text-white leading-snug">
            {intentAnalysis.coreObjective}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 flex items-start gap-1.5">
            <Heart className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <span>
              <strong className="text-slate-200">Fundamental Human Need:</strong> {intentAnalysis.humanNeed}
            </span>
          </p>
        </div>

        {/* System Failure Risk Gauge */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 min-w-[240px] flex items-center gap-4">
          <div className="relative flex items-center justify-center">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="currentColor"
                strokeWidth="5"
                className="text-slate-800"
                fill="transparent"
              />
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="currentColor"
                strokeWidth="5"
                strokeDasharray={163}
                strokeDashoffset={163 - (163 * riskScore) / 100}
                className={isHighRisk ? 'text-rose-500' : isMedRisk ? 'text-amber-500' : 'text-emerald-500'}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <span className="absolute font-mono font-bold text-sm text-white">
              {riskScore}%
            </span>
          </div>

          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Unrepresented Failure Risk
            </div>
            <div className="text-xs text-slate-300 mt-0.5">
              Without institutional translation, citizens typically face procedural dismissal or delay.
            </div>
          </div>
        </div>
      </div>

      {/* Target Complex Systems & Key Contacts */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
          <Building className="w-4 h-4 text-amber-400" />
          Target Complex Systems & Jurisdictional Endpoints
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {targetSystems.map((sys, idx) => (
            <div
              key={idx}
              className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-1.5"
            >
              <div className="text-xs font-semibold text-amber-300">
                {sys.name}
              </div>
              <div className="text-[11px] text-slate-400">
                <span className="text-slate-500">System Type:</span> {sys.systemType}
              </div>
              <div className="text-[11px] text-slate-400">
                <span className="text-slate-500">Jurisdiction:</span> {sys.primaryJurisdiction}
              </div>
              <div className="text-[11px] text-slate-300 font-mono bg-slate-900 px-2 py-0.5 rounded inline-block">
                {sys.keyContactOrPortal}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Institutional Vulnerability Factors */}
      {failureRiskFactors && failureRiskFactors.length > 0 && (
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Institutional Friction Points Neutralized by this Bridge:
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
            {failureRiskFactors.map((factor, fIdx) => (
              <li key={fIdx} className="flex items-start gap-2 bg-slate-900/80 px-2.5 py-1.5 rounded border border-slate-800">
                <span className="text-amber-400 font-bold">•</span>
                <span>{factor}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
