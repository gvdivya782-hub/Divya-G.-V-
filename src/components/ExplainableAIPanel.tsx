import React, { useState } from 'react';
import {
  HelpCircle,
  ArrowDown,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Car,
  CloudRain,
  Users,
  Compass,
  Database,
  Layers,
  Sparkles,
  Info,
  AlertTriangle,
  FileText,
  Radio,
  ExternalLink,
} from 'lucide-react';
import {
  LifeBridgeProcessedResult,
  LiveLocationData,
  ExplainableFactor,
  FactorEvidenceStatus,
} from '../types';

interface ExplainableAIPanelProps {
  data: LifeBridgeProcessedResult;
  locationData: LiveLocationData;
}

export const ExplainableAIPanel: React.FC<ExplainableAIPanelProps> = ({
  data,
  locationData,
}) => {
  const { structured, verifications, act, intent } = data;

  // Build the list of observable factors that shaped the recommendation
  const factors: ExplainableFactor[] = [];

  // 1. Appointment / Deadline
  if (structured?.deadline && structured.deadline !== 'N/A') {
    factors.push({
      id: 'deadline',
      factorName: 'Appointment / Deadline',
      detectedInfo: `Appointment deadline identified at ${structured.deadline}.`,
      status: 'Verified from user input',
      decisionImpact: 'Creates a fixed, non-negotiable arrival milestone with zero margin for delays.',
      recommendationChange: `Forces departure time to be calculated backwards to ensure arrival before ${structured.deadline}.`,
      sourceCategory: 'User input',
    });
  } else if (structured?.priority === 'critical') {
    factors.push({
      id: 'urgency',
      factorName: 'Immediate Urgency',
      detectedInfo: 'Emergency in-situ incident detected requiring immediate response.',
      status: 'Verified from user input',
      decisionImpact: 'Eliminates scheduling leeway; mandates immediate protocol activation.',
      recommendationChange: 'Dispatches instant safety actions without queuing or delays.',
      sourceCategory: 'User input',
    });
  }

  // 2. Traffic
  const trafficItem = verifications.find((v) =>
    v.service.toLowerCase().includes('traffic') || v.result.toLowerCase().includes('congestion')
  );
  if (trafficItem || (structured?.traffic && structured.traffic !== 'N/A')) {
    factors.push({
      id: 'traffic',
      factorName: 'Traffic Conditions',
      detectedInfo: trafficItem?.result || structured?.traffic || 'Severe arterial congestion',
      status: 'Demo/Simulated',
      decisionImpact: 'Increases estimated transit time and narrows buffer leeway.',
      recommendationChange: 'Selects the Elevated Expressway and bypass route to avoid severe surface bottlenecks.',
      sourceCategory: 'Traffic data',
    });
  }

  // 3. Weather
  const weatherItem = verifications.find((v) =>
    v.service.toLowerCase().includes('weather') || v.result.toLowerCase().includes('rain')
  );
  if (weatherItem || (structured?.weather && structured.weather !== 'N/A')) {
    factors.push({
      id: 'weather',
      factorName: 'Weather Conditions',
      detectedInfo: weatherItem?.result || structured?.weather || 'Heavy rainfall',
      status: 'Demo/Simulated',
      decisionImpact: 'Adds travel hazards, reduces road grip, and requires slower driving speeds.',
      recommendationChange: 'Adds an 18-minute rain safety buffer and reroutes away from flood-prone underpasses.',
      sourceCategory: 'Weather data',
    });
  }

  // 4. Passenger Context
  if (structured?.passenger && structured.passenger !== 'N/A') {
    const isMother = structured.passenger.toLowerCase().includes('mother');
    factors.push({
      id: 'passenger',
      factorName: 'Passenger Context',
      detectedInfo: `${structured.passenger} is traveling.`,
      status: 'Verified from user input',
      decisionImpact: 'Safety, comfort, and physical access require additional consideration.',
      recommendationChange: isMother
        ? 'Targets a sheltered hospital porch drop-off and avoids rough construction bypasses.'
        : 'Accommodates special passenger transit and safety comfort needs.',
      sourceCategory: 'User input',
    });
  } else if (structured?.contextSubject && structured.contextSubject !== 'N/A') {
    factors.push({
      id: 'context',
      factorName: 'Environmental Context',
      detectedInfo: `In-situ subject: ${structured.contextSubject}`,
      status: 'Verified from user input',
      decisionImpact: 'Establishes the physical boundaries and immediate victim safeguards.',
      recommendationChange: 'Focuses actions directly on localized shelter, ventilation, and emergency contact.',
      sourceCategory: 'Other context',
    });
  }

  // 5. Device Location
  if (locationData.status === 'Location Verified') {
    factors.push({
      id: 'location',
      factorName: 'Device Location',
      detectedInfo: `Hardware GPS coordinates verified: ${locationData.latitude?.toFixed(4)}°, ${locationData.longitude?.toFixed(4)}° (±${Math.round(locationData.accuracy || 0)}m)${locationData.placeName ? ` near ${locationData.placeName}` : ''}.`,
      status: 'Live Sensor GPS',
      decisionImpact: 'Confirms physical departure origin using real browser hardware sensors.',
      recommendationChange: 'Pins turn-by-turn navigation starting waypoint directly to current device coordinates.',
      sourceCategory: 'Device location',
    });
  } else if (locationData.status === 'Permission Denied') {
    factors.push({
      id: 'location',
      factorName: 'Device Location',
      detectedInfo: 'Browser location permission was denied by user.',
      status: 'Needs confirmation ⚠️',
      decisionImpact: 'Hardware departure fix is unverified; relies entirely on stated origin.',
      recommendationChange: `Prompts user to confirm stated departure origin (${structured?.origin || 'N/A'}) before starting route.`,
      sourceCategory: 'Device location',
    });
  } else if (locationData.status === 'Location Unavailable') {
    factors.push({
      id: 'location',
      factorName: 'Device Location',
      detectedInfo: 'Device location service is temporarily unavailable.',
      status: 'Not available',
      decisionImpact: 'Device GPS unavailable; recommendation falls back to declared origin.',
      recommendationChange: 'Applies standard departure corridor assumptions from declared origin.',
      sourceCategory: 'Device location',
    });
  } else {
    // Permission Required / Pending
    factors.push({
      id: 'location',
      factorName: 'Device Location',
      detectedInfo: 'Awaiting browser geolocation permission.',
      status: 'Needs confirmation ⚠️',
      decisionImpact: 'Departure coordinates are unverified until GPS permission is granted.',
      recommendationChange: 'Requires user to allow location or confirm departure point prior to route navigation.',
      sourceCategory: 'Device location',
    });
  }

  // Final decision summary
  const finalDecisionText =
    act.priorityLevel === 'critical'
      ? 'Critical priority because immediate in-situ emergency conditions demand instant protocol execution.'
      : act.priorityLevel === 'high'
      ? 'High priority because multiple verified factors (fixed appointment, heavy rain, and severe traffic) compound together to create significant time pressure and travel risk.'
      : 'Moderate priority with balanced travel leeway and standard safety margins.';

  const recommendedActionText =
    act.recommendedExecution ||
    'Leave with an appropriate buffer and choose the safest available option.';

  const getStatusBadge = (status: FactorEvidenceStatus) => {
    switch (status) {
      case 'Verified from user input':
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Verified from user input
          </span>
        );
      case 'Live Sensor GPS':
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-200 border border-emerald-400/40 whitespace-nowrap shadow-sm">
            <Compass className="w-3 h-3 text-emerald-400" />
            Live Sensor GPS
          </span>
        );
      case 'Demo/Simulated':
        return (
          <span
            className="flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-medium bg-blue-500/15 text-blue-300 border border-blue-500/30 whitespace-nowrap"
            title="Simulated sensor feed for hackathon demo"
          >
            <Database className="w-3 h-3 text-blue-400" />
            Demo/Simulated (Not live API)
          </span>
        );
      case 'Needs confirmation ⚠️':
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 whitespace-nowrap">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            Needs confirmation ⚠️
          </span>
        );
      case 'Not available':
      default:
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-medium bg-slate-800 text-slate-400 border border-slate-700 whitespace-nowrap">
            <HelpCircle className="w-3 h-3 text-slate-500" />
            Not available
          </span>
        );
    }
  };

  const getFactorIcon = (id: string) => {
    switch (id) {
      case 'deadline':
      case 'urgency':
        return <Clock className="w-4 h-4 text-amber-400" />;
      case 'traffic':
        return <Car className="w-4 h-4 text-rose-400" />;
      case 'weather':
        return <CloudRain className="w-4 h-4 text-sky-400" />;
      case 'passenger':
      case 'context':
        return <Users className="w-4 h-4 text-purple-400" />;
      case 'location':
        return <Compass className="w-4 h-4 text-emerald-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div
      id="explainable-ai-panel"
      className="mt-6 pt-6 border-t border-slate-800 space-y-6 bg-slate-950/70 rounded-2xl p-5 sm:p-7 relative overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center">
              <Compass className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-black tracking-wider text-white uppercase flex items-center gap-2">
                <span>WHY THIS RECOMMENDATION?</span>
                <span className="text-xs font-mono text-cyan-400 font-normal lowercase hidden sm:inline">
                  (Explainable AI Decision Trace)
                </span>
              </h4>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            A transparent audit trail showing exactly how detected evidence and operational risk shaped the final action.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">
            Causality Engine v3.1
          </span>
        </div>
      </div>

      {/* 5-Step Reasoning Chain Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 sm:p-4">
        <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2.5">
          Reasoning Chain:
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono font-bold">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>USER INTENT</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-600 hidden sm:inline" />
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>VERIFIED EVIDENCE</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-600 hidden sm:inline" />
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>RISK / PRIORITY</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-600 hidden sm:inline" />
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            <span>PLAN IMPACT</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-600 hidden sm:inline" />
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-white border border-cyan-500/40">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-300" />
            <span>RECOMMENDED ACTION</span>
          </div>
        </div>
      </div>

      {/* The Step-by-Step Evidence Chain with Connecting Arrows (↓) */}
      <div className="space-y-4">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
          <span>Observable Evidence Breakdown:</span>
          <span className="text-[11px] font-mono text-slate-500 normal-case">
            {factors.length} verified/declared factors
          </span>
        </div>

        <div className="space-y-3">
          {factors.map((factor, index) => {
            const isLast = index === factors.length - 1;

            return (
              <React.Fragment key={factor.id}>
                <div
                  id={`xai-factor-${factor.id}`}
                  className="bg-slate-900/90 border border-slate-800/90 hover:border-cyan-500/40 rounded-xl p-4 sm:p-5 transition-all space-y-3.5"
                >
                  {/* Top Bar: Factor Number & Status Badge */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center flex-shrink-0">
                        {getFactorIcon(factor.id)}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-cyan-400">
                          {index + 1}.
                        </span>
                        <span className="text-sm font-bold text-white tracking-wide">
                          {factor.factorName}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span className="text-[10px] font-mono text-slate-500 hidden md:inline">
                        Source: {factor.sourceCategory}
                      </span>
                      {getStatusBadge(factor.status)}
                    </div>
                  </div>

                  {/* The 4-Part Explanation Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-xs">
                    {/* 1. What information was detected */}
                    <div className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-3 space-y-1">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                        1. Detected Evidence
                      </span>
                      <p className="text-slate-200 font-medium leading-relaxed">
                        {factor.detectedInfo}
                      </p>
                    </div>

                    {/* 2 & 3. How it affected the decision */}
                    <div className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-3 space-y-1">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 block">
                        2. Impact on Decision
                      </span>
                      <p className="text-slate-300 leading-relaxed">
                        {factor.decisionImpact}
                      </p>
                    </div>

                    {/* 4. How it changed the final recommendation */}
                    <div className="bg-cyan-950/20 border border-cyan-500/20 rounded-lg p-3 space-y-1">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-300 block">
                        3. Plan Calibration
                      </span>
                      <p className="text-cyan-200 font-semibold leading-relaxed">
                        {factor.recommendationChange}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Downward Connector Arrow between steps */}
                {!isLast && (
                  <div className="flex justify-center py-1">
                    <div className="w-6 h-6 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                      <ArrowDown className="w-3.5 h-3.5" />
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Synthesis Arrow down to Final Decision */}
      <div className="flex justify-center py-1">
        <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 animate-bounce">
          <ArrowDown className="w-4 h-4" />
        </div>
      </div>

      {/* Final Decision & Recommended Action Box */}
      <div
        id="xai-final-decision-container"
        className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-cyan-500/40 rounded-xl p-4 sm:p-6 space-y-4 shadow-xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* FINAL DECISION */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-2">
            <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>FINAL DECISION</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
              {finalDecisionText}
            </p>
            <div className="text-[10px] font-mono text-slate-500">
              Deterministic priority classification based on verified compound factors
            </div>
          </div>

          {/* RECOMMENDED ACTION */}
          <div className="bg-slate-950/90 border border-cyan-500/30 rounded-xl p-4 flex flex-col justify-between space-y-2">
            <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
              <span>RECOMMENDED ACTION</span>
            </div>
            <p className="text-xs sm:text-sm text-white font-bold leading-relaxed">
              {recommendedActionText}
            </p>
            <div className="text-[10px] font-mono text-cyan-400/70">
              Direct deterministic output generated for immediate execution
            </div>
          </div>
        </div>

        {/* Evidence Used Area */}
        <div className="pt-4 border-t border-slate-800/80 space-y-2">
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-slate-400" />
            <span>Evidence Used (Data Sources Available To Application):</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* User Input */}
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono bg-slate-900 border border-slate-700 text-slate-200">
              <FileText className="w-3 h-3 text-cyan-400" />
              <span>User input: Intent & constraints</span>
              <span className="text-[9px] text-emerald-400 font-bold ml-1">Verified</span>
            </span>

            {/* Device Location */}
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono bg-slate-900 border border-slate-700 text-slate-200">
              <Compass className="w-3 h-3 text-emerald-400" />
              <span>Device location: W3C Geolocation</span>
              <span
                className={`text-[9px] font-bold ml-1 ${
                  locationData.status === 'Location Verified'
                    ? 'text-emerald-400'
                    : 'text-amber-400'
                }`}
              >
                {locationData.status === 'Location Verified' ? 'Live Sensor' : 'Pending'}
              </span>
            </span>

            {/* Weather Data */}
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono bg-slate-900 border border-slate-700 text-slate-200">
              <CloudRain className="w-3 h-3 text-sky-400" />
              <span>Weather data: Storm radar</span>
              <span className="text-[9px] text-blue-400 font-medium ml-1">Demo/Simulated</span>
            </span>

            {/* Traffic Data */}
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono bg-slate-900 border border-slate-700 text-slate-200">
              <Car className="w-3 h-3 text-rose-400" />
              <span>Traffic data: Urban road sensors</span>
              <span className="text-[9px] text-blue-400 font-medium ml-1">Demo/Simulated</span>
            </span>

            {/* Other Context */}
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono bg-slate-900 border border-slate-700 text-slate-200">
              <ShieldCheck className="w-3 h-3 text-purple-400" />
              <span>Other context: Clinical & flood guardrails</span>
              <span className="text-[9px] text-emerald-400 font-bold ml-1">Enforced</span>
            </span>
          </div>
        </div>

        {/* Explainability & Safety Disclaimer */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500 font-mono">
          <span>
            Strict User-Facing Explainability: No private reasoning chains or unverified assumptions exposed.
          </span>
          <span>Safety Notice: Operational guidance only; not a clinical diagnosis or guarantee of safety.</span>
        </div>
      </div>
    </div>
  );
};
