import React, { useState } from 'react';
import {
  FileText,
  Copy,
  Check,
  Download,
  Printer,
  ShieldAlert,
  Send,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { GeneratedArtifact } from '../types';

interface ArtifactViewerProps {
  artifacts: GeneratedArtifact[];
  onSimulate: (artifact: GeneratedArtifact) => void;
  isSimulating: boolean;
}

export const ArtifactViewer: React.FC<ArtifactViewerProps> = ({
  artifacts,
  onSimulate,
  isSimulating,
}) => {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  if (!artifacts || artifacts.length === 0) return null;

  const current = artifacts[selectedIdx] || artifacts[0];

  const handleCopy = () => {
    if (!current?.documentContent) return;
    navigator.clipboard.writeText(current.documentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleDownload = () => {
    if (!current?.documentContent) return;
    const element = document.createElement('a');
    const file = new Blob([current.documentContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${current.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${current.title}</title>
            <style>
              body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.6; margin: 40px; color: #111; }
              h1 { font-size: 16pt; text-align: center; margin-bottom: 24px; }
              pre { white-space: pre-wrap; font-family: inherit; font-size: inherit; }
            </style>
          </head>
          <body>
            <h1>${current.title}</h1>
            <pre>${current.documentContent}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  return (
    <div id="artifact-viewer-container" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            Generated Institutional Artifacts & Legal Instruments
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Complete, court- and agency-admissible instruments with formal averments, statutory reservations, and demand deadlines.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto">
          {artifacts.map((art, idx) => (
            <button
              key={art.id || idx}
              type="button"
              id={`artifact-tab-${idx}`}
              onClick={() => setSelectedIdx(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedIdx === idx
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {art.title}
            </button>
          ))}
        </div>
      </div>

      {/* Artifact Metadata Banner */}
      <div className="bg-slate-950/90 border border-slate-800/80 rounded-xl p-4 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <span className="text-slate-500 uppercase tracking-wider font-semibold block mb-0.5">
              Intended Recipient
            </span>
            <span className="text-slate-200 font-medium">{current.intendedRecipient || 'Institutional Authority'}</span>
          </div>

          <div>
            <span className="text-slate-500 uppercase tracking-wider font-semibold block mb-0.5">
              Statutory Basis
            </span>
            <span className="text-amber-300 font-medium font-mono text-[11px]">
              {current.legalBasisSummary || 'General Administrative Due Process'}
            </span>
          </div>

          <div>
            <span className="text-slate-500 uppercase tracking-wider font-semibold block mb-0.5">
              Delivery Protocol
            </span>
            <span className="text-slate-300 font-medium">
              {current.deliveryInstructions || 'Certified Mail or Hand Delivery with Receipt'}
            </span>
          </div>
        </div>
      </div>

      {/* Document Content View */}
      <div className="relative mb-4">
        <div className="flex items-center justify-between bg-slate-950 px-4 py-2.5 rounded-t-xl border border-b-0 border-slate-800 text-xs text-slate-400">
          <span className="font-mono text-slate-300 font-medium">{current.title}.txt</span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="copy-artifact-btn"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>

            <button
              type="button"
              id="download-artifact-btn"
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              title="Download text file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>

            <button
              type="button"
              id="print-artifact-btn"
              onClick={handlePrint}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              title="Print document"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-b-xl p-5 font-mono text-xs sm:text-[13px] text-slate-200 leading-relaxed max-h-[420px] overflow-y-auto whitespace-pre-wrap select-text">
          {current.documentContent}
        </div>
      </div>

      {/* Stress-Test Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 rounded-xl p-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-400/20 flex items-center justify-center text-amber-400 flex-shrink-0">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-100">
              Institutional Stress-Test Simulator
            </div>
            <div className="text-[11px] text-slate-400">
              Test how an adversarial claims officer or agency inspector would respond to this filing.
            </div>
          </div>
        </div>

        <button
          type="button"
          id="run-stress-test-btn"
          disabled={isSimulating}
          onClick={() => onSimulate(current)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-amber-400/40 text-amber-300 hover:text-amber-200 font-semibold px-4 py-2 rounded-xl text-xs transition-all cursor-pointer"
        >
          {isSimulating ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
              <span>Adjudicating in Real Time...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Run Stress-Test Simulation</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
