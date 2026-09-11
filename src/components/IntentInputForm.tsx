import React from 'react';
import {
  Sparkles,
  Scale,
  Building2,
  HeartPulse,
  Droplets,
  Accessibility,
  Store,
  ShieldCheck,
  AlertTriangle,
  Send,
  HelpCircle,
} from 'lucide-react';
import { HumanIntentInput, SocietalDomain } from '../types';
import { SAMPLE_CASES } from '../sampleCases';

interface IntentInputFormProps {
  inputData: HumanIntentInput;
  setInputData: React.Dispatch<React.SetStateAction<HumanIntentInput>>;
  onSubmit: () => void;
  isLoading: boolean;
}

const DOMAINS: { key: SocietalDomain; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 'housing_tenancy', label: 'Housing & Tenancy', icon: Building2 },
  { key: 'healthcare_billing', label: 'Healthcare & Billing', icon: HeartPulse },
  { key: 'civic_environment', label: 'Civic & Environment', icon: Droplets },
  { key: 'disability_benefits', label: 'Disability & Benefits', icon: Accessibility },
  { key: 'small_business_licensing', label: 'Community & Licensing', icon: Store },
  { key: 'consumer_rights', label: 'Consumer Rights', icon: ShieldCheck },
];

export const IntentInputForm: React.FC<IntentInputFormProps> = ({
  inputData,
  setInputData,
  onSubmit,
  isLoading,
}) => {
  const handleDomainSelect = (domain: SocietalDomain) => {
    setInputData((prev) => ({ ...prev, domain }));
  };

  const handleSampleSelect = (sampleId: string) => {
    const found = SAMPLE_CASES.find((c) => c.id === sampleId);
    if (found) {
      setInputData({
        rawIntent: found.rawIntent,
        domain: found.domain,
        jurisdiction: found.jurisdiction,
        urgencyLevel: found.urgencyLevel,
        additionalContext: found.additionalContext,
      });
    }
  };

  return (
    <div id="intent-input-container" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-white flex items-center gap-2">
            <Scale className="w-6 h-6 text-amber-400" />
            Express Your Need or Grievance
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Speak naturally. Do not worry about legal jargon or bureaucratic codes — the Bridge translates human intent into systemic leverage.
          </p>
        </div>

        {/* Quick Sample Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-400">Try Real Case:</span>
          <select
            id="sample-case-selector"
            className="text-xs bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
            defaultValue=""
            onChange={(e) => {
              if (e.target.value) handleSampleSelect(e.target.value);
            }}
          >
            <option value="" disabled>
              Select an archetype...
            </option>
            {SAMPLE_CASES.map((sc) => (
              <option key={sc.id} value={sc.id}>
                {sc.title} ({sc.domainLabel})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Domain Selection Chips */}
      <div className="mb-5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
          Select Societal Domain (Optional)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {DOMAINS.map((item) => {
            const Icon = item.icon;
            const isSelected = inputData.domain === item.key;
            return (
              <button
                key={item.key}
                type="button"
                id={`domain-btn-${item.key}`}
                onClick={() => handleDomainSelect(item.key)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all text-left border ${
                  isSelected
                    ? 'bg-amber-400/15 border-amber-400/60 text-amber-300 shadow-sm'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Text Input */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="raw-intent-textarea" className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            What is happening? What do you want to accomplish? *
          </label>
          <span className="text-xs text-slate-500">
            {inputData.rawIntent.length} characters
          </span>
        </div>
        <textarea
          id="raw-intent-textarea"
          rows={4}
          value={inputData.rawIntent}
          onChange={(e) => setInputData((prev) => ({ ...prev, rawIntent: e.target.value }))}
          placeholder="Example: My landlord texted me saying we have 7 days to vacate because of remodeling, but I have a 1-year lease and my elderly parent is recovering from surgery here. What can I legally do to stop an illegal lock-out?"
          className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/70 focus:border-amber-400 transition-all"
        />
      </div>

      {/* Secondary Metadata Grid: Jurisdiction & Urgency */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label htmlFor="jurisdiction-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
            Jurisdiction / Location (City, State, or Country)
          </label>
          <input
            id="jurisdiction-input"
            type="text"
            value={inputData.jurisdiction || ''}
            onChange={(e) => setInputData((prev) => ({ ...prev, jurisdiction: e.target.value }))}
            placeholder="e.g. Cook County, IL; California; London, UK; Federal US"
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
            Urgency / Temporal Risk
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {(['low', 'moderate', 'critical', 'emergency'] as const).map((lvl) => {
              const active = (inputData.urgencyLevel || 'moderate') === lvl;
              const colorClasses =
                lvl === 'emergency'
                  ? active
                    ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-300'
                  : lvl === 'critical'
                  ? active
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-300'
                  : lvl === 'moderate'
                  ? active
                    ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-300'
                  : active
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-300';

              return (
                <button
                  key={lvl}
                  type="button"
                  id={`urgency-btn-${lvl}`}
                  onClick={() => setInputData((prev) => ({ ...prev, urgencyLevel: lvl }))}
                  className={`py-2 px-1 text-xs font-semibold rounded-lg capitalize border transition-all text-center ${colorClasses}`}
                >
                  {lvl}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>Generates formal legal documents, procedural action pathways & statutory citations.</span>
        </div>

        <button
          type="button"
          id="compile-intent-btn"
          disabled={isLoading || !inputData.rawIntent.trim()}
          onClick={onSubmit}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-semibold px-6 py-3 rounded-xl text-sm transition-all shadow-lg shadow-amber-500/10 cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
              <span>Synthesizing Institutional Bridge...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Construct System Bridge</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
