import React from 'react';
import {
  MapPin,
  Compass,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
  Lock,
  Radio,
} from 'lucide-react';
import { LiveLocationData, LocationStatus } from '../types';

interface LocationVerificationCardProps {
  locationData: LiveLocationData;
  onRequestLocation: () => void;
  isRequesting: boolean;
  statedOrigin?: string;
}

export const LocationVerificationCard: React.FC<LocationVerificationCardProps> = ({
  locationData,
  onRequestLocation,
  isRequesting,
  statedOrigin,
}) => {
  const {
    status,
    latitude,
    longitude,
    accuracy,
    lastUpdated,
    errorMessage,
    placeName,
    comparisonNote,
  } = locationData;

  const isVerified = status === 'Location Verified';
  const isDenied = status === 'Permission Denied';
  const isUnavailable = status === 'Location Unavailable';
  const isPending = status === 'Permission Required';

  const getStatusBadge = () => {
    switch (status) {
      case 'Location Verified':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Location Verified
          </span>
        );
      case 'Permission Denied':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            Permission Denied
          </span>
        );
      case 'Location Unavailable':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            Location Unavailable
          </span>
        );
      case 'Permission Required':
      default:
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            Permission Required
          </span>
        );
    }
  };

  return (
    <div
      id="location-verification-card"
      className="bg-slate-950/90 border border-slate-800 hover:border-cyan-500/40 rounded-xl p-4 sm:p-5 transition-all shadow-inner space-y-4"
    >
      {/* Header and Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>Device GPS & Location Verification</span>
              <span className="text-[10px] font-mono text-cyan-400 lowercase hidden sm:inline">
                (W3C Geolocation API)
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Cross-checks real-time physical device coordinates against the situational action plan.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {getStatusBadge()}

          {/* Allow Location / Refresh Button */}
          <button
            type="button"
            id="allow-location-btn"
            onClick={onRequestLocation}
            disabled={isRequesting}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer ${
              isVerified
                ? 'bg-slate-900 border border-slate-700 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-cyan-500/20'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isRequesting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>Accessing GPS...</span>
              </>
            ) : isVerified ? (
              <>
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Re-verify GPS</span>
              </>
            ) : (
              <>
                <MapPin className="w-3.5 h-3.5" />
                <span>Allow Location</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Real Coordinates Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Latitude */}
        <div className="bg-slate-900/80 border border-slate-800/90 rounded-lg p-3">
          <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">
            Current Latitude
          </div>
          <div className="text-xs sm:text-sm font-mono font-bold text-slate-200">
            {latitude !== null ? `${latitude.toFixed(6)}°` : '— (Pending)'}
          </div>
          <div className="text-[9px] text-slate-500 mt-0.5 font-mono">WGS84 Datum</div>
        </div>

        {/* Longitude */}
        <div className="bg-slate-900/80 border border-slate-800/90 rounded-lg p-3">
          <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">
            Current Longitude
          </div>
          <div className="text-xs sm:text-sm font-mono font-bold text-slate-200">
            {longitude !== null ? `${longitude.toFixed(6)}°` : '— (Pending)'}
          </div>
          <div className="text-[9px] text-slate-500 mt-0.5 font-mono">WGS84 Datum</div>
        </div>

        {/* Accuracy */}
        <div className="bg-slate-900/80 border border-slate-800/90 rounded-lg p-3">
          <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">
            Location Accuracy
          </div>
          <div className="text-xs sm:text-sm font-mono font-bold text-cyan-300">
            {accuracy !== null ? `±${Math.round(accuracy)} meters` : '—'}
          </div>
          <div className="text-[9px] text-slate-500 mt-0.5 font-mono">Sensor Precision</div>
        </div>

        {/* Last Updated */}
        <div className="bg-slate-900/80 border border-slate-800/90 rounded-lg p-3">
          <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">
            Last Updated Time
          </div>
          <div className="text-xs sm:text-sm font-mono font-bold text-slate-200">
            {lastUpdated || '—'}
          </div>
          <div className="text-[9px] text-slate-500 mt-0.5 font-mono">Device Clock</div>
        </div>
      </div>

      {/* Geocoded Place Name if resolved */}
      {isVerified && placeName && (
        <div className="text-xs text-slate-300 bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span>
            <strong className="text-slate-200">Identified Physical Area:</strong> {placeName}
          </span>
        </div>
      )}

      {/* Comparison with user's input location (only when reliably determined) */}
      {isVerified && comparisonNote && (
        <div className="text-xs text-slate-200 bg-cyan-950/20 border border-cyan-500/30 rounded-lg p-3 leading-relaxed font-medium">
          {comparisonNote}
        </div>
      )}

      {/* Error / Denial Guidance */}
      {errorMessage && (
        <div className="text-xs text-rose-300 bg-rose-950/20 border border-rose-500/30 rounded-lg p-3 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold text-rose-200">Location Status:</strong> {errorMessage}
          </div>
        </div>
      )}

      {/* Privacy Notice Requirement */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5 text-cyan-400/90 font-medium">
          <Lock className="w-3.5 h-3.5 text-cyan-400" />
          <span>Location is used only to improve this recommendation.</span>
        </div>

        <div className="text-[10px] font-mono text-slate-500 hidden sm:inline">
          Zero coordinate storage • Client-side verification
        </div>
      </div>
    </div>
  );
};
