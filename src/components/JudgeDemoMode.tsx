import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  X,
  Play,
  Pause,
  CheckCircle2,
  AlertTriangle,
  Compass,
  MapPin,
  Clock,
  ShieldCheck,
  BrainCircuit,
  FileCheck,
  Activity,
  Layers,
  HelpCircle,
  Car,
  CloudRain,
  Users,
  Navigation,
  ExternalLink,
  Shield,
  Info,
} from 'lucide-react';
import {
  LifeBridgeProcessedResult,
  LiveLocationData,
} from '../types';
import { JUDGE_DEMO_SCENARIO } from '../demoFallbacks';
import { VerificationCenter } from './VerificationCenter';
import { LocationVerificationCard } from './LocationVerificationCard';
import { RiskPriorityAssessment } from './RiskPriorityAssessment';
import { ExplainableAIPanel } from './ExplainableAIPanel';
import { DecisionTimeline } from './DecisionTimeline';
import { EvidenceTrustCenter } from './EvidenceTrustCenter';

interface JudgeDemoModeProps {
  isOpen: boolean;
  onClose: () => void;
  locationData: LiveLocationData;
  onRequestLocation: () => void;
  isRequestingLocation: boolean;
  onStartRoute: () => void;
  onViewFinalDecision?: () => void;
}

const DEMO_STAGES = [
  { id: 1, title: 'HUMAN INTENT', subtitle: 'Raw Input', icon: BrainCircuit },
  { id: 2, title: 'UNDERSTAND', subtitle: 'Interpreted Goal', icon: Sparkles },
  { id: 3, title: 'STRUCTURE', subtitle: 'Parameters', icon: FileCheck },
  { id: 4, title: 'VERIFY', subtitle: 'Verification & Trust', icon: ShieldCheck },
  { id: 5, title: 'LOCATION', subtitle: 'Live GPS Sensor', icon: Compass },
  { id: 6, title: 'RISK & PRIORITY', subtitle: 'Rule Assessment', icon: AlertTriangle },
  { id: 7, title: 'WHY', subtitle: 'Explainable AI', icon: HelpCircle },
  { id: 8, title: 'TIMELINE', subtitle: 'Decision Audit', icon: Clock },
  { id: 9, title: 'ACTION', subtitle: 'Decision Ready', icon: Navigation },
];

