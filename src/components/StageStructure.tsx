import React from 'react';
import {
  MapPin,
  Navigation,
  Clock,
  CloudRain,
  Activity,
  AlertTriangle,
  User,
  Layers,
} from 'lucide-react';
import { StructuredCardsData, PriorityLevel } from '../types';

interface StageStructureProps {
  structured: StructuredCardsData;
}

export const StageStructure: React.FC<StageStructureProps> = ({ structured }) => {
  const isHighPriority = structured.priority === 'critical' || structured.priority === 'high';

  return (
    <div id="stage-structure-container" className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
      {/* Stage Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-500/20 border border-blue-500/40 text-blue-400 flex items-center justify-center font-mono font-bold text-xs">
            2
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-wide uppercase flex items-center gap-2">
              <span>STAGE 2: STRUCTURE</span>
              <span className="text-xs font-mono font-normal text-blue-400 lowercase">
                (Ontological Parameter Extraction)
              </span>
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
          <Layers className="w-3.5 h-3.5 text-blue-400" />
          <span>Structured Key-Value Ontology</span>
        </div>
      </div>

      {/* Cards Grid: Origin, Destination, Deadline, Weather, Traffic, Priority */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Origin */}
        <div className="bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 rounded-xl p-3.5 flex flex-col justify-between transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Origin</span>
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-sm sm:text-base font-bold text-white truncate" title={structured.origin || 'N/A'}>
            {structured.origin || 'N/A'}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Starting Point</div>
        </div>

        {/* Destination */}
        <div className="bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 rounded-xl p-3.5 flex flex-col justify-between transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Destination</span>
            <Navigation className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-sm sm:text-base font-bold text-white truncate" title={structured.destination || 'N/A'}>
            {structured.destination || 'N/A'}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Target Endpoint</div>
        </div>

        {/* Deadline */}
        <div className="bg-slate-950/80 border border-slate-800 hover:border-amber-500/40 rounded-xl p-3.5 flex flex-col justify-between transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Deadline</span>
            <Clock className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-sm sm:text-base font-bold text-amber-300 font-mono truncate" title={structured.deadline || 'Immediate'}>
            {structured.deadline || 'Immediate'}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Hard Milestone</div>
        </div>

        {/* Weather */}
        <div className="bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 rounded-xl p-3.5 flex flex-col justify-between transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Weather</span>
            <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-sm sm:text-base font-bold text-cyan-200 capitalize truncate" title={structured.weather || 'Checked'}>
            {structured.weather || 'Normal'}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Environmental State</div>
        </div>

        {/* Traffic */}
        <div className="bg-slate-950/80 border border-slate-800 hover:border-rose-500/40 rounded-xl p-3.5 flex flex-col justify-between transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Traffic</span>
            <Activity className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-sm sm:text-base font-bold text-rose-300 capitalize truncate" title={structured.traffic || 'Moderate'}>
            {structured.traffic || 'Normal'}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Corridor Status</div>
        </div>

        {/* Priority */}
        <div
          className={`border rounded-xl p-3.5 flex flex-col justify-between transition-all ${
            isHighPriority
              ? 'bg-rose-950/20 border-rose-500/40'
              : 'bg-slate-950/80 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Priority</span>
            <AlertTriangle className={`w-3.5 h-3.5 ${isHighPriority ? 'text-rose-400' : 'text-amber-400'}`} />
          </div>
          <div
            className={`text-sm sm:text-base font-black font-mono uppercase tracking-wider ${
              isHighPriority ? 'text-rose-400' : 'text-amber-400'
            }`}
          >
            {structured.priority}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Calculated Urgency</div>
        </div>
      </div>

      {/* Secondary Structured Context (Passenger or Custom Fields) */}
      {(structured.passenger || (structured.customFields && structured.customFields.length > 0)) && (
        <div className="flex flex-wrap items-center gap-3 pt-2 text-xs border-t border-slate-800/80">
          {structured.passenger && (
            <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300">
              <User className="w-3.5 h-3.5 text-blue-400" />
              <span>
                <strong className="text-slate-200">Passenger/Party:</strong> {structured.passenger}
              </span>
            </div>
          )}

          {structured.customFields?.map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300"
            >
              <span className="text-cyan-400 font-bold">•</span>
              <span>
                <strong className="text-slate-200">{f.label}:</strong> {f.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
