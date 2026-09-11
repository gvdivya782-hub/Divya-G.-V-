import React from 'react';
import { CheckCircle2, ShieldCheck, Database, RefreshCw, AlertCircle } from 'lucide-react';
import { VerificationItem, LiveLocationData, LifeBridgeProcessedResult } from '../types';
import { LocationVerificationCard } from './LocationVerificationCard';
import { VerificationCenter } from './VerificationCenter';
import { RiskPriorityAssessment } from './RiskPriorityAssessment';

interface StageVerifyProps {
  data: LifeBridgeProcessedResult;
  verifications: VerificationItem[];
  locationData: LiveLocationData;
  onRequestLocation: () => void;
  isRequestingLocation: boolean;
  statedOrigin?: string;
}

export const StageVerify: React.FC<StageVerifyProps> = ({
  data,
  verifications,
  locationData,
  onRequestLocation,
  isRequestingLocation,
  statedOrigin,
}) => {
  return (
    <div
      id="stage-verify-container"
      className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6"
    >
      {/* Stage Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-mono font-bold text-xs">
            3
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-wide uppercase flex items-center gap-2">
              <span>STAGE 3: VERIFY</span>
              <span className="text-xs font-mono font-normal text-emerald-400 lowercase">
                (Ground-Truth Cross-Check Pipeline)
              </span>
            </h3>
          </div>
        </div>

        {/* Telemetry Disclaimer Label */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
          <Database className="w-3.5 h-3.5 text-emerald-400" />
          <span>Simulated Telemetry & Real Device GPS</span>
        </div>
      </div>

      {/* 1. PROMINENT LIFEBRIDGE VERIFICATION CENTER */}
      <VerificationCenter
        data={data}
        locationData={locationData}
        onRequestLocation={onRequestLocation}
        isRequestingLocation={isRequestingLocation}
      />

      {/* 2. RISK & PRIORITY ASSESSMENT ENGINE */}
      <RiskPriorityAssessment
        data={data}
        locationData={locationData}
      />

      {/* 3. Device Physical Location Hardware Verification Card */}
      <LocationVerificationCard
        locationData={locationData}
        onRequestLocation={onRequestLocation}
        isRequesting={isRequestingLocation}
        statedOrigin={statedOrigin}
      />

      {/* 3. System Environmental & Navigational Telemetry Feeds */}
      <div className="space-y-2.5">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Environmental & Navigational Feeds Cross-Check:</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {verifications.map((item, idx) => (
            <div
              key={item.id || idx}
              id={`verify-card-${idx}`}
              className="bg-slate-950/80 border border-slate-800/90 hover:border-emerald-500/40 rounded-xl p-4 flex flex-col justify-between transition-all space-y-3"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      {item.service}
                    </span>
                  </div>

                  {item.metricBadge && (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 whitespace-nowrap">
                      {item.metricBadge}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-200 leading-relaxed font-medium pl-7">
                  {item.result}
                </p>
              </div>

              {/* Data Source Label */}
              <div className="pt-2 border-t border-slate-800/70 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span className="truncate" title={item.sourceLabel}>
                  {item.sourceLabel}
                </span>
                <span className="text-emerald-400 font-semibold px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                  {item.isMock ? 'SIMULATED' : 'VERIFIED'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trust & Transparency Note */}
      <div className="bg-slate-950/50 border border-slate-800/60 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>
            Telemetry cross-checks verified across live Doppler storm radars, urban roadway sensors, and navigational route engines.
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-500 whitespace-nowrap">
          Telemetry Latency: ~180ms
        </span>
      </div>
    </div>
  );
};
