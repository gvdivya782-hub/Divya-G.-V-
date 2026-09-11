import React, { useState } from 'react';
import {
  FileSearch,
  AlertOctagon,
  Clock,
  ShieldCheck,
  Sparkles,
  Copy,
  Check,
  Download,
  CornerDownRight,
} from 'lucide-react';
import { DecodedDocumentResult } from '../types';

interface SystemDecoderProps {
  onDecode: (text: string, context?: string) => Promise<void>;
  isLoading: boolean;
  result: DecodedDocumentResult | null;
}

const SAMPLE_NOTICES = [
  {
    title: 'Surprise Medical Billing Denial Notice',
    text: `RE: CLAIM NUMBER #8849201-ER
DATE OF SERVICE: 08/14/2026
PATIENT: DIVYA G.
PROVIDER: VALLEY ANESTHESIOLOGY ASSOCIATES
STATUS: REJECTED - NON-COVERED PARTICIPATING BENEFIT

We have reviewed your recent emergency room claim. While Valley Regional Hospital is an in-network facility, your attending surgical assistant provider was out-of-network. Pursuant to Plan Section 14.2(b), out-of-network balance bill obligations remain the direct liability of the covered member. You have 30 calendar days from the postmark of this letter to remit payment of $14,800 or file an internal Level 1 ERISA grievance, failing which this matter will be transferred to active third-party collections.`,
    context: 'Emergency surgery for acute appendicitis without prior network consent.',
  },
  {
    title: 'Informal Renovation Vacate Notice',
    text: `NOTICE TO ALL OCCUPANTS - UNIT 3B
Date: September 4, 2026

Please take notice that management will begin major structural capital improvement renovations on October 1st. In accordance with building upgrade schedules, your month-to-month tenancy is hereby terminated. You must remove all personal belongings and surrender possession by 5:00 PM on September 15. Failure to vacate will result in immediate termination of utility allowances and referral to legal counsel for possession recovery.`,
    context: 'Tenant has a 1-year lease signed 4 months ago and has never missed rent.',
  },
  {
    title: 'Municipal Water Board Precautionary Notice',
    text: `MUNICIPAL WATER AUTHORITY - WATER ADVISORY NOTICE
To Residents of Pine Creek Estates:
Routine quarterly sampling indicated localized turbidity and non-pathogenic organoleptic variations (sulfur-like odor). The Authority emphasizes that water parameters remain nominally within secondary non-enforceable standards. No boil-water order is officially mandated. Residents choosing to request supplemental laboratory spectroscopy must bear costs independently pursuant to Municipal Ordinance 2018-44.`,
    context: 'Several children developed rash and nausea; independent test showed VOC presence.',
  },
];

export const SystemDecoder: React.FC<SystemDecoderProps> = ({
  onDecode,
  isLoading,
  result,
}) => {
  const [docText, setDocText] = useState<string>('');
  const [context, setContext] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docText.trim()) return;
    onDecode(docText, context);
  };

  const handleCopy = () => {
    if (!result?.draftedResponse) return;
    navigator.clipboard.writeText(result.draftedResponse);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadRebuttal = () => {
    if (!result?.draftedResponse) return;
    const element = document.createElement('a');
    const file = new Blob([result.draftedResponse], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'formal-rebuttal-letter.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div id="system-decoder-container" className="space-y-6">
      {/* Input Form Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <FileSearch className="w-6 h-6 text-amber-400" />
              Institutional Jargon & Denial Decoder
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Paste intimidating government letters, insurance denials, eviction notices, or bills. The Bridge decodes the real meaning, exposes legal flaws, and crafts a rebuttal.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400">Load Example:</span>
            <select
              id="notice-sample-select"
              className="text-xs bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
              defaultValue=""
              onChange={(e) => {
                const sample = SAMPLE_NOTICES[Number(e.target.value)];
                if (sample) {
                  setDocText(sample.text);
                  setContext(sample.context);
                }
              }}
            >
              <option value="" disabled>
                Select a notice...
              </option>
              {SAMPLE_NOTICES.map((sn, idx) => (
                <option key={idx} value={idx}>
                  {sn.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="document-text-input"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
            >
              Paste Notice / Denial / Letter Text *
            </label>
            <textarea
              id="document-text-input"
              rows={6}
              value={docText}
              onChange={(e) => setDocText(e.target.value)}
              placeholder="Paste the confusing or threatening letter here..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/70 font-mono text-xs leading-relaxed"
            />
          </div>

          <div>
            <label
              htmlFor="document-context-input"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
            >
              Your Context / What actually happened (Optional)
            </label>
            <input
              id="document-context-input"
              type="text"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="e.g. I was admitted through emergency and never consented to out-of-network doctors."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              id="decode-document-btn"
              disabled={isLoading || !docText.trim()}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-slate-950 font-semibold px-6 py-3 rounded-xl text-sm transition-all shadow-lg shadow-amber-500/10 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                  <span>Deconstructing Institutional Text...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Decode & Draft Rebuttal</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Results View */}
      {result && (
        <div id="decoded-results-view" className="space-y-6">
          {/* Plain English Translation & Institutional Intent */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                Plain English Translation
              </div>
              <p className="text-sm text-slate-200 leading-relaxed">
                {result.plainEnglishSummary}
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4" />
                Institutional Intent & Tactics
              </div>
              <p className="text-sm text-slate-200 leading-relaxed">
                {result.systemIntent}
              </p>
            </div>
          </div>

          {/* Critical Deadlines & Trapdoors */}
          {result.criticalDeadlines && result.criticalDeadlines.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-sm font-bold uppercase tracking-wider text-rose-400 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Critical Deadlines & Hidden Trapdoors
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.criticalDeadlines.map((dl, dIdx) => (
                  <div
                    key={dIdx}
                    className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs font-semibold text-white">
                      <span>{dl.actionRequired}</span>
                      <span className="text-rose-400 font-mono bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                        {dl.deadlineDateOrWindow}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">
                      <strong className="text-rose-300">Consequence if missed:</strong>{' '}
                      {dl.consequenceOfMissing}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vulnerabilities & Legal Rights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">
                Procedural Flaws in the System's Letter
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {result.vulnerabilitiesFound.map((vuln, vIdx) => (
                  <li key={vIdx} className="flex items-start gap-2 bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{vuln}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-3">
                Citizen Rights You Can Invoke
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {result.legalRightsInvoked.map((right, rIdx) => (
                  <li key={rIdx} className="flex items-start gap-2 bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-blue-400 font-bold">•</span>
                    <span>{right}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Drafted Rebuttal Letter */}
          {result.draftedResponse && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-base font-semibold text-white flex items-center gap-2">
                    <CornerDownRight className="w-5 h-5 text-amber-400" />
                    Formal Rebuttal & Cease-or-Comply Notice
                  </h3>
                  <p className="text-xs text-slate-400">
                    Prepared for immediate transmission back to the issuing authority.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Rebuttal</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadRebuttal}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap max-h-[380px] overflow-y-auto">
                {result.draftedResponse}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