export const JudgeDemoMode: React.FC<JudgeDemoModeProps> = ({
  isOpen,
  onClose,
  locationData,
  onRequestLocation,
  isRequestingLocation,
  onStartRoute,
  onViewFinalDecision,
}) => {
  const [currentStage, setCurrentStage] = useState<number>(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [stage4SubView, setStage4SubView] = useState<'checklist' | 'trust_center'>('checklist');
  const demoData = JUDGE_DEMO_SCENARIO;

  // Auto-play feature: 12 seconds per stage = ~108 seconds total (~2 minutes)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAutoPlaying && isOpen) {
      timer = setInterval(() => {
        setCurrentStage((prev) => {
          if (prev < 9) return prev + 1;
          setIsAutoPlaying(false);
          return prev;
        });
      }, 12000);
    }
    return () => clearInterval(timer);
  }, [isAutoPlaying, isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && currentStage < 9) setCurrentStage((s) => s + 1);
      if (e.key === 'ArrowLeft' && currentStage > 1) setCurrentStage((s) => s - 1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStage, onClose]);

  if (!isOpen) return null;

  const handleRestart = () => {
    setCurrentStage(1);
    setIsAutoPlaying(false);
  };

  const progressPercent = Math.round((currentStage / 9) * 100);

  return (
    <div
      id="judge-demo-mode-overlay"
      className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col overflow-hidden text-slate-100 animate-in fade-in duration-200"
    >
      {/* Top Header Bar */}
      <header className="border-b border-slate-800/90 bg-slate-950/90 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-cyan-500/20">
            <Sparkles className="w-5 h-5 text-slate-950" />
          </div>

          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-sm sm:text-base font-black tracking-wide text-white uppercase">
                LIFEBRIDGE JUDGE DEMO MODE
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase tracking-wider animate-pulse">
                JUDGE DEMO • SIMULATED SCENARIO
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              2-Minute Evaluation Flow: Translating Messy Human Need into Deterministic Real-World Action
            </p>
          </div>
        </div>

        {/* Top Control Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Auto-Play Toggle */}
          <button
            type="button"
            id="judge-demo-autoplay-btn"
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold border transition-all cursor-pointer ${
              isAutoPlaying
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-sm shadow-cyan-500/20'
                : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title="Auto-advance through all 9 stages at a 2-minute presentation pace"
          >
            {isAutoPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Auto-Playing (12s)</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">2-Min Tour</span>
              </>
            )}
          </button>

          {/* Restart Demo Button */}
          <button
            type="button"
            id="judge-demo-restart-btn"
            onClick={handleRestart}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Restart demo at Stage 1"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Restart Demo</span>
          </button>

          {/* Exit Modal Button */}
          <button
            type="button"
            id="judge-demo-close-btn"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
            title="Exit Judge Demo Mode"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="w-full bg-slate-900 h-1 relative overflow-hidden flex-shrink-0">
        <div
          className="bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 h-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* 9-Stage Step Navigation Pills Bar */}
      <div className="bg-slate-950/80 border-b border-slate-800/80 px-4 sm:px-6 py-2.5 overflow-x-auto flex-shrink-0">
        <div className="flex items-center justify-between min-w-[780px] gap-2">
          {DEMO_STAGES.map((stg) => {
            const Icon = stg.icon;
            const isActive = stg.id === currentStage;
            const isCompleted = stg.id < currentStage;

            return (
              <button
                key={stg.id}
                type="button"
                id={`judge-stage-pill-${stg.id}`}
                onClick={() => setCurrentStage(stg.id)}
                className={`flex-1 flex items-center gap-2 px-2.5 py-1.5 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-500/10 font-bold'
                    : isCompleted
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/15'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isActive
                      ? 'bg-cyan-400 text-slate-950'
                      : isCompleted
                      ? 'bg-emerald-500/30 text-emerald-300'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isCompleted ? '✓' : stg.id}
                </div>
                <div className="truncate text-left leading-tight">
                  <div className="truncate text-[11px] font-bold">{stg.title}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-5xl mx-auto w-full space-y-6">
        {/* Stage Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-500/30">
              STAGE {currentStage} OF 9
            </span>
            <h3 className="text-lg sm:text-xl font-black tracking-wide text-white uppercase">
              {DEMO_STAGES[currentStage - 1].title}
            </h3>
            <span className="text-xs font-mono text-slate-400 hidden sm:inline">
              ({DEMO_STAGES[currentStage - 1].subtitle})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">
              Scenario: <strong className="text-slate-200">Electronic City → Whitefield</strong>
            </span>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* STAGE 1: HUMAN INTENT */}
        {/* ==================================================================== */}
        {currentStage === 1 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* The Raw Human Request */}
            <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl p-6 sm:p-8 relative shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-3 py-1 rounded-lg flex items-center gap-1.5">
                  <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" />
                  Original User Request
                </span>
                <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-md">
                  DEMO DATA • SIMULATED SCENARIO
                </span>
              </div>

              <blockquote className="text-lg sm:text-2xl font-bold text-white leading-relaxed tracking-wide italic border-l-4 border-cyan-400 pl-4 my-4">
                "{demoData.rawInput}"
              </blockquote>

              <p className="text-xs text-slate-400 font-mono mt-4">
                Captured timestamp: Local Session Entry • Unstructured Natural Language Input
              </p>
            </div>

            {/* The Translation Problem Explanation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-rose-950/20 border border-rose-500/30 rounded-xl p-4 sm:p-5 space-y-2">
                <div className="text-xs font-mono font-bold text-rose-300 uppercase flex items-center gap-1.5">
                  <X className="w-4 h-4 text-rose-400" />
                  What APIs Reject:
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  No public API understands <em>"traffic looks terrible"</em>, <em>"heavy rain"</em>, or <em>"my mother has an appointment"</em>. Real-world services require strict ISO timestamps, GPS polygons, routing endpoints, and vehicle profiles.
                </p>
              </div>

              <div className="bg-cyan-950/20 border border-cyan-500/30 rounded-xl p-4 sm:p-5 space-y-2">
                <div className="text-xs font-mono font-bold text-cyan-300 uppercase flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  How LifeBridge Solves This:
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  LifeBridge acts as the cognitive translation layer. It decomposes natural human intent into verified parameters, checks real-world constraints, and generates deterministic action.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* STAGE 2: UNDERSTAND */}
        {/* ==================================================================== */}
        {currentStage === 2 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Interpreted Goal Highlight */}
            <div className="bg-gradient-to-r from-cyan-950/60 via-slate-900 to-blue-950/60 border border-cyan-500/40 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  Interpreted Core Goal
                </span>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold">
                  Semantic Confidence: 99.4%
                </span>
              </div>

              <div className="text-2xl sm:text-3xl font-black text-white tracking-wide">
                "{demoData.summary}"
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                LifeBridge identified this as a high-stakes, time-sensitive medical transit with an elderly parent where schedule buffers and safe driving dynamics take precedence over shortest road distance.
              </p>
            </div>

            {/* Facts Extracted */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <span>Observable Facts Extracted From Intent:</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {demoData.importantFacts.map((fact, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs text-slate-200"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1 flex-shrink-0" />
                    <span>{fact}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* STAGE 3: STRUCTURE */}
        {/* ==================================================================== */}
        {currentStage === 3 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                    Normalized Parameter Schema
                  </span>
                </div>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/20">
                  Ready for API Dispatches
                </span>
              </div>

              {/* 5 Core Required Parameters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* 1. Origin */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400">Origin:</span>
                  <div className="text-base font-bold text-white flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    <span>{demoData.structured.origin}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">Declared departure anchor</span>
                </div>

                {/* 2. Destination */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400">Destination:</span>
                  <div className="text-base font-bold text-white flex items-center gap-1.5">
                    <Navigation className="w-4 h-4 text-emerald-400" />
                    <span>{demoData.structured.destination}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">Medical Clinic</span>
                </div>

                {/* 3. Deadline */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400">Deadline:</span>
                  <div className="text-base font-bold text-amber-300 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>{demoData.structured.deadline}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">Fixed appointment constraint</span>
                </div>

                {/* 4. Passenger / Context */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400">Passenger / Context:</span>
                  <div className="text-base font-bold text-purple-300 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-purple-400" />
                    <span>{demoData.structured.passenger}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">Needs smooth transit & shelter</span>
                </div>

                {/* 5. Constraints: Weather */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400">Weather Constraint:</span>
                  <div className="text-sm font-bold text-sky-300 flex items-center gap-1.5">
                    <CloudRain className="w-4 h-4 text-sky-400" />
                    <span>{demoData.structured.weather}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">Waterlogging risk active</span>
                </div>

                {/* 6. Constraints: Traffic */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400">Traffic Constraint:</span>
                  <div className="text-sm font-bold text-rose-300 flex items-center gap-1.5">
                    <Car className="w-4 h-4 text-rose-400" />
                    <span>{demoData.structured.traffic}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">+42m delay via Silk Board</span>
                </div>
              </div>

              {/* JSON preview callout */}
              <div className="bg-slate-950 rounded-xl p-4 border border-slate-800/80 font-mono text-[11px] text-slate-400 space-y-1">
                <div className="text-cyan-400 font-bold mb-1">// Deterministic API Payload Generated:</div>
                <div className="text-slate-300">
                  {JSON.stringify(
                    {
                      intent: demoData.intent,
                      origin: demoData.structured.origin,
                      destination: demoData.structured.destination,
                      deadline: demoData.structured.deadline,
                      passenger: demoData.structured.passenger,
                      priority: demoData.structured.priority,
                    },
                    null,
                    2
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* STAGE 4: VERIFY */}
        {/* ==================================================================== */}
        {currentStage === 4 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Stage 4 Sub-View Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 rounded-xl p-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-slate-300">
                  <strong>Verification & Ground-Truth Provenance:</strong>
                </span>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  id="stage4-tab-checklist"
                  onClick={() => setStage4SubView('checklist')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    stage4SubView === 'checklist'
                      ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  8-Point Checklist
                </button>
                <button
                  type="button"
                  id="stage4-tab-trust-center"
                  onClick={() => setStage4SubView('trust_center')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    stage4SubView === 'trust_center'
                      ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>Evidence & Trust Center</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </button>
              </div>
            </div>

            {stage4SubView === 'checklist' ? (
              <VerificationCenter
                data={demoData}
                locationData={locationData}
                onRequestLocation={onRequestLocation}
                isRequestingLocation={isRequestingLocation}
              />
            ) : (
              <EvidenceTrustCenter
                data={demoData}
                locationData={locationData}
                onRequestLocation={onRequestLocation}
                isRequestingLocation={isRequestingLocation}
              />
            )}
          </div>
        )}

        {/* ==================================================================== */}
        {/* STAGE 5: LOCATION */}
        {/* ==================================================================== */}
        {currentStage === 5 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-cyan-400" />
                <span>
                  <strong>Real Device Location Verification:</strong> Connects to actual W3C browser Geolocation sensor. Never fabricates fake coordinates.
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">
                Live Sensor Audit
              </span>
            </div>

            <LocationVerificationCard
              locationData={locationData}
              onRequestLocation={onRequestLocation}
              isRequestingLocation={isRequestingLocation}
              statedOrigin={demoData.structured.origin}
            />

            {/* Transparent Location Comparison Callout */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-cyan-400" />
                Origin Comparison Audit:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-mono text-[10px] uppercase">Declared Stated Origin:</span>
                  <div className="font-bold text-white text-sm">{demoData.structured.origin}</div>
                  <p className="text-slate-400 text-[11px]">Extracted from user prompt.</p>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-mono text-[10px] uppercase">Hardware GPS Sensor Status:</span>
                  <div className="font-bold text-cyan-300 text-sm">
                    {locationData.status === 'Location Verified'
                      ? `${locationData.latitude?.toFixed(4)}°, ${locationData.longitude?.toFixed(4)}° (±${Math.round(locationData.accuracy || 0)}m)`
                      : locationData.status}
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    {locationData.status === 'Location Verified'
                      ? 'Live GPS fix acquired from browser.'
                      : 'Requires user permission; no fake coordinates used.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* STAGE 6: RISK & PRIORITY */}
        {/* ==================================================================== */}
        {currentStage === 6 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>
                  <strong>Risk & Priority Engine:</strong> Transparent, rule-based priority evaluation. No unexplained black-box scoring.
                </span>
              </div>
              <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded font-bold">
                Rule-Based Engine
              </span>
            </div>

            <RiskPriorityAssessment data={demoData} locationData={locationData} />
          </div>
        )}

        {/* ==================================================================== */}
        {/* STAGE 7: WHY (EXPLAINABLE RECOMMENDATION) */}
        {/* ==================================================================== */}
        {currentStage === 7 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-cyan-400" />
                <span>
                  <strong>Explainable AI (XAI) Causality:</strong> Tracing the complete decision chain from input evidence to final plan calibration.
                </span>
              </div>
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded font-bold">
                Traceable Causality
              </span>
            </div>

            <ExplainableAIPanel data={demoData} locationData={locationData} />
          </div>
        )}

        {/* ==================================================================== */}
        {/* STAGE 8: TIMELINE */}
        {/* ==================================================================== */}
        {currentStage === 8 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>
                  <strong>Decision Timeline:</strong> Real-time chronological audit ledger recording observable application states across all 9 milestones.
                </span>
              </div>
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded font-bold">
                Local Event Chronology
              </span>
            </div>

            <DecisionTimeline
              data={demoData}
              locationData={locationData}
              onRequestLocation={onRequestLocation}
              isRequestingLocation={isRequestingLocation}
            />
          </div>
        )}

        {/* ==================================================================== */}
        {/* STAGE 9: ACTION & DECISION READY SUMMARY */}
        {/* ==================================================================== */}
        {currentStage === 9 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Prominent DECISION READY Banner */}
            <div
              id="judge-decision-ready-banner"
              className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-cyan-950/80 border-2 border-emerald-500/60 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-4 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                      Processing Pipeline Complete
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
                      DECISION READY
                    </h2>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                  {onViewFinalDecision && (
                    <button
                      type="button"
                      id="judge-view-final-decision-btn"
                      onClick={() => {
                        onClose();
                        onViewFinalDecision();
                      }}
                      className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 py-3 rounded-xl text-xs sm:text-sm transition-all shadow-lg shadow-emerald-500/25 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4 fill-slate-950" />
                      <span>VIEW FINAL DECISION</span>
                    </button>
                  )}

                  <button
                    type="button"
                    id="judge-start-route-btn"
                    onClick={() => {
                      onClose();
                      onStartRoute();
                    }}
                    className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black px-5 py-3 rounded-xl text-xs sm:text-sm transition-all shadow-lg shadow-cyan-500/25 cursor-pointer"
                  >
                    <Navigation className="w-4 h-4 fill-slate-950" />
                    <span>START ROUTE SIMULATION</span>
                  </button>
                </div>
              </div>

              {/* Recommended Action Card */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                  Recommended Execution Plan:
                </span>
                <div className="text-lg sm:text-xl font-bold text-white">
                  {demoData.act.recommendedExecution} via Elevated Expressway & Varthur Bypass
                </div>
                <div className="space-y-1.5 pt-2">
                  {demoData.act.actionsList.map((actStep, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                      <span className="text-cyan-400 font-mono font-bold">•</span>
                      <span>{actStep}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Concise 5-Point Judge Summary */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  Concise Executive Summary for Evaluation:
                </h4>
                <span className="text-[10px] font-mono text-slate-500">5-Point Verification Audit</span>
              </div>

              <div className="space-y-3.5 text-xs">
                {/* 1. Goal */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-slate-400 font-mono font-bold uppercase text-[10px] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    1. Goal:
                  </div>
                  <p className="text-slate-100 font-semibold text-sm">
                    Reach the appointment safely and on time with mother.
                  </p>
                </div>

                {/* 2. Verified Evidence */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-slate-400 font-mono font-bold uppercase text-[10px] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    2. Verified Evidence:
                  </div>
                  <p className="text-slate-200 leading-relaxed">
                    User input intent parsed, hard 5:30 PM appointment deadline extracted, simulated Doppler storm radar confirmed heavy precipitation (34 mm/hr), simulated road congestion sensors confirmed +42m delay, and device location verified via browser Geolocation API (or flagged as pending).
                  </p>
                </div>

                {/* 3. Important Risks */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-slate-400 font-mono font-bold uppercase text-[10px] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                    3. Important Risks:
                  </div>
                  <p className="text-slate-200 leading-relaxed">
                    Compounding arterial gridlock on Hosur Road / Silk Board (+42m delay), localized hydroplaning & waterlogging on Marathahalli underpass, reduced road friction, and elderly passenger comfort considerations.
                  </p>
                </div>

                {/* 4. Recommended Action */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-cyan-500/20 space-y-1">
                  <div className="text-cyan-400 font-mono font-bold uppercase text-[10px] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    4. Recommended Action:
                  </div>
                  <p className="text-cyan-200 font-bold leading-relaxed">
                    Depart by 4:00 PM (providing an 80-minute transit window including 18-minute weather margin) via the Elevated Electronic City Tollway & Varthur Bypass; target sheltered patient porch entrance at Whitefield clinic.
                  </p>
                </div>

                {/* 5. What Information Still Needs Confirmation */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-amber-500/20 space-y-1">
                  <div className="text-amber-400 font-mono font-bold uppercase text-[10px] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    5. What Information Still Needs Confirmation:
                  </div>
                  <p className="text-amber-200/90 leading-relaxed">
                    Physical departure origin coordinates (if browser GPS permission was withheld) and live real-time road clearance check immediately prior to getting on the elevated expressway.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer Navigation Controls */}
      <footer className="border-t border-slate-800/90 bg-slate-950/90 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4 flex-shrink-0">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>Stage {currentStage} / 9</span>
          <span className="hidden sm:inline">• Use ← / → arrows to navigate</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Previous Stage Button */}
          <button
            type="button"
            id="judge-prev-stage-btn"
            disabled={currentStage === 1}
            onClick={() => setCurrentStage((s) => Math.max(1, s - 1))}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          {/* Next Stage Button */}
          {currentStage < 9 ? (
            <button
              type="button"
              id="judge-next-stage-btn"
              onClick={() => setCurrentStage((s) => Math.min(9, s + 1))}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
            >
              <span>Next: {DEMO_STAGES[currentStage].title}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              {onViewFinalDecision && (
                <button
                  type="button"
                  id="judge-footer-decision-btn"
                  onClick={() => {
                    onClose();
                    onViewFinalDecision();
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 fill-slate-950" />
                  <span>View Final Decision</span>
                </button>
              )}
              <button
                type="button"
                id="judge-restart-footer-btn"
                onClick={handleRestart}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all border border-slate-700 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restart</span>
              </button>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
};
