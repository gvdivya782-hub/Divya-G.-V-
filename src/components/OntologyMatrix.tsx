import React from 'react';
import { ArrowRight, BookOpen, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import { OntologyMapping } from '../types';

interface OntologyMatrixProps {
  mappings: OntologyMapping[];
}

export const OntologyMatrix: React.FC<OntologyMatrixProps> = ({ mappings }) => {
  if (!mappings || mappings.length === 0) return null;

  return (
    <div id="ontology-matrix-container" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            Universal Ontology Translation Matrix
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            How everyday human language maps into institutional legal terminology, statutory codes, and procedural leverage.
          </p>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-400/10 text-amber-300 border border-amber-400/20">
          <Sparkles className="w-3.5 h-3.5" />
          {mappings.length} Ontological Translations
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3.5">
        {mappings.map((item, idx) => (
          <div
            key={idx}
            id={`ontology-row-${idx}`}
            className="bg-slate-950/80 border border-slate-800/90 hover:border-slate-700/80 rounded-xl p-4 transition-all"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Human Expression */}
              <div className="flex-1">
                <div className="text-[11px] font-semibold tracking-wider uppercase text-slate-500 mb-1">
                  Human Intent Expression
                </div>
                <div className="text-sm text-slate-200 font-medium italic bg-slate-900/60 border border-slate-800 rounded-lg px-3 py-2">
                  "{item.humanPhrase}"
                </div>
              </div>

              {/* Arrow Connector */}
              <div className="flex items-center justify-center text-amber-400 my-1 md:my-0">
                <div className="p-1.5 rounded-full bg-amber-400/10 border border-amber-400/20">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              {/* System Term of Art */}
              <div className="flex-1">
                <div className="text-[11px] font-semibold tracking-wider uppercase text-amber-400 mb-1 flex items-center justify-between">
                  <span>Institutional Term of Art</span>
                  {item.statutoryBasis && (
                    <span className="text-[10px] text-slate-400 font-mono bg-slate-800 px-2 py-0.5 rounded">
                      {item.statutoryBasis}
                    </span>
                  )}
                </div>
                <div className="text-sm font-semibold text-amber-200 bg-amber-400/5 border border-amber-400/20 rounded-lg px-3 py-2">
                  {item.systemTerm}
                </div>
              </div>
            </div>

            {/* Strategic Leverage Note */}
            {item.significance && (
              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-start gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-200">Procedural Leverage:</strong> {item.significance}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
