import React, { useState } from 'react';
import {
  GitCommit,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  ShieldCheck,
  Building,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { ActionStep } from '../types';

interface ActionPathwaysProps {
  steps: ActionStep[];
}

export const ActionPathways: React.FC<ActionPathwaysProps> = ({ steps }) => {
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({
    [steps[0]?.id || 'step_1']: true,
  });

  const toggleComplete = (id: string) => {
    setCompletedSteps((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleExpand = (id: string) => {
    setExpandedSteps((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (!steps || steps.length === 0) return null;

  const totalSteps = steps.length;
  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / totalSteps) * 100);

  return (
    <div id="action-pathways-container" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-lg">
      {/* Header & Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <GitCommit className="w-5 h-5 text-amber-400" />
            Institutional Action Pathway
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Deterministic step-by-step navigation across agencies, statutory filings, and verification checkpoints.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 min-w-[200px]">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400 font-medium">Citizen Progress</span>
            <span className="text-amber-400 font-semibold font-mono">
              {completedCount} of {totalSteps} Complete ({progressPercent}%)
            </span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-4">
        {steps.map((step, index) => {
          const isDone = !!completedSteps[step.id];
          const isExpanded = !!expandedSteps[step.id];

          return (
            <div
              key={step.id || index}
              id={`pathway-step-${step.id || index}`}
              className={`border rounded-xl transition-all ${
                isDone
                  ? 'bg-slate-950/50 border-emerald-500/30'
                  : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Step Header */}
              <div className="p-4 flex items-start justify-between gap-3 cursor-pointer select-none" onClick={() => toggleExpand(step.id)}>
                <div className="flex items-start gap-3">
                  {/* Step Number / Completed Checkbox */}
                  <button
                    type="button"
                    id={`step-checkbox-${step.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleComplete(step.id);
                    }}
                    className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                      isDone
                        ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-400/40'
                        : 'bg-slate-800 text-slate-300 hover:bg-amber-400 hover:text-slate-950'
                    }`}
                    title={isDone ? 'Mark as incomplete' : 'Mark as completed'}
                  >
                    {isDone ? <CheckCircle2 className="w-4 h-4" /> : step.stepNumber || index + 1}
                  </button>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                        {step.actionType || 'Step'}
                      </span>
                      {step.targetAgencyOrSystem && (
                        <span className="text-xs text-amber-300/90 font-medium flex items-center gap-1">
                          <Building className="w-3.5 h-3.5 text-amber-400" />
                          {step.targetAgencyOrSystem}
                        </span>
                      )}
                    </div>
                    <h4
                      className={`text-sm sm:text-base font-semibold transition-all ${
                        isDone ? 'line-through text-slate-400' : 'text-slate-100'
                      }`}
                    >
                      {step.title}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {step.timelineOrDeadline && (
                    <div className="hidden sm:flex items-center gap-1.5 text-xs text-amber-300/80 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{step.timelineOrDeadline}</span>
                    </div>
                  )}

                  <button
                    type="button"
                    className="text-slate-400 hover:text-slate-200 p-1"
                    aria-label={isExpanded ? 'Collapse step' : 'Expand step'}
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Step Expanded Details */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-slate-800/80 space-y-3">
                  {/* Procedural Instruction */}
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Statutory Basis if present */}
                  {step.statutoryCitation && (
                    <div className="bg-slate-900/90 border border-slate-800 rounded-lg px-3 py-2 text-xs flex items-center gap-2 text-slate-300">
                      <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      <span>
                        <strong className="text-slate-200">Legal Authority:</strong> {step.statutoryCitation}
                      </span>
                    </div>
                  )}

                  {/* Required Evidence Checklist */}
                  {step.requiredEvidence && step.requiredEvidence.length > 0 && (
                    <div className="bg-slate-900/60 rounded-lg p-3 border border-slate-800/60">
                      <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-blue-400" />
                        Required Evidentiary Packet Items:
                      </div>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                        {step.requiredEvidence.map((ev, evIdx) => (
                          <li key={evIdx} className="flex items-start gap-2 bg-slate-950/60 px-2.5 py-1.5 rounded border border-slate-800">
                            <span className="text-amber-400 font-bold">•</span>
                            <span>{ev}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Failure Risk Warning */}
                  {step.failureRiskWarning && (
                    <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg px-3 py-2 text-xs flex items-start gap-2 text-rose-200">
                      <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-rose-300">Institutional Vulnerability Warning:</strong>{' '}
                        {step.failureRiskWarning}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
