import React from 'react';
import {
  X,
  ShieldCheck,
  AlertTriangle,
  FileCheck2,
  Lightbulb,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { SimulationResult } from '../types';

interface SimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  simulation: SimulationResult | null;
  artifactTitle: string;
}

export const SimulationModal: React.FC<SimulationModalProps> = ({
  isOpen,
  onClose,
  simulation,
  artifactTitle,
}) => {
  if (!isOpen || !simulation) return null;

  const likelihood = simulation.approvalLikelihoodPercent;
  const isHigh = likelihood >= 75;
  const isMedium = likelihood >= 45 && likelihood < 75;

  return (
    <div
      id="simulation-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="simulation-modal-content"
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-7 shadow-2xl space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/15 text-purple-300 border border-purple-500/30">
                Adversarial Stress-Test
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Target: {artifactTitle}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
              Simulated Institutional Adjudication
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Review conducted by simulated role:{' '}
              <strong className="text-amber-300 font-medium">
                {simulation.adjudicatorRole}
              </strong>
            </p>
          </div>

          <button
            type="button"
            id="close-simulation-btn"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Likelihood Meter & Verdict Card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-center items-center text-center">
            <div className="text-xs font-semibold uppercase text-slate-400 mb-1">
              Likelihood of Approval
            </div>
            <div
              className={`text-3xl sm:text-4xl font-black font-mono my-1 ${
                isHigh
                  ? 'text-emerald-400'
                  : isMedium
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}
            >
              {simulation.approvalLikelihoodPercent}%
            </div>
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">
              {simulation.verdict.replace(/_/g, ' ')}
            </div>
          </div>

          <div className="sm:col-span-2 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-center">
            <div className="text-xs font-semibold uppercase text-slate-400 mb-1">
              Adjudicator's Formal Assessment
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
              "{simulation.summaryEvaluation}"
            </p>
          </div>
        </div>

        {/* Bureaucratic Objections & Counter-Mitigations */}
        {simulation.bureaucraticObjections && simulation.bureaucraticObjections.length > 0 && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Anticipated Bureaucratic Objections & Counter-Mitigations
            </h4>
            <div className="space-y-3">
              {simulation.bureaucraticObjections.map((obj, oIdx) => (
                <div
                  key={oIdx}
                  className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-xs sm:text-sm font-semibold text-rose-300">
                      Objection {oIdx + 1}: {obj.objection}
                    </div>
                  </div>
                  <div className="text-xs text-slate-400">
                    <strong className="text-slate-300">Institutional Logic:</strong> {obj.bureaucraticReason}
                  </div>
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2.5 text-xs text-emerald-300 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-emerald-200">Suggested Counter-Mitigation:</strong>{' '}
                      {obj.suggestedMitigation}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Missing Clauses & Recommended Evidence */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {simulation.criticalMissingClauses && simulation.criticalMissingClauses.length > 0 && (
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
              <h5 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4 text-amber-400" />
                Clauses to Insert Before Delivery
              </h5>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {simulation.criticalMissingClauses.map((clause, cIdx) => (
                  <li key={cIdx} className="flex items-start gap-1.5">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{clause}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {simulation.recommendedEvidenceAdditions && simulation.recommendedEvidenceAdditions.length > 0 && (
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
              <h5 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                Supplementary Evidence to Attach
              </h5>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {simulation.recommendedEvidenceAdditions.map((ev, eIdx) => (
                  <li key={eIdx} className="flex items-start gap-1.5">
                    <span className="text-blue-400 font-bold">•</span>
                    <span>{ev}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Tactical Tip */}
        {simulation.tacticalTip && (
          <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Strategic System Leverage Tip
              </div>
              <div className="text-xs text-slate-200 mt-1 leading-relaxed">
                {simulation.tacticalTip}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            Close Stress-Test
          </button>
        </div>
      </div>
    </div>
  );
};
