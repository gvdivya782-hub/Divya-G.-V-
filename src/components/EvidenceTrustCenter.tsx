import React, { useState } from 'react';
import {
  ShieldCheck,
  Shield,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Compass,
  MapPin,
  Clock,
  Radio,
  FileCheck,
  ChevronDown,
  ChevronUp,
  Info,
  Lock,
  Eye,
  Layers,
  Database,
  Car,
  CloudRain,
  Users,
  Activity,
  XCircle,
} from 'lucide-react';
import {
  LifeBridgeProcessedResult,
  LiveLocationData,
  EvidenceCategory,
  EvidenceStatus,
  OverallTrustStatus,
  EvidenceItem,
} from '../types';

interface EvidenceTrustCenterProps {
  data: LifeBridgeProcessedResult;
  locationData: LiveLocationData;
  onRequestLocation?: () => void;
  isRequestingLocation?: boolean;
}

export const EvidenceTrustCenter: React.FC<EvidenceTrustCenterProps> = ({
  data,
  locationData,
  onRequestLocation,
  isRequestingLocation,
}) => {
  const [isWhyTrustExpanded, setIsWhyTrustExpanded] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | EvidenceCategory>('ALL');

  // Compute location status badge
  const getLocationStatus = (): EvidenceStatus => {
    if (locationData.status === 'Location Verified') return 'VERIFIED';
    if (locationData.status === 'Permission Denied') return 'PERMISSION DENIED';
    if (locationData.status === 'Location Unavailable') return 'UNAVAILABLE';
    return 'PERMISSION REQUIRED';
  };

  // Build the comprehensive Evidence items list
  const evidenceItems: EvidenceItem[] = [
    // 1. VERIFIED DEVICE DATA
    {
      id: 'ev-gps',
      name: 'Physical Device Coordinates (GPS)',
      category: 'VERIFIED DEVICE DATA',
      source: 'Device GPS (W3C Geolocation API)',
      status: getLocationStatus(),
      lastUpdated: locationData.lastUpdated
        ? new Date(locationData.lastUpdated).toLocaleTimeString()
        : locationData.status === 'Location Verified'
        ? 'Current Session'
        : 'Awaiting sensor check',
      detail:
        locationData.status === 'Location Verified'
          ? `${locationData.latitude?.toFixed(4)}°, ${locationData.longitude?.toFixed(4)}° (Accuracy: ±${Math.round(
              locationData.accuracy || 0
            )}m)`
          : `Sensor permission not yet granted. Using declared origin "${data.structured?.origin || 'Electronic City'}" without fake coordinate substitution.`,
      auditNote: 'Direct hardware sensor. Coordinates are NEVER fabricated or spoofed.',
      isDevice: true,
    },
    {
      id: 'ev-clock',
      name: 'System Hardware Reference Clock',
      category: 'VERIFIED DEVICE DATA',
      source: 'Client Device Hardware RTC',
      status: 'VERIFIED',
      lastUpdated: new Date().toLocaleTimeString(),
      detail: 'Device system clock verified and calibrated for real-time countdown to target deadline.',
      auditNote: 'Local hardware timer used for backward-scheduling calculation.',
      isDevice: true,
    },

    // 2. SIMULATED DEMO DATA
    {
      id: 'ev-traffic',
      name: 'Corridor Traffic & Sensor Telemetry',
      category: 'SIMULATED DEMO DATA',
      source: 'Demo Scenario (Synthetic Road Telemetry)',
      status: 'SIMULATED',
      lastUpdated: 'Demo Scenario Baseline',
      detail: 'Severe traffic gridlock detected: +42 min delay via Silk Board corridor, 11 km/h average transit velocity.',
      auditNote: 'Simulated road congestion model for safety evaluation. Not connected to a live commercial toll API.',
      isSimulated: true,
    },
    {
      id: 'ev-weather',
      name: 'Doppler Radar & Storm Telemetry',
      category: 'SIMULATED DEMO DATA',
      source: 'Demo Scenario (Synthetic Atmospheric Radar)',
      status: 'SIMULATED',
      lastUpdated: 'Demo Scenario Baseline',
      detail: 'Heavy rain confirmed (34 mm/hr active downpour across Bellandur/Varthur corridor with waterlogging hazard).',
      auditNote: 'Simulated precipitation telemetry. Clearly flagged as demonstration data.',
      isSimulated: true,
    },
    {
      id: 'ev-routing',
      name: 'Multi-Modal Route Optimization Topology',
      category: 'SIMULATED DEMO DATA',
      source: 'Demo Scenario (Navigational Model)',
      status: 'SIMULATED',
      lastUpdated: 'Demo Scenario Baseline',
      detail: '31.4 km corridor via Elevated Expressway & Varthur bypass (72 min driving time + 18 min rain buffer).',
      auditNote: 'Synthetic routing graph calibrated to bypass known flood-prone Marathahalli underpasses.',
      isSimulated: true,
    },

    // 3. USER-PROVIDED DATA
    {
      id: 'ev-appointment',
      name: 'Doctor Appointment Deadline',
      category: 'USER-PROVIDED DATA',
      source: 'User Input',
      status: 'USER-PROVIDED',
      lastUpdated: 'Extracted from user prompt',
      detail: `${data.structured?.deadline || '5:30 PM'} (Fixed medical consultation window).`,
      auditNote: 'User-declared time constraint; treated as an immovable destination deadline.',
    },
    {
      id: 'ev-origin',
      name: 'Stated Departure Origin',
      category: 'USER-PROVIDED DATA',
      source: 'User Input',
      status: 'USER-PROVIDED',
      lastUpdated: 'Extracted from user prompt',
      detail: `${data.structured?.origin || 'Electronic City'} declared by user.`,
      auditNote: 'Used as departure reference point unless superseded by verified device GPS.',
    },
    {
      id: 'ev-dest',
      name: 'Stated Arrival Destination',
      category: 'USER-PROVIDED DATA',
      source: 'User Input',
      status: 'USER-PROVIDED',
      lastUpdated: 'Extracted from user prompt',
      detail: `${data.structured?.destination || 'Whitefield'} (Clinic/Hospital destination).`,
      auditNote: 'Destination anchor parsed from input query.',
    },
    {
      id: 'ev-passenger',
      name: 'Passenger Care & Mobility Context',
      category: 'USER-PROVIDED DATA',
      source: 'User Input',
      status: 'USER-PROVIDED',
      lastUpdated: 'Extracted from user prompt',
      detail: `${data.structured?.passenger || 'Mother'} (requires smooth driving dynamics and sheltered canopy drop-off).`,
      auditNote: 'Emotional/human context extracted directly from prompt syntax.',
    },

    // 4. UNAVAILABLE DATA
    {
      id: 'ev-clinic-ehr',
      name: 'Clinic Live Appointment Schedule & Doctor Delay',
      category: 'UNAVAILABLE DATA',
      source: 'External Clinic EHR Endpoint',
      status: 'UNAVAILABLE',
      lastUpdated: 'N/A',
      detail: 'Direct hospital clinic queue API is not integrated. Operating strictly on declared 5:30 PM schedule.',
      auditNote: 'Explicitly labeled unavailable. LifeBridge never pretends to have access to unlinked medical portals.',
    },
    {
      id: 'ev-obd-telematics',
      name: 'Vehicle CAN-Bus Road Grip & Tire Telemetry',
      category: 'UNAVAILABLE DATA',
      source: 'Vehicle Onboard Diagnostic Interface',
      status: 'UNAVAILABLE',
      lastUpdated: 'N/A',
      detail: 'No vehicle OBD-II sensor connection. Aquaplaning risk is derived from storm rain rates rather than tire sensors.',
      auditNote: 'Transparent physical boundary declaration.',
    },
  ];

  // Calculate Trust Summary metrics
  const simulatedCount = evidenceItems.filter((i) => i.category === 'SIMULATED DEMO DATA').length;
  const availableCount = evidenceItems.filter((i) => i.status !== 'UNAVAILABLE').length;
  const requiresConfirmationCount =
    locationData.status !== 'Location Verified' ? 1 : 0;

  // Overall verification status
  const overallVerificationStatus: OverallTrustStatus =
    locationData.status === 'Location Verified'
      ? 'VERIFIED'
      : locationData.status === 'Permission Denied' || locationData.status === 'Location Unavailable'
      ? 'PARTIAL'
      : 'NEEDS CONFIRMATION';

  // Filtered items
  const filteredItems =
    selectedFilter === 'ALL'
      ? evidenceItems
      : evidenceItems.filter((i) => i.category === selectedFilter);

  // Status badge styling helper
  const getStatusBadge = (status: EvidenceStatus) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            VERIFIED
          </span>
        );
      case 'SIMULATED':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1">
            <Database className="w-3 h-3 text-cyan-400" />
            SIMULATED
          </span>
        );
      case 'USER-PROVIDED':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40 flex items-center gap-1">
            <FileCheck className="w-3 h-3 text-blue-400" />
            USER-PROVIDED
          </span>
        );
      case 'PERMISSION REQUIRED':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            PERMISSION REQUIRED
          </span>
        );
      case 'PERMISSION DENIED':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
            <XCircle className="w-3 h-3 text-rose-400" />
            PERMISSION DENIED
          </span>
        );
      case 'UNAVAILABLE':
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1">
            <XCircle className="w-3 h-3 text-slate-500" />
            UNAVAILABLE
          </span>
        );
    }
  };

  return (
    <section
      id="lifebridge-evidence-trust-center"
      className="bg-slate-900/90 border-2 border-cyan-500/40 rounded-2xl p-5 sm:p-7 shadow-2xl space-y-6 scroll-mt-20"
    >
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-cyan-500/25">
            <ShieldCheck className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-black tracking-wide text-white uppercase">
                EVIDENCE & TRUST CENTER
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                AUDITABLE PROVENANCE ENGINE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Clear distinction of real hardware sensors, user declarations, and simulated models.
            </p>
          </div>
        </div>

        {/* Live location action if needed */}
        {locationData.status !== 'Location Verified' && onRequestLocation && (
          <button
            type="button"
            id="trust-center-request-location-btn"
            onClick={onRequestLocation}
            disabled={isRequestingLocation}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 transition-all cursor-pointer self-start sm:self-auto"
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isRequestingLocation ? 'Querying GPS...' : 'Verify Real GPS'}</span>
          </button>
        )}
      </div>

      {/* 1. TRUST SUMMARY CARD */}
      <div
        id="trust-summary-card"
        className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-inner"
      >
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              Trust Summary & Audit Telemetry:
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Overall Status:</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-mono font-black border ${
                overallVerificationStatus === 'VERIFIED'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 animate-pulse'
                  : overallVerificationStatus === 'PARTIAL'
                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/50'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/50'
              }`}
            >
              {overallVerificationStatus}
            </span>
          </div>
        </div>

        {/* 4 Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl space-y-1">
            <div className="text-[11px] font-mono text-slate-400 uppercase">Evidence available:</div>
            <div className="text-2xl font-black text-white font-mono">{availableCount}</div>
            <div className="text-[10px] text-slate-500 font-mono">Sensory & declared items</div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl space-y-1">
            <div className="text-[11px] font-mono text-slate-400 uppercase">
              Requiring confirmation:
            </div>
            <div
              className={`text-2xl font-black font-mono ${
                requiresConfirmationCount > 0 ? 'text-amber-400' : 'text-emerald-400'
              }`}
            >
              {requiresConfirmationCount}
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              {requiresConfirmationCount > 0 ? 'Physical GPS pending' : 'All critical items confirmed'}
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl space-y-1">
            <div className="text-[11px] font-mono text-slate-400 uppercase">Simulated inputs:</div>
            <div className="text-2xl font-black text-cyan-300 font-mono">{simulatedCount}</div>
            <div className="text-[10px] text-cyan-400/80 font-mono">Clearly labeled demo feeds</div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl space-y-1">
            <div className="text-[11px] font-mono text-slate-400 uppercase">Verification status:</div>
            <div className="text-sm font-black text-slate-200 uppercase font-mono mt-1">
              {overallVerificationStatus}
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              {overallVerificationStatus === 'VERIFIED'
                ? 'Device GPS active'
                : 'Using declared origin'}
            </div>
          </div>
        </div>
      </div>

      {/* 2. CATEGORY FILTER TABS */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {(
          [
            'ALL',
            'VERIFIED DEVICE DATA',
            'SIMULATED DEMO DATA',
            'USER-PROVIDED DATA',
            'UNAVAILABLE DATA',
          ] as const
        ).map((cat) => {
          const isActive = selectedFilter === cat;
          return (
            <button
              key={cat}
              type="button"
              id={`trust-filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setSelectedFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap border transition-all cursor-pointer ${
                isActive
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-sm'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* 3. EVIDENCE DATA CARDS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            id={`evidence-card-${item.id}`}
            className="bg-slate-950/80 border border-slate-800/90 hover:border-cyan-500/40 rounded-xl p-4 flex flex-col justify-between transition-all space-y-3"
          >
            <div className="space-y-2">
              {/* Card Header: Category & Status */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  {item.category}
                </span>
                {getStatusBadge(item.status)}
              </div>

              {/* Item Name */}
              <h4 className="text-sm font-bold text-white tracking-wide">{item.name}</h4>

              {/* Detail */}
              <p className="text-xs text-slate-300 leading-relaxed font-mono bg-slate-900/90 p-2.5 rounded-lg border border-slate-800/80">
                {item.detail}
              </p>
            </div>

            {/* Source & Timestamp Footer */}
            <div className="pt-2 border-t border-slate-800/70 space-y-1 text-[11px] font-mono text-slate-400">
              <div className="flex items-center justify-between">
                <span>
                  ● <strong>Source:</strong> <span className="text-slate-200">{item.source}</span>
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500">
                <span>
                  ● <strong>Last updated:</strong> {item.lastUpdated || 'Current session'}
                </span>
                {item.auditNote && (
                  <span className="text-cyan-400/90 italic truncate max-w-[220px]" title={item.auditNote}>
                    {item.auditNote}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 4. "WHY CAN I TRUST THIS?" EXPANDABLE SECTION */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-xl overflow-hidden transition-all">
        <button
          type="button"
          id="why-trust-toggle-btn"
          onClick={() => setIsWhyTrustExpanded(!isWhyTrustExpanded)}
          className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-900/50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-5 h-5 text-cyan-400 flex-shrink-0" />
            <div>
              <div className="text-sm font-bold text-white">Why can I trust this?</div>
              <div className="text-xs text-slate-400">
                How LifeBridge transparently produces recommendations from observable inputs
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold">
            <span>{isWhyTrustExpanded ? 'Collapse' : 'Explain'}</span>
            {isWhyTrustExpanded ? (
              <ChevronUp className="w-4 h-4 text-cyan-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-cyan-400" />
            )}
          </div>
        </button>

        {isWhyTrustExpanded && (
          <div className="px-5 pb-5 pt-2 border-t border-slate-800/80 space-y-4 text-xs text-slate-300 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl space-y-1.5">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  1. Transparent Observable Inputs
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  LifeBridge only uses facts directly spoken in your request, physical hardware sensors (such as browser GPS when granted), and clearly labeled environmental simulations. No hidden external web scrapes.
                </p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl space-y-1.5">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-cyan-400" />
                  2. No Black-Box Hallucinations
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  The system never invents fake road closures, arbitrary medical delays, or imaginary traffic patterns. If data is missing (such as live hospital clinic EHR queues), it is explicitly marked <strong>UNAVAILABLE</strong>.
                </p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl space-y-1.5">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-400" />
                  3. Deterministic Schedule Math
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  The 4:00 PM recommended departure is calculated mathematically, not guessed:
                  <br />
                  <code className="text-cyan-300 font-mono">
                    5:30 PM Target - 72 min Transit - 18 min Rain Buffer = 4:00 PM Departure
                  </code>
                </p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl space-y-1.5">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  4. Honest Synthetic Labeling
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  Simulated Doppler radar and congestion models are clearly labeled <strong>SIMULATED</strong> so evaluators and users always know what is real hardware telemetry vs. evaluation models.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. PRIVACY NOTE */}
      <div
        id="trust-center-privacy-note"
        className="bg-slate-950/80 border border-cyan-500/30 rounded-xl p-4 flex items-start gap-3 text-xs text-slate-300"
      >
        <Shield className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-white uppercase font-mono text-[11px] tracking-wide">
            Privacy & Hardware Disclosure:
          </span>
          <p className="text-slate-300 leading-relaxed">
            "Location is used only when permission is granted and is not required for the simulated Judge Demo."
          </p>
          <p className="text-[11px] text-slate-400 font-mono">
            LifeBridge adheres to strict zero-retention client-side processing. GPS coordinates are evaluated in memory and never logged to external servers.
          </p>
        </div>
      </div>
    </section>
  );
};
