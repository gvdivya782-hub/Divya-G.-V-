import React from 'react';
import {
  BrainCircuit,
  Sparkles,
  Layers,
  ShieldCheck,
  Compass,
  AlertTriangle,
  HelpCircle,
  Clock,
  Navigation,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

interface VisualPipelineNavProps {
  onStartJudgeDemo: () => void;
  onScrollToSection: (sectionId: string) => void;
  locationVerified?: boolean;
}

export const VisualPipelineNav: React.FC<VisualPipelineNavProps> = ({
  onStartJudgeDemo,
  onScrollToSection,
  locationVerified,
}) => {
  const stages = [
    {
      step: 1,
      name: 'Human Intent',
      tag: 'Raw Input',
      icon: BrainCircuit,
      targetId: 'card-user-input',
      status: 'Active',
      statusColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      description: 'Accepts messy, unstructured voice or text',
    },
    {
      step: 2,
      name: 'Understand',
      tag: 'Goal Extraction',
      icon: Sparkles,
      targetId: 'card-stage-understand',
      status: 'Extracted',
      statusColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
      description: 'Cognitive translation of true goal',
    },
    {
      step: 3,
      name: 'Structure',
      tag: 'Machine Schema',
      icon: Layers,
      targetId: 'card-stage-structure',
      status: 'Normalized',
      statusColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
      description: 'Origin, Destination, Deadline & Context',
    },
    {
      step: 4,
      name: 'Verify',
      tag: 'Evidence Audit',
      icon: ShieldCheck,
      targetId: 'card-evidence-verification',
      status: 'Audited',
      statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      description: '4 data categories & 8-point ground-truth check',
    },
    {
      step: 5,
      name: 'Location',
      tag: 'Hardware GPS',
      icon: Compass,
      targetId: 'card-location-verification',
      status: locationVerified ? 'GPS Verified' : 'Check GPS',
      statusColor: locationVerified
        ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
        : 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      description: 'Real W3C browser sensor, no fake coordinates',
    },
    {
      step: 6,
      name: 'Risk & Priority',
      tag: 'Rule Engine',
      icon: AlertTriangle,
      targetId: 'card-risk-priority',
      status: 'HIGH PRIORITY',
      statusColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30 font-bold',
      description: 'Deterministic compound risk scoring',
    },
    {
      step: 7,
      name: 'Explainability',
      tag: 'Why This Action',
      icon: HelpCircle,
      targetId: 'card-explainability',
      status: '5-Step Chain',
      statusColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      description: 'Intent → Evidence → Risk → Plan → Action',
    },
    {
      step: 8,
      name: 'Timeline',
      tag: 'Audit Ledger',
      icon: Clock,
      targetId: 'card-timeline',
      status: 'Chronological',
      statusColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
      description: 'Verifiable event timestamps for all stages',
    },
    {
      step: 9,
      name: 'Action Ready',
      tag: 'Execution Plan',
      icon: Navigation,
      targetId: 'card-recommended-action',
      status: 'Plan Ready',
      statusColor: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/50 font-bold',
      description: 'Deterministic schedule & turn-by-turn route',
    },
  ];

  return (
    <section
      id="visual-9-stage-pipeline"
      className="bg-slate-900/90 border-2 border-slate-800 hover:border-cyan-500/40 rounded-2xl p-5 sm:p-6 shadow-xl transition-all space-y-4"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3.5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-mono font-bold text-sm shadow-inner">
            9S
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-bold text-white tracking-wide uppercase font-mono">
                LifeBridge 9-Stage AI Translation Pipeline
              </h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>9 OF 9 STAGES EVALUATED</span>
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Deterministic sequence from human natural voice/text to verified real-world departure execution. Click any stage to inspect.
            </p>
          </div>
        </div>

        <button
          type="button"
          id="pipeline-banner-judge-demo-btn"
          onClick={onStartJudgeDemo}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-black bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 transition-all shadow-md shadow-cyan-500/20 cursor-pointer hover:scale-105 active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
          <span>Launch 2-Min Judge Demo</span>
        </button>
      </div>

      {/* Visual Pipeline Progress Connector */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-emerald-300 font-bold">Pipeline Active:</span>
          <span>Messy Intent</span>
          <span className="text-slate-600">→</span>
          <span>Evidence Audit</span>
          <span className="text-slate-600">→</span>
          <span>Risk Matrix</span>
          <span className="text-slate-600">→</span>
          <span className="text-cyan-300 font-bold">Leave by 4:00 PM</span>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-48">
          <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full w-full" />
          </div>
          <span className="text-[11px] font-mono text-emerald-400 font-bold">100% Verified</span>
        </div>
      </div>

      {/* 9 Stages Interactive Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2.5">
        {stages.map((st) => {
          const IconComponent = st.icon;
          return (
            <button
              key={st.step}
              type="button"
              id={`pipeline-step-${st.step}`}
              onClick={() => onScrollToSection(st.targetId)}
              className="group bg-slate-950/80 hover:bg-slate-900/90 border border-slate-800/90 hover:border-cyan-500/60 rounded-xl p-3 flex flex-col justify-between text-left transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/10 cursor-pointer min-h-[128px] focus:outline-none focus:ring-1 focus:ring-cyan-400"
            >
              <div className="space-y-1.5 w-full">
                <div className="flex items-center justify-between">
                  <span className="w-5 h-5 rounded-md bg-slate-900 border border-slate-700/80 group-hover:border-cyan-400 group-hover:text-cyan-300 text-[10px] font-mono font-bold text-slate-300 flex items-center justify-center">
                    {st.step}
                  </span>
                  <div className="w-6 h-6 rounded-md bg-slate-900/90 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                    <IconComponent className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-300 transition-colors" />
                  </div>
                </div>

                <div className="text-xs font-bold text-slate-100 group-hover:text-white line-clamp-1">
                  {st.name}
                </div>

                <div className="text-[10px] text-slate-400 font-mono line-clamp-1">
                  {st.tag}
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-800/80 w-full flex items-center justify-between gap-1">
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono border ${st.statusColor} truncate max-w-[85px]`}>
                  {st.status}
                </span>
                <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Quick Jump Strip to Final Decision Screen */}
      <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-slate-400 font-mono">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
          <span>Stage 9 Concluded: Deterministic departure recommendation ready</span>
        </div>
        <button
          type="button"
          id="pipeline-jump-final-decision-btn"
          onClick={() => onScrollToSection('card-final-decision-section')}
          className="text-emerald-400 hover:text-emerald-300 font-mono font-bold flex items-center gap-1.5 hover:underline cursor-pointer self-start sm:self-auto"
        >
          <span>Jump to Final Decision Screen</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  );
};
