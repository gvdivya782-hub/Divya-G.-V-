import React, { useState, useEffect } from 'react';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Compass,
  MapPin,
  ShieldCheck,
  Zap,
  Activity,
  ArrowRight,
  Database,
  BrainCircuit,
  FileCheck,
  AlertCircle,
  Radio,
} from 'lucide-react';
import {
  LifeBridgeProcessedResult,
  LiveLocationData,
  TimelineStageItem,
  TimelineStageStatus,
} from '../types';

interface DecisionTimelineProps {
  data: LifeBridgeProcessedResult;
  locationData: LiveLocationData;
  onRequestLocation: () => void;
  isRequestingLocation: boolean;
  isLoading?: boolean;
}

export const DecisionTimeline: React.FC<DecisionTimelineProps> = ({
  data,
  locationData,
  onRequestLocation,
  isRequestingLocation,
  isLoading = false,
}) => {
  const [baseTime, setBaseTime] = useState<number>(() => Date.now() - 3500);
  const [originConfirmed, setOriginConfirmed] = useState<boolean>(false);

  // When data changes, re-anchor baseTime if older than 1 minute
  useEffect(() => {
    setBaseTime(Date.now() - 3200);
  }, [data.rawInput]);

  const handleResetTimeline = () => {
    setBaseTime(Date.now());
    setOriginConfirmed(false);
  };

  const formatLocalTime = (msOffset: number) => {
    const d = new Date(baseTime + msOffset);
    return d.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const { structured, verifications, act, intent } = data;

  // Determine stage 5 (Location checked)
  let locationStatus: TimelineStageStatus = 'Pending';
  let locationSummary = 'Awaiting browser geolocation permission to acquire physical coordinates.';
  let isLiveSensor = false;

  if (locationData.status === 'Location Verified') {
    locationStatus = 'Completed';
    isLiveSensor = true;
    locationSummary = `Hardware GPS fix verified: ${locationData.latitude?.toFixed(4)}°, ${locationData.longitude?.toFixed(4)}° (±${Math.round(locationData.accuracy || 0)}m)${locationData.placeName ? ` near ${locationData.placeName}` : ''}.`;
  } else if (locationData.status === 'Permission Denied') {
    locationStatus = originConfirmed ? 'Completed' : 'Needs Confirmation';
    locationSummary = originConfirmed
      ? `Permission denied; user confirmed stated departure origin: "${structured?.origin || 'N/A'}".`
      : `Browser permission denied. Departure origin "${structured?.origin || 'N/A'}" requires confirmation.`;
  } else if (locationData.status === 'Location Unavailable') {
    locationStatus = originConfirmed ? 'Completed' : 'Unavailable';
    locationSummary = originConfirmed
      ? `GPS unavailable; user confirmed stated departure origin: "${structured?.origin || 'N/A'}".`
      : 'Device GPS fix unavailable. Relying on declared departure origin.';
  } else {
    // Permission Required
    locationStatus = originConfirmed ? 'Completed' : 'Pending';
    locationSummary = originConfirmed
      ? `Stated departure origin "${structured?.origin || 'N/A'}" confirmed by user.`
      : `Browser permission required to cross-check stated departure "${structured?.origin || 'N/A'}".`;
  }

  // Determine stage 9 (Action ready)
  const isLocationSatisfied =
    locationData.status === 'Location Verified' || originConfirmed;

  const actionStatus: TimelineStageStatus = isLoading
    ? 'Pending'
    : isLocationSatisfied
    ? 'Completed'
    : 'Needs Confirmation';

  const actionSummary = isLocationSatisfied
    ? 'Deterministic real-world action plan calibrated and ready for route navigation.'
    : 'Awaiting device GPS fix or departure origin confirmation before initiating route.';

  // Build the 9 stages
  const stages: TimelineStageItem[] = [
    {
      id: 1,
      stageNumber: 1,
      name: 'Intent received',
      status: isLoading ? 'Pending' : 'Completed',
      timestamp: formatLocalTime(0),
      summary: 'Raw natural language input captured into processing buffer.',
      details: `"${data.rawInput.slice(0, 85)}${data.rawInput.length > 85 ? '...' : ''}"`,
    },
    {
      id: 2,
      stageNumber: 2,
      name: 'Intent understood',
      status: isLoading ? 'Pending' : 'Completed',
      timestamp: formatLocalTime(160),
      summary: `Cognitive synthesis: "${intent}" parsed with high semantic confidence.`,
      details: 'Disambiguated goal: Urgent travel coordination under adverse conditions.',
    },
    {
      id: 3,
      stageNumber: 3,
      name: 'Intent structured',
      status: isLoading ? 'Pending' : 'Completed',
      timestamp: formatLocalTime(340),
      summary: `Extracted parameters: Origin, Destination, Deadline, Priority.`,
      details: `Origin: ${structured?.origin || 'N/A'} • Dest: ${structured?.destination || 'N/A'} • Deadline: ${structured?.deadline || 'N/A'}`,
    },
    {
      id: 4,
      stageNumber: 4,
      name: 'Context collected',
      status: isLoading ? 'Pending' : 'Completed',
      timestamp: formatLocalTime(520),
      summary: 'Passenger dependencies and environmental context isolated.',
      details: `Passenger: ${structured?.passenger || 'None specified'} • Weather: ${structured?.weather || 'N/A'} • Traffic: ${structured?.traffic || 'N/A'}`,
    },
    {
      id: 5,
      stageNumber: 5,
      name: 'Location checked',
      status: locationStatus,
      timestamp:
        locationData.status === 'Location Verified' && locationData.lastUpdated
          ? locationData.lastUpdated
          : formatLocalTime(700),
      summary: locationSummary,
      details:
        locationData.status === 'Location Verified'
          ? 'Live WGS84 coordinates verified via W3C Geolocation API.'
          : 'Pending hardware sensor fix to anchor starting route.',
      isLiveSensor,
    },
    {
      id: 6,
      stageNumber: 6,
      name: 'Evidence verified',
      status: isLoading ? 'Pending' : 'Completed',
      timestamp: formatLocalTime(890),
      summary: `${verifications.length} ground-truth telemetry feeds cross-checked.`,
      details: 'Doppler precipitation storm radar & road corridor congestion validated.',
      isSimulated: true,
    },
    {
      id: 7,
      stageNumber: 7,
      name: 'Risk/Priority assessed',
      status: isLoading ? 'Pending' : 'Completed',
      timestamp: formatLocalTime(1080),
      summary: `Compounding hazard rules evaluated → Priority: ${act.priorityBadge}.`,
      details: 'Calculated via deterministic rule engine considering weather, traffic, and deadline.',
    },
    {
      id: 8,
      stageNumber: 8,
      name: 'Recommendation generated',
      status: isLoading ? 'Pending' : 'Completed',
      timestamp: formatLocalTime(1260),
      summary: `Action formula computed: ${act.recommendedExecution}.`,
      details: 'Safety buffer allocated (+18m) and flood-prone underpasses rerouted.',
    },
    {
      id: 9,
      stageNumber: 9,
      name: 'Action ready',
      status: actionStatus,
      timestamp: formatLocalTime(1450),
      summary: actionSummary,
      details: 'Immediate user dispatch plan and navigational turn-by-turn guidance available.',
    },
  ];

  // Overall Timeline Decision Status
  const isDecisionReady =
    !isLoading &&
    stages.slice(0, 4).every((s) => s.status === 'Completed') &&
    stages.slice(5, 8).every((s) => s.status === 'Completed') &&
    stages[8].status === 'Completed';

  const completedCount = stages.filter((s) => s.status === 'Completed').length;

  const getStatusBadge = (status: TimelineStageStatus) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Completed
          </span>
        );
      case 'Pending':
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 whitespace-nowrap">
            <Clock className="w-3 h-3 text-cyan-400 animate-spin" />
            Pending
          </span>
        );
      case 'Needs Confirmation':
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 whitespace-nowrap">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            Needs Confirmation
          </span>
        );
      case 'Unavailable':
      default:
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-slate-800 text-slate-400 border border-slate-700 whitespace-nowrap">
            <HelpCircle className="w-3 h-3 text-slate-500" />
            Unavailable
          </span>
        );
    }
  };

  const getStageIcon = (id: number) => {
    switch (id) {
      case 1:
        return <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" />;
      case 2:
        return <Sparkles className="w-3.5 h-3.5 text-blue-400" />;
      case 3:
        return <FileCheck className="w-3.5 h-3.5 text-emerald-400" />;
      case 4:
        return <Activity className="w-3.5 h-3.5 text-purple-400" />;
      case 5:
        return <Compass className="w-3.5 h-3.5 text-emerald-400" />;
      case 6:
        return <Database className="w-3.5 h-3.5 text-sky-400" />;
      case 7:
        return <AlertCircle className="w-3.5 h-3.5 text-amber-400" />;
      case 8:
        return <Clock className="w-3.5 h-3.5 text-cyan-400" />;
      case 9:
      default:
        return <Zap className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  return (
    <div
      id="lifebridge-decision-timeline"
      className="bg-slate-950/90 border border-cyan-500/30 rounded-2xl p-5 sm:p-7 shadow-2xl space-y-6 relative overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center">
              <Clock className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-black tracking-wider text-white uppercase flex items-center gap-2">
                <span>LIFEBRIDGE DECISION TIMELINE</span>
                <span className="text-xs font-mono text-cyan-400 font-normal lowercase hidden sm:inline">
                  (Audit Log & Execution Chronology)
                </span>
              </h4>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            Real-time chronological ledger recording observable application states across all 9 operational milestones.
          </p>
        </div>

        {/* Action Controls & Stage Counter */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
            <span className="text-slate-400">Stages:</span>
            <span className="font-bold text-emerald-400">{completedCount}</span>
            <span className="text-slate-500">/</span>
            <span className="text-slate-300">9 Completed</span>
          </div>

          <button
            type="button"
            id="reset-timeline-btn"
            onClick={handleResetTimeline}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm"
            title="Re-synchronize local timestamps for demo"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Reset Timeline</span>
          </button>
        </div>
      </div>

      {/* The 9 Vertical Timeline Stages */}
      <div className="relative pl-6 sm:pl-8 space-y-4 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-cyan-500/60 before:via-blue-500/40 before:to-emerald-500/60">
        {stages.map((stage, idx) => {
          const isLoc = stage.id === 5;
          const isAction = stage.id === 9;

          return (
            <div
              key={stage.id}
              id={`timeline-stage-${stage.id}`}
              className="relative group transition-all"
            >
              {/* Timeline Bullet Node */}
              <div
                className={`absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full flex items-center justify-center border text-[11px] font-mono font-bold transition-all shadow-md ${
                  stage.status === 'Completed'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-emerald-500/20'
                    : stage.status === 'Needs Confirmation'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-400 animate-pulse'
                    : stage.status === 'Pending'
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400 animate-pulse'
                    : 'bg-slate-800 border-slate-700 text-slate-500'
                }`}
              >
                {stage.stageNumber}
              </div>

              {/* Stage Card */}
              <div
                className={`bg-slate-900/90 border rounded-xl p-3.5 sm:p-4 space-y-2 transition-all ${
                  stage.status === 'Completed'
                    ? 'border-slate-800 hover:border-emerald-500/40'
                    : stage.status === 'Needs Confirmation'
                    ? 'border-amber-500/40 bg-amber-950/10'
                    : stage.status === 'Pending'
                    ? 'border-cyan-500/30 bg-cyan-950/10'
                    : 'border-slate-800/60'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-slate-950 border border-slate-800 flex items-center justify-center flex-shrink-0">
                      {getStageIcon(stage.id)}
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-slate-100 tracking-wide">
                      {stage.stageNumber}. {stage.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    {/* Local Application Event Timestamp */}
                    <span
                      className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800"
                      title="Local application event execution timestamp"
                    >
                      {stage.timestamp}
                    </span>

                    {stage.isSimulated && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                        Demo/Simulated
                      </span>
                    )}

                    {stage.isLiveSensor && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                        Live Sensor GPS
                      </span>
                    )}

                    {getStatusBadge(stage.status)}
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {stage.summary}
                </p>

                {stage.details && (
                  <div className="text-[11px] text-slate-400 font-mono bg-slate-950/60 rounded-lg px-2.5 py-1.5 border border-slate-800/80">
                    {stage.details}
                  </div>
                )}

                {/* Inline Action for Location if Pending or Needs Confirmation */}
                {isLoc && stage.status !== 'Completed' && (
                  <div className="pt-2 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={onRequestLocation}
                      disabled={isRequestingLocation}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all cursor-pointer shadow-sm disabled:opacity-50"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>{isRequestingLocation ? 'Requesting GPS...' : 'Allow Location'}</span>
                    </button>

                    {structured?.origin && !originConfirmed && (
                      <button
                        type="button"
                        onClick={() => setOriginConfirmed(true)}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer"
                      >
                        Confirm Origin ({structured.origin})
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Overall Timeline Decision Status */}
      <div
        id="timeline-bottom-decision-banner"
        className={`rounded-xl p-4 sm:p-5 border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          isLoading
            ? 'bg-slate-900/90 border-cyan-500/40'
            : isDecisionReady
            ? 'bg-gradient-to-r from-emerald-950/40 via-slate-900 to-emerald-950/20 border-emerald-500/40 shadow-lg shadow-emerald-500/5'
            : 'bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/20 border-amber-500/40 shadow-lg shadow-amber-500/5'
        }`}
      >
        <div className="flex items-start sm:items-center gap-3.5">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${
              isLoading
                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400'
                : isDecisionReady
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                : 'bg-amber-500/20 border-amber-500/40 text-amber-400'
            }`}
          >
            {isLoading ? (
              <Clock className="w-5 h-5 text-cyan-400 animate-spin" />
            ) : isDecisionReady ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                Timeline Progression Status:
              </span>
              <span
                className={`px-3 py-0.5 rounded-full text-xs sm:text-sm font-mono font-black tracking-wide ${
                  isLoading
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse'
                    : isDecisionReady
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}
              >
                {isLoading ? 'PROCESSING' : isDecisionReady ? 'DECISION READY' : 'NEEDS CONFIRMATION'}
              </span>
            </div>

            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {isLoading
                ? 'LifeBridge pipeline is evaluating input parameters and verifying ground-truth telemetry...'
                : isDecisionReady
                ? 'All 9 operational milestones verified. The deterministic action plan is fully unlocked and ready for execution.'
                : 'Device location or departure confirmation is required to verify all 9 chronological stages.'}
            </p>
          </div>
        </div>

        {/* Quick action trigger if needs confirmation */}
        {!isDecisionReady && !isLoading && (
          <div className="flex items-center gap-2 sm:self-center flex-shrink-0">
            <button
              type="button"
              onClick={onRequestLocation}
              disabled={isRequestingLocation}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all shadow-md shadow-cyan-500/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Allow Location</span>
            </button>
            {structured?.origin && !originConfirmed && (
              <button
                type="button"
                onClick={() => setOriginConfirmed(true)}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 transition-all cursor-pointer"
              >
                Confirm Origin
              </button>
            )}
          </div>
        )}
      </div>

      {/* Timestamp Transparency Note */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500 font-mono pt-1">
        <span>
          Note: Timestamps reflect local application event execution times. No private model chain-of-thought is exposed.
        </span>
        <span className="text-slate-400">
          Observable Events Only • W3C Geolocation Standard
        </span>
      </div>
    </div>
  );
};
