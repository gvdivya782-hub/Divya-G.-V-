import React from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  CloudRain,
  Car,
  Clock,
  Users,
  Compass,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Layers,
  Info,
} from 'lucide-react';
import {
  LifeBridgeProcessedResult,
  LiveLocationData,
  RiskFactorItem,
  RiskImpactLevel,
  RiskAssessmentResult,
} from '../types';

interface RiskPriorityAssessmentProps {
  data: LifeBridgeProcessedResult;
  locationData: LiveLocationData;
}

export const RiskPriorityAssessment: React.FC<RiskPriorityAssessmentProps> = ({
  data,
  locationData,
}) => {
  const { structured, verifications, act } = data;

  // Gather ONLY factors that are ACTUALLY available in the current scenario
  const factors: RiskFactorItem[] = [];

  // 1. Weather Factor (only if actually present)
  const weatherItem = verifications.find((v) =>
    v.service.toLowerCase().includes('weather') || v.result.toLowerCase().includes('rain')
  );
  if (weatherItem || (structured?.weather && structured.weather !== 'N/A')) {
    const isHeavy =
      (weatherItem?.result || structured?.weather || '').toLowerCase().includes('heavy') ||
      (weatherItem?.result || '').includes('34 mm') ||
      (weatherItem?.result || '').toLowerCase().includes('downpour');

    factors.push({
      id: 'weather',
      factorName: 'Weather',
      currentStatus: weatherItem?.result || structured?.weather || 'Precipitation active',
      impact: isHeavy ? 'High' : 'Medium',
      explanation: isHeavy
        ? 'Heavy rain reduces tire traction, extends braking distance, and causes localized road waterlogging.'
        : 'Adverse weather conditions warrant extra travel time and cautious driving.',
      isSimulated: true,
    });
  }

  // 2. Traffic Factor (only if actually present)
  const trafficItem = verifications.find((v) =>
    v.service.toLowerCase().includes('traffic') || v.result.toLowerCase().includes('congestion')
  );
  if (trafficItem || (structured?.traffic && structured.traffic !== 'N/A')) {
    const isSevere =
      (trafficItem?.result || structured?.traffic || '').toLowerCase().includes('severe') ||
      (trafficItem?.result || '').toLowerCase().includes('gridlock') ||
      (trafficItem?.result || '').includes('+42 min');

    factors.push({
      id: 'traffic',
      factorName: 'Traffic',
      currentStatus: trafficItem?.result || structured?.traffic || 'Active congestion',
      impact: isSevere ? 'High' : 'Medium',
      explanation: isSevere
        ? 'Severe arterial bottlenecks drastically reduce transit speed and introduce high route unpredictability.'
        : 'Moderate roadway congestion contributes to overall travel delays.',
      isSimulated: true,
    });
  }

  // 3. Time / Deadline Pressure (only if actually present)
  if (structured?.deadline && structured.deadline !== 'N/A') {
    factors.push({
      id: 'deadline',
      factorName: 'Deadline Pressure',
      currentStatus: `Fixed appointment at ${structured.deadline}`,
      impact: 'High',
      explanation:
        'A fixed medical appointment creates strict time pressure with zero tolerance for arrival delays.',
    });
  } else if (structured?.priority === 'critical') {
    factors.push({
      id: 'deadline',
      factorName: 'Time Urgency',
      currentStatus: 'Immediate response required',
      impact: 'High',
      explanation:
        'Time-critical in-situ emergency demands immediate execution and direct protocol escalation.',
    });
  }

  // 4. Passenger / Context Factor (only if actually present)
  if (structured?.passenger && structured.passenger !== 'N/A') {
    const isElderlyMother = structured.passenger.toLowerCase().includes('mother');
    factors.push({
      id: 'passenger',
      factorName: 'Passenger Context',
      currentStatus: structured.passenger,
      impact: isElderlyMother ? 'Medium' : 'Low',
      explanation: isElderlyMother
        ? 'Transporting a vulnerable passenger requires sheltered drop-off, smoother acceleration/braking, and a dedicated safety margin.'
        : 'Passenger transit needs taken into operational consideration.',
    });
  } else if (structured?.contextSubject && structured.contextSubject !== 'N/A') {
    factors.push({
      id: 'context',
      factorName: 'Context / Environment',
      currentStatus: structured.contextSubject,
      impact: structured.priority === 'critical' ? 'High' : 'Medium',
      explanation: 'Specific contextual constraints govern safety and emergency response.',
    });
  }

  // 5. Location Verification Factor (always evaluated dynamically from real browser Geolocation)
  if (locationData.status === 'Location Verified') {
    factors.push({
      id: 'location',
      factorName: 'Location Verification',
      currentStatus: `GPS Fix Verified (±${Math.round(locationData.accuracy || 0)}m)`,
      impact: 'Low',
      explanation:
        'Departure coordinates verified via live hardware sensors, eliminating origin ambiguity.',
      isLiveSensor: true,
    });
  } else if (locationData.status === 'Permission Denied') {
    factors.push({
      id: 'location',
      factorName: 'Location Verification',
      currentStatus: 'Permission Denied',
      impact: 'Medium',
      explanation:
        'Browser location permission denied. System relies on stated origin which requires manual confirmation.',
      needsConfirmation: true,
    });
  } else if (locationData.status === 'Location Unavailable') {
    factors.push({
      id: 'location',
      factorName: 'Location Verification',
      currentStatus: 'GPS Unavailable',
      impact: 'Medium',
      explanation:
        'Device GPS could not acquire fix. Verification depends on stated departure origin.',
      needsConfirmation: true,
    });
  } else {
    // Permission Required
    factors.push({
      id: 'location',
      factorName: 'Location Verification',
      currentStatus: 'Permission Required',
      impact: 'Medium',
      explanation:
        'Real device GPS coordinates not yet verified. Stated departure origin needs confirmation.',
      needsConfirmation: true,
    });
  }

  // 6. Safety Conditions (e.g. active hazard, underpass flood risk, non-diagnostic guardrails)
  const routeVerification = verifications.find((v) =>
    v.service.toLowerCase().includes('route') || v.result.toLowerCase().includes('underpass')
  );
  if (routeVerification || (structured?.weather && structured.weather.toLowerCase().includes('rain'))) {
    factors.push({
      id: 'safety',
      factorName: 'Hazard Condition',
      currentStatus: routeVerification?.result || 'Waterlogging risk at low-lying underpasses',
      impact: 'High',
      explanation:
        'Identified flood hazard at Marathahalli underpass requires an active reroute via elevated expressway & Varthur bypass.',
      isSimulated: true,
    });
  }

  // Transparent Rule-Based Priority Calculation
  const highFactors = factors.filter((f) => f.impact === 'High');
  const mediumFactors = factors.filter((f) => f.impact === 'Medium');

  let overallPriority: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
  let whyThisPriority = '';

  if (structured?.priority === 'critical' || highFactors.length >= 2) {
    overallPriority = 'HIGH';
    whyThisPriority = `Multiple verified factors (${highFactors.map((f) => f.factorName).join(', ')}) compound together, creating significant operational time pressure and transit risk.`;
  } else if (highFactors.length === 1 || mediumFactors.length >= 2) {
    overallPriority = 'MEDIUM';
    whyThisPriority = `Active constraints (${[...highFactors, ...mediumFactors].map((f) => f.factorName).join(', ')}) require schedule adjustments and heightened awareness.`;
  } else {
    overallPriority = 'LOW';
    whyThisPriority =
      'Operational conditions are stable with minimal compounding risk factors detected.';
  }

  // Connected Recommended Action
  const recommendedAction =
    act?.recommendedExecution ||
    (overallPriority === 'HIGH'
      ? 'Leave with an appropriate time buffer and follow the safest available route.'
      : 'Proceed as scheduled while monitoring real-time transit conditions.');

  const getImpactBadge = (impact: RiskImpactLevel, needsConfirm?: boolean) => {
    if (needsConfirm) {
      return (
        <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 whitespace-nowrap">
          <AlertTriangle className="w-3 h-3 text-amber-400" />
          Medium (Needs confirmation)
        </span>
      );
    }

    switch (impact) {
      case 'High':
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30 whitespace-nowrap">
            <ShieldAlert className="w-3 h-3 text-rose-400" />
            HIGH
          </span>
        );
      case 'Medium':
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 whitespace-nowrap">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            MEDIUM
          </span>
        );
      case 'Low':
      default:
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            LOW
          </span>
        );
    }
  };

  const getFactorIcon = (id: string) => {
    switch (id) {
      case 'weather':
        return <CloudRain className="w-4 h-4 text-sky-400" />;
      case 'traffic':
        return <Car className="w-4 h-4 text-rose-400" />;
      case 'deadline':
        return <Clock className="w-4 h-4 text-amber-400" />;
      case 'passenger':
      case 'context':
        return <Users className="w-4 h-4 text-purple-400" />;
      case 'location':
        return <Compass className="w-4 h-4 text-emerald-400" />;
      case 'safety':
      default:
        return <ShieldCheck className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div
      id="risk-priority-engine-section"
      className="bg-slate-950/90 border border-slate-800 hover:border-cyan-500/30 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-6 transition-all relative overflow-hidden"
    >
      {/* Subtle Ambient Glow */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500/20 to-rose-600/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
              <Layers className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-black tracking-wider text-white uppercase flex items-center gap-2">
                <span>RISK & PRIORITY ASSESSMENT</span>
                <span className="text-xs font-mono text-amber-400 font-normal lowercase hidden sm:inline">
                  (Deterministic Rule-Based Engine)
                </span>
              </h4>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            Evaluates verified environmental, logistical, and safety factors to transparently determine priority without opaque scoring.
          </p>
        </div>

        {/* Priority Badge Indicator */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-mono text-slate-400">Calculated Priority:</span>
          <span
            className={`px-3 py-1 rounded-xl text-xs sm:text-sm font-mono font-black tracking-wider border ${
              overallPriority === 'HIGH'
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-lg shadow-rose-500/10'
                : overallPriority === 'MEDIUM'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            }`}
          >
            {overallPriority}
          </span>
        </div>
      </div>

      {/* Available Factors Assessment List */}
      <div className="space-y-2.5">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
          <span>Evaluated Scenario Factors:</span>
          <span className="text-[11px] font-mono text-slate-500 normal-case">
            {factors.length} active parameters evaluated
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5">
          {factors.map((factor) => (
            <div
              key={factor.id}
              id={`risk-factor-${factor.id}`}
              className={`bg-slate-900/90 border rounded-xl p-3.5 sm:p-4 flex flex-col justify-between transition-all space-y-2.5 ${
                factor.impact === 'High'
                  ? 'border-rose-500/30 hover:border-rose-500/50 bg-rose-950/5'
                  : factor.impact === 'Medium'
                  ? 'border-amber-500/30 hover:border-amber-500/50 bg-amber-950/5'
                  : 'border-slate-800 hover:border-emerald-500/30'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center flex-shrink-0">
                    {getFactorIcon(factor.id)}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-100 tracking-wide block">
                      {factor.factorName}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {factor.currentStatus}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {factor.isSimulated && (
                    <span
                      className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20"
                      title="Simulated sensor/feed for hackathon demo"
                    >
                      Demo/Simulated
                    </span>
                  )}
                  {factor.isLiveSensor && (
                    <span
                      className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                      title="Direct hardware reading via W3C Geolocation API"
                    >
                      Live Sensor GPS
                    </span>
                  )}
                  {getImpactBadge(factor.impact, factor.needsConfirmation)}
                </div>
              </div>

              {/* Short explanation of why it affects the decision */}
              <p className="text-xs text-slate-300 leading-relaxed font-medium pl-8">
                {factor.explanation}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Synthesis Section: Overall Priority + Why This Priority + Recommended Action */}
      <div
        id="risk-synthesis-card"
        className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* 1. OVERALL PRIORITY */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">
              OVERALL PRIORITY
            </div>
            <div className="flex items-center gap-2.5 my-1">
              <span
                className={`text-2xl sm:text-3xl font-mono font-black tracking-tight ${
                  overallPriority === 'HIGH'
                    ? 'text-rose-400'
                    : overallPriority === 'MEDIUM'
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {overallPriority}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                ({highFactors.length} High, {mediumFactors.length} Med)
              </span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              Computed via deterministic hazard threshold rules
            </div>
          </div>

          {/* 2. WHY THIS PRIORITY? */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400 mb-1 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-cyan-400" />
              <span>WHY THIS PRIORITY?</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-medium my-1">
              {whyThisPriority}
            </p>
            <div className="text-[10px] text-slate-500 font-mono">
              Grounds strictly on verified inputs and declared constraints
            </div>
          </div>

          {/* 3. RECOMMENDED ACTION */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400 mb-1 flex items-center gap-1.5">
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              <span>RECOMMENDED ACTION</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-bold my-1">
              {recommendedAction}
            </p>
            <div className="text-[10px] text-slate-500 font-mono">
              Connects directly to Stage 4 deterministic execution plan
            </div>
          </div>
        </div>

        {/* Safety Requirements & Disclaimer Box */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span>
              <strong>Safety Guardrail:</strong> Priority assessments reflect rule-based operational guidance, not an AI black-box score or clinical medical diagnosis. Does not guarantee safety.
            </span>
          </div>

          <span className="text-[10px] font-mono text-slate-500 whitespace-nowrap">
            Rule Set v2.4 • Transparent Logic
          </span>
        </div>
      </div>
    </div>
  );
};
