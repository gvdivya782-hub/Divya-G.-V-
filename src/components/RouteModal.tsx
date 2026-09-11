import React, { useState } from 'react';
import {
  X,
  Navigation,
  CloudRain,
  Activity,
  AlertTriangle,
  Compass,
  ArrowUpRight,
  Play,
  RotateCcw,
  CheckCircle,
  MapPin,
} from 'lucide-react';
import { ActionPlanData, LiveLocationData } from '../types';

interface RouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  act: ActionPlanData | null;
  locationData?: LiveLocationData;
}

export const RouteModal: React.FC<RouteModalProps> = ({
  isOpen,
  onClose,
  act,
  locationData,
}) => {
  const [gpsProgress, setGpsProgress] = useState<number>(15);
  const [simulating, setSimulating] = useState<boolean>(false);

  if (!isOpen || !act) return null;

  const handleSimulateGPS = () => {
    setSimulating(true);
    let p = gpsProgress;
    const interval = setInterval(() => {
      p += 15;
      if (p >= 100) {
        setGpsProgress(100);
        setSimulating(false);
        clearInterval(interval);
      } else {
        setGpsProgress(p);
      }
    }, 800);
  };

  const handleReset = () => {
    setGpsProgress(15);
    setSimulating(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center">
              <Navigation className="w-4 h-4 fill-cyan-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Live Navigational Execution View
              </h3>
              <p className="text-xs text-slate-400">
                LifeBridge Verified Transit Guidance
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* Active Route Specs */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
              Primary Navigational Corridor
            </div>
            <div className="text-base font-bold text-white flex items-center gap-2">
              <ArrowUpRight className="w-4 h-4 text-cyan-400" />
              <span>{act.tacticalDetails?.primaryRoute || 'Standard Recommended Route'}</span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1 font-mono">
              <span>Est. Transit: {act.tacticalDetails?.durationEst || '72 mins'}</span>
              <span>•</span>
              <span>Distance: {act.tacticalDetails?.distance || '31.4 km'}</span>
              <span>•</span>
              <span className="text-amber-400 font-semibold">
                Buffer: +{act.tacticalDetails?.safetyBufferMinutes || 18}m
              </span>
            </div>
          </div>

          {/* Telemetry Status Bar */}
          <div className={`grid ${locationData?.status === 'Location Verified' ? 'grid-cols-3' : 'grid-cols-2'} gap-3`}>
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
              <CloudRain className="w-5 h-5 text-cyan-400 flex-shrink-0" />
              <div className="truncate">
                <div className="text-[10px] uppercase font-bold text-slate-400">Live Weather</div>
                <div className="text-xs font-bold text-slate-200 truncate">Heavy Rain (Wipers Max)</div>
              </div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
              <Activity className="w-5 h-5 text-rose-400 flex-shrink-0" />
              <div className="truncate">
                <div className="text-[10px] uppercase font-bold text-slate-400">Congestion Index</div>
                <div className="text-xs font-bold text-rose-300 truncate">Gridlock Avoided</div>
              </div>
            </div>

            {locationData?.status === 'Location Verified' && (
              <div className="bg-slate-950/70 border border-emerald-500/30 rounded-xl p-3 flex items-center gap-3">
                <Compass className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div className="truncate">
                  <div className="text-[10px] uppercase font-bold text-emerald-400">Device GPS Fix</div>
                  <div className="text-xs font-bold font-mono text-emerald-300 truncate">
                    {locationData.latitude?.toFixed(3)}°, {locationData.longitude?.toFixed(3)}°
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Turn-by-Turn Guidance */}
          <div className="space-y-2.5">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Verified Waypoint Instructions:
            </div>

            <div className="space-y-2">
              <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="font-medium text-slate-200">
                    Depart Electronic City Phase 1 via Elevated Tollway Slip Road
                  </span>
                </div>
                <span className="text-[11px] font-mono text-cyan-400">0.0 km</span>
              </div>

              <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span className="font-medium text-slate-200">
                    Take Varthur Main Bypass (bypasses waterlogged Marathahalli underpass)
                  </span>
                </div>
                <span className="text-[11px] font-mono text-cyan-400">14.2 km</span>
              </div>

              <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="font-medium text-slate-200">
                    Arrival at Whitefield Medical Clinic parking bay with 10-minute check-in buffer
                  </span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 font-bold">5:20 PM</span>
              </div>
            </div>
          </div>

          {/* Simulated GPS Progress Bar */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">GPS Telemetry Emulation:</span>
              <span className="font-mono text-cyan-400 font-bold">{gpsProgress}% Completed</span>
            </div>

            <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-500"
                style={{ width: `${gpsProgress}%` }}
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleSimulateGPS}
                disabled={simulating || gpsProgress >= 100}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30 disabled:opacity-50 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{simulating ? 'Transiting...' : 'Advance GPS Progress'}</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="text-[11px] text-slate-400 font-mono">
            Safety buffer active: +{act.tacticalDetails?.safetyBufferMinutes || 18} mins
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
          >
            Close Navigation
          </button>
        </div>
      </div>
    </div>
  );
};
