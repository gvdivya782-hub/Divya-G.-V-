import React, { useState } from 'react';
import { HelpCircle, RefreshCw, CheckCircle, ChevronRight } from 'lucide-react';
import { BridgeCompilationResult } from '../types';

interface ClarificationRefinerProps {
  questions: BridgeCompilationResult['clarifyingQuestions'];
  onRefine: (answers: Record<string, string>) => Promise<void>;
  isRefining: boolean;
}

export const ClarificationRefiner: React.FC<ClarificationRefinerProps> = ({
  questions,
  onRefine,
  isRefining,
}) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  if (!questions || questions.length === 0) return null;

  const handleOptionSelect = (qId: string, val: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const handleCustomChange = (qId: string, val: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const hasAnyAnswer = Object.values(answers).some((a) => typeof a === 'string' && a.trim().length > 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasAnyAnswer) return;
    onRefine(answers);
  };

  return (
    <div id="clarification-refiner-container" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-lg">
      <div className="flex items-center gap-2 mb-2">
        <HelpCircle className="w-5 h-5 text-amber-400" />
        <h3 className="text-base sm:text-lg font-semibold text-white">
          Reinforce Your Case: Procedural Clarifications
        </h3>
      </div>
      <p className="text-xs text-slate-400 mb-5">
        Institutional systems exploit factual ambiguities. Answering these targeted questions will dynamically calibrate your action pathway and legal documents with maximum evidentiary force.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {questions.map((q, qIdx) => {
          const currentAnswer = answers[q.id] || '';

          return (
            <div
              key={q.id || qIdx}
              className="bg-slate-950 border border-slate-800/90 rounded-xl p-4 space-y-3"
            >
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 font-mono">
                  Clarification {qIdx + 1}
                </span>
                <h4 className="text-sm font-semibold text-slate-100 mt-0.5">
                  {q.question}
                </h4>
                {q.whyItMatters && (
                  <p className="text-xs text-slate-400 mt-1 italic">
                    Why it matters: {q.whyItMatters}
                  </p>
                )}
              </div>

              {/* Quick option pills if available */}
              {q.suggestedOptions && q.suggestedOptions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {q.suggestedOptions.map((opt, oIdx) => {
                    const isSelected = currentAnswer === opt;
                    return (
                      <button
                        key={oIdx}
                        type="button"
                        onClick={() => handleOptionSelect(q.id, opt)}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-400 text-slate-950 font-semibold border-amber-400'
                            : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Free text input */}
              <div>
                <input
                  type="text"
                  value={currentAnswer}
                  onChange={(e) => handleCustomChange(q.id, e.target.value)}
                  placeholder="Or enter specific details here..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>
            </div>
          );
        })}

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isRefining || !hasAnyAnswer}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-amber-400/40 text-amber-300 hover:text-amber-200 font-semibold px-5 py-2.5 rounded-xl text-xs transition-all disabled:opacity-50 cursor-pointer"
          >
            {isRefining ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Recalibrating Bridge Instruments...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Update & Strengthen Documents</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
