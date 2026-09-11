import React, { useState } from 'react';
import {
  Zap,
  Clock,
  CheckCircle2,
  Navigation,
  Share2,
  HelpCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  Copy,
  Check,
  Compass,
} from 'lucide-react';
import { ActionPlanData, LifeBridgeProcessedResult, LiveLocationData } from '../types';
import { ExplainableAIPanel } from './ExplainableAIPanel';

interface StageActProps {
  data?: LifeBridgeProcessedResult;
  act: ActionPlanData;
  locationData?: LiveLocationData;
  onStartRoute: () => void;
}

export const StageAct: React.FC<StageActProps> = ({
  data,
  act,
  locationData,
  onStartRoute,
}) => {
  const [showWhy, setShowWhy] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const isCritical = act.priorityLevel === 'critical';
  const isHigh = act.priorityLevel === 'high';

  const handleShare = () => {
    const textToShare = `🚨 LIFEBRIDGE ACTION PLAN [${act.priorityBadge}]\n\n` +
      `⚡ ${act.recommendedExecution}\n` +
      `📌 Reason: ${act.reasonSummary}\n\n` +
      `Actions:\n` +
      act.actionsList.map((a) => `• ${a}`).join('\n') +
      (act.tacticalDetails?.primaryRoute ? `\n\nRoute: ${act.tacticalDetails.primaryRoute}` : '') +
      `\n\n-- Translated via LifeBridge: Humans don't speak APIs. LifeBridge translates.`;

    if (navigator.share) {
      navigator.share({
        title: `LifeBridge: ${act.recommendedExecution}`,
        text: textToShare,
      }).catch(() => {
        navigator.clipboard.writeText(textToShare);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } else {
      navigator.clipboard.writeText(textToShare);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      id="stage-act-container"
      className={`border rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden transition-all ${
        isCritical
          ? 'bg-gradient-to-b from-rose-950/40 via-slate-900 to-slate-900 border-rose-500/50 shadow-rose-500/10'
          : 'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-cyan-500/40 shadow-cyan-500/10'
      }`}
    >
      {/* Top Banner: Stage 4 Header & Priority Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-black text-xs ${
              isCritical
                ? 'bg-rose-500 text-slate-950'
                : 'bg-gradient-to-br from-cyan-400 to-blue-500 text-slate-950'
            }`}
          >
            4
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-wide uppercase flex items-center gap-2">
              <span>STAGE 4: ACT</span>
              <span className="text-xs font-mono font-normal text-slate-400 lowercase">
                (Deterministic Real-World Action Plan)
              </span>
            </h3>
          </div>
        </div>

        {/* Priority Badge */}
        <div
          id="action-priority-badge"
          className={`px-4 py-1.5 rounded-full font-black font-mono text-xs uppercase tracking-wider border shadow-md ${
            isCritical
              ? 'bg-rose-500/20 text-rose-300 border-rose-500 animate-pulse'
              : isHigh
              ? 'bg-amber-500/20 text-amber-300 border-amber-500'
              : 'bg-cyan-500/20 text-cyan-300 border-cyan-500'
          }`}
        >
          {act.priorityBadge}
        </div>
      </div>

      {/* Safety Notice if applicable */}
      {act.safetyNotice && (
        <div className="mb-6 bg-rose-500/15 border border-rose-500/40 rounded-xl p-4 flex items-start gap-3 text-xs sm:text-sm text-rose-200">
          <ShieldAlert className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed font-semibold">
            {act.safetyNotice}
          </div>
        </div>
      )}

      {/* Hero Callout: Recommended Departure / Core Execution */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-6 sm:p-7 mb-6 shadow-inner relative overflow-hidden">
        <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400/90 mb-1 flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-cyan-400" />
          Recommended Execution
        </div>

        <div
          id="recommended-departure-callout"
          className="text-2xl sm:text-4xl font-black text-white tracking-tight my-2"
        >
          {act.recommendedExecution}
        </div>

        {/* Reason Formula */}
        <div className="pt-2 border-t border-slate-800/80 mt-3 text-xs sm:text-sm text-slate-300 flex items-start sm:items-center gap-2">
          <span className="text-slate-500 font-bold uppercase tracking-wider text-[11px] whitespace-nowrap">
            Reason:
          </span>
          <span className="font-semibold text-amber-300 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
            {act.reasonSummary}
          </span>
        </div>
      </div>

      {/* Action Checklist */}
      <div className="mb-6 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          Mandatory Execution Steps:
        </h4>

        <div className="space-y-2">
          {act.actionsList.map((action, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 text-sm text-slate-200 font-medium"
            >
              <div className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center font-mono font-bold text-xs flex-shrink-0 mt-0.5">
                •
              </div>
              <span className="leading-relaxed">{action}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Action Buttons */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        {/* START ROUTE */}
        <button
          type="button"
          id="start-route-btn"
          onClick={onStartRoute}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs sm:text-sm transition-all shadow-lg shadow-cyan-500/25 cursor-pointer"
        >
          <Navigation className="w-4 h-4 text-slate-950 fill-slate-950" />
          <span>START ROUTE</span>
        </button>

        {/* SHARE PLAN */}
        <button
          type="button"
          id="share-plan-btn"
          onClick={handleShare}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-semibold px-5 py-3 rounded-xl text-xs sm:text-sm transition-all cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 font-bold">Plan Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 text-slate-400" />
              <span>SHARE PLAN</span>
            </>
          )}
        </button>

        {/* WHY THIS RECOMMENDATION? Toggle */}
        <button
          type="button"
          id="why-recommendation-btn"
          onClick={() => setShowWhy(!showWhy)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-cyan-300 hover:text-cyan-200 font-semibold px-5 py-3 rounded-xl text-xs sm:text-sm transition-all cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          <span>WHY THIS RECOMMENDATION?</span>
          {showWhy ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* "Why this recommendation?" Detailed Explainable AI Panel */}
      {showWhy && (
        data ? (
          <ExplainableAIPanel
            data={data}
            locationData={
              locationData || {
                status: 'Permission Required',
                latitude: null,
                longitude: null,
                accuracy: null,
                lastUpdated: null,
                errorMessage: null,
              }
            }
          />
        ) : act.whyThisRecommendation && act.whyThisRecommendation.length > 0 ? (
          <div
            id="why-recommendation-panel"
            className="mt-6 pt-6 border-t border-slate-800 space-y-4 bg-slate-950/40 rounded-xl p-4 sm:p-5"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Compass className="w-4 h-4" />
                Causality Breakdown: Verified Inputs That Shaped This Action
              </h4>
              <span className="text-[10px] font-mono text-slate-500">
                Audit Trail
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {act.whyThisRecommendation.map((factor, fIdx) => (
                <div
                  key={fIdx}
                  className="bg-slate-950 border border-slate-800/90 rounded-xl p-3.5 space-y-2"
                >
                  <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span>{factor.inputFactor}</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    <strong className="text-slate-300">Verified Evidence:</strong>{' '}
                    {factor.verifiedEvidence}
                  </div>
                  <div className="text-xs text-cyan-300 bg-cyan-950/40 border border-cyan-500/20 p-2 rounded-lg">
                    <strong className="text-cyan-200">Plan Impact:</strong>{' '}
                    {factor.impactOnPlan}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null
      )}
    </div>
  );
};
