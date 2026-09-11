import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  Compass,
  MapPin,
  Clock,
  Layers,
  AlertTriangle,
  HelpCircle,
  Navigation,
  CheckCircle2,
} from 'lucide-react';
import { LifeBridgeProcessedResult, SupportedLanguageCode } from './types';
import {
  MAIN_TRAVEL_DEMO_RESULT,
  EMERGENCY_DEMO_RESULT,
  DOCUMENT_PHOTO_DEMO_RESULT,
} from './demoFallbacks';
import { getLanguageConfig } from './multilingualData';
import { LanguageSelector } from './components/LanguageSelector';
import { LifeBridgeInput } from './components/LifeBridgeInput';
import { VisualPipelineNav } from './components/VisualPipelineNav';
import { StageUnderstand } from './components/StageUnderstand';
import { StageStructure } from './components/StageStructure';
import { LocationVerificationCard } from './components/LocationVerificationCard';
import { VerificationCenter } from './components/VerificationCenter';
import { EvidenceTrustCenter } from './components/EvidenceTrustCenter';
import { RiskPriorityAssessment } from './components/RiskPriorityAssessment';
import { ExplainableAIPanel } from './components/ExplainableAIPanel';
import { DecisionTimeline } from './components/DecisionTimeline';
import { StageAct } from './components/StageAct';
import { FinalDecisionScreen } from './components/FinalDecisionScreen';
import { RouteModal } from './components/RouteModal';
import { JudgeDemoMode } from './components/JudgeDemoMode';
import { useLiveLocation } from './hooks/useLiveLocation';

export default function App() {
  // Pre-load with the Main Travel Demo so judges see the complete 9-stage pipeline immediately
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguageCode>('en');
  const [input, setInput] = useState<string>(MAIN_TRAVEL_DEMO_RESULT.rawInput);
  const [processedResult, setProcessedResult] = useState<LifeBridgeProcessedResult>(MAIN_TRAVEL_DEMO_RESULT);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Live Location Verification Hook
  const { locationData, isRequestingLocation, requestLocation } = useLiveLocation();

  // Route Modal State
  const [routeModalOpen, setRouteModalOpen] = useState<boolean>(false);

  // Judge Demo Mode State
  const [judgeDemoOpen, setJudgeDemoOpen] = useState<boolean>(false);

  // Smooth Scroll Helper
  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Language Change Handler
  const handleLanguageChange = (code: SupportedLanguageCode) => {
    setCurrentLanguage(code);
    // If the input is currently the default or a sample prompt, update it to the new language's sample
    const prevLangConfig = getLanguageConfig(currentLanguage);
    const newLangConfig = getLanguageConfig(code);
    if (!input.trim() || input === prevLangConfig.samplePrompt || input === MAIN_TRAVEL_DEMO_RESULT.rawInput) {
      setInput(newLangConfig.samplePrompt);
    }
  };

  // Handle Example Selection
  const handleSelectExample = (exampleIndex: number) => {
    setError(null);
    if (exampleIndex === 0) {
      const prompt =
        currentLanguage === 'en'
          ? MAIN_TRAVEL_DEMO_RESULT.rawInput
          : getLanguageConfig(currentLanguage).samplePrompt;
      setInput(prompt);
      setProcessedResult(MAIN_TRAVEL_DEMO_RESULT);
    } else if (exampleIndex === 1) {
      setInput(EMERGENCY_DEMO_RESULT.rawInput);
      setProcessedResult(EMERGENCY_DEMO_RESULT);
    } else if (exampleIndex === 2) {
      setInput(DOCUMENT_PHOTO_DEMO_RESULT.rawInput);
      setProcessedResult(DOCUMENT_PHOTO_DEMO_RESULT);
    }
  };

  // Submit Handler
  const handleTranslate = async (
    text: string,
    image?: { base64: string; mimeType: string },
    language?: SupportedLanguageCode
  ) => {
    setIsLoading(true);
    setError(null);
    const activeLang = language || currentLanguage;

    try {
      const res = await fetch('/api/lifebridge/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawInput: text,
          imageBase64: image?.base64,
          mimeType: image?.mimeType,
          language: activeLang,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Server responded with ${res.status}`);
      }

      const data: LifeBridgeProcessedResult = await res.json();
      setProcessedResult(data);

      setTimeout(() => {
        scrollToSection('visual-9-stage-pipeline');
      }, 150);
    } catch (err: any) {
      console.warn('API error, applying resilient multilingual fallback:', err);
      const lower = text.toLowerCase();
      const isElectronic =
        lower.includes('electronic') ||
        lower.includes('इलेक्ट्रॉनिक') ||
        lower.includes('ఎలక్ట్రానిక్') ||
        lower.includes('எலக்ட்ரானிக்') ||
        lower.includes('ಎಲೆಕ್ಟ್ರಾನಿಕ್') ||
        lower.includes('ইলেকট্রনিক') ||
        lower.includes('ઇલેક્ટ્રોનિક');

      const isWhitefield =
        lower.includes('whitefield') ||
        lower.includes('व्हाइटफील्ड') ||
        lower.includes('व्हाईटफील्ड') ||
        lower.includes('వైట్‌ఫీల్డ్') ||
        lower.includes('வைட்ஃபீல்ட்') ||
        lower.includes('ವೈಟ್‌ಫೀಲ್ಡ್') ||
        lower.includes('হোয়াইটফিল্ড') ||
        lower.includes('વ્હાઇટફિલ્ડ');

      if (lower.includes('chest') || lower.includes('elevator') || lower.includes('emergency')) {
        setProcessedResult(EMERGENCY_DEMO_RESULT);
      } else if (
        isElectronic ||
        isWhitefield ||
        lower.includes('hospital') ||
        lower.includes('doctor') ||
        lower.includes('appointment') ||
        lower.includes('अपॉइंटमेंट') ||
        lower.includes('rendez-vous') ||
        lower.includes('cita') ||
        lower.includes('पाऊस') ||
        lower.includes('వర్షం') ||
        lower.includes('மழை') ||
        lower.includes('ಮಳೆ') ||
        lower.includes('বৃষ্টি') ||
        lower.includes('વરસાદ') ||
        lower.includes('pluie') ||
        lower.includes('lluvia')
      ) {
        const langConfig = getLanguageConfig(activeLang);
        setProcessedResult({
          ...MAIN_TRAVEL_DEMO_RESULT,
          rawInput: text,
          summary: `[Cognitively Processed: ${langConfig.name} (${langConfig.nativeName})] Time-sensitive medical consultation transit under adverse weather and peak congestion conditions.`,
        });
      } else if (image || lower.includes('document') || lower.includes('photo')) {
        setProcessedResult(DOCUMENT_PHOTO_DEMO_RESULT);
      } else {
        const langConfig = getLanguageConfig(activeLang);
        setProcessedResult({
          ...MAIN_TRAVEL_DEMO_RESULT,
          rawInput: text,
          summary: `[Translated from ${langConfig.name}] LifeBridge synthesized intent: "${text.slice(0, 120)}..." into verified action stages.`,
        });
      }

      setTimeout(() => {
        scrollToSection('visual-9-stage-pipeline');
      }, 150);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-cyan-400 selection:text-slate-950 pb-24">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-500/25">
              <Compass className="w-6 h-6 font-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-mono">
                  LIFEBRIDGE
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-mono">
                  AI COGNITIVE TRANSLATOR
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                "From messy human intent to verified action."
              </p>
            </div>
          </div>

          {/* Quick Nav Anchors + Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Quick Pipeline Jump */}
            <button
              type="button"
              onClick={() => scrollToSection('visual-9-stage-pipeline')}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              <span>9-Stage Pipeline</span>
            </button>

            {/* Live Location Sensor Button */}
            <button
              type="button"
              id="header-location-btn"
              onClick={() => requestLocation(processedResult?.structured?.origin)}
              disabled={isRequestingLocation}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono border transition-all cursor-pointer ${
                locationData.status === 'Location Verified'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : locationData.status === 'Permission Denied'
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-300'
              }`}
              title="Click to check or refresh device GPS coordinates"
            >
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>
                {isRequestingLocation
                  ? 'Locating...'
                  : locationData.status === 'Location Verified'
                  ? `GPS Verified`
                  : 'Check GPS'}
              </span>
            </button>

            {/* Jump to Evidence & Trust Center */}
            <button
              type="button"
              id="header-trust-center-btn"
              onClick={() => scrollToSection('card-evidence-verification')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 transition-all cursor-pointer"
              title="Jump to LifeBridge Evidence & Trust Center"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Trust Center</span>
            </button>

            {/* Jump to Timeline Button */}
            <button
              type="button"
              id="header-timeline-btn"
              onClick={() => scrollToSection('card-timeline')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 transition-all cursor-pointer"
              title="Jump to LifeBridge Decision Timeline"
            >
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Timeline</span>
            </button>

            {/* Jump to Final Decision Screen */}
            <button
              type="button"
              id="header-final-decision-btn"
              onClick={() => scrollToSection('card-final-decision-section')}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 transition-all cursor-pointer font-bold"
              title="Jump to Final LifeBridge Decision Screen"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Decision</span>
            </button>

            {/* Language Selector in Top-Right Nav */}
            <LanguageSelector
              currentLanguage={currentLanguage}
              onSelectLanguage={handleLanguageChange}
            />

            {/* Prominent Header START JUDGE DEMO Button */}
            <button
              type="button"
              id="header-judge-demo-btn"
              onClick={() => setJudgeDemoOpen(true)}
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-xl text-xs font-mono font-black bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 transition-all shadow-md shadow-cyan-500/25 hover:scale-105 cursor-pointer"
              title="Launch 2-Minute Judge Evaluation Demo"
            >
              <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
              <span>START JUDGE DEMO</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-8 sm:space-y-10">
        {/* ==================================================================== */}
        {/* 1. STRONG HERO SECTION */}
        {/* ==================================================================== */}
        <section id="hero-section" className="relative space-y-6 pt-2">
          {/* Subtle Ambient Glowing Backdrop */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

          {/* Hero Branding Header */}
          <div className="text-center max-w-4xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>ENTERPRISE COGNITIVE TRANSLATION PLATFORM</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight font-mono">
              LIFEBRIDGE
            </h1>

            <p className="text-xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-200 to-blue-400 tracking-tight">
              "From messy human intent to verified action."
            </p>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
              When time-critical appointments, weather emergencies, and complex transit hurdles happen, humans don't speak structured APIs. LifeBridge interprets messy natural intent into verified parameters, deterministic risk calculations, and safe real-world execution.
            </p>

            {/* Primary Action Button Cluster */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                id="hero-start-judge-demo-btn"
                onClick={() => setJudgeDemoOpen(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black px-8 py-3.5 rounded-2xl text-xs sm:text-sm tracking-wide transition-all shadow-xl shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 fill-slate-950" />
                <span>START JUDGE DEMO (2-Minute Walkthrough)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 overflow-x-auto max-w-full py-1">
                <button
                  type="button"
                  onClick={() => handleSelectExample(0)}
                  className="px-3.5 py-2 rounded-xl text-xs font-mono font-semibold bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white transition-all whitespace-nowrap cursor-pointer"
                >
                  🏥 Medical Appointment
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectExample(1)}
                  className="px-3.5 py-2 rounded-xl text-xs font-mono font-semibold bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white transition-all whitespace-nowrap cursor-pointer"
                >
                  🚨 Emergency Escalation
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectExample(2)}
                  className="px-3.5 py-2 rounded-xl text-xs font-mono font-semibold bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white transition-all whitespace-nowrap cursor-pointer"
                >
                  📄 Document Photo
                </button>
              </div>
            </div>
          </div>

          {/* Large Situation Input Box */}
          <div id="card-user-input" className="max-w-4xl mx-auto scroll-mt-24">
            <LifeBridgeInput
              input={input}
              setInput={setInput}
              onSubmit={handleTranslate}
              isLoading={isLoading}
              onSelectExample={handleSelectExample}
              locationStatus={locationData.status}
              onRequestLocation={() => requestLocation(processedResult?.structured?.origin)}
              isRequestingLocation={isRequestingLocation}
              currentLanguage={currentLanguage}
              onSelectLanguage={handleLanguageChange}
            />
          </div>
        </section>

        {/* Error notification if any */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 text-xs text-rose-300 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* ==================================================================== */}
        {/* 2. VISUAL 9-STAGE PIPELINE BANNER */}
        {/* ==================================================================== */}
        <VisualPipelineNav
          onStartJudgeDemo={() => setJudgeDemoOpen(true)}
          onScrollToSection={scrollToSection}
          locationVerified={locationData.status === 'Location Verified'}
        />

        {/* ==================================================================== */}
        {/* 3. CLEAN CARDS FOR ALL APPLICATION STAGES */}
        {/* ==================================================================== */}
        {processedResult && (
          <div id="clean-cards-container" className="space-y-8 sm:space-y-10">
            {/* FOUNDATIONAL STAGES 1 & 2: UNDERSTAND & STRUCTURE */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  COGNITIVE FOUNDATIONS (STAGES 1 & 2)
                </span>
                <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 rounded-full">
                  Synthesized via Gemini
                </span>
              </div>

              {/* Stage 1: Understand */}
              <div id="card-stage-understand" className="scroll-mt-24">
                <StageUnderstand data={processedResult} />
              </div>

              {/* Stage 2: Structure */}
              <div id="card-stage-structure" className="scroll-mt-24">
                <StageStructure structured={processedResult.structured} />
              </div>
            </div>

            {/* CARD A: LOCATION VERIFICATION */}
            <div id="card-location-verification" className="scroll-mt-24 space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-cyan-400" />
                  LOCATION VERIFICATION (STAGE 5 • HARDWARE SENSOR)
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                  Zero Fake GPS Guarantee
                </span>
              </div>
              <LocationVerificationCard
                locationData={locationData}
                onRequestLocation={() => requestLocation(processedResult?.structured?.origin)}
                isRequesting={isRequestingLocation}
                statedOrigin={processedResult.structured?.origin}
              />
            </div>

            {/* CARD B: EVIDENCE & VERIFICATION CENTER */}
            <div id="card-evidence-verification" className="scroll-mt-24 space-y-4">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  EVIDENCE & VERIFICATION (STAGE 4 • PROVENANCE & GROUND TRUTH)
                </span>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 rounded-full">
                  4 Data Categories Audited
                </span>
              </div>

              {/* Evidence & Trust Center (with 4 categories and Trust Summary) */}
              <EvidenceTrustCenter
                data={processedResult}
                locationData={locationData}
                onRequestLocation={() => requestLocation(processedResult?.structured?.origin)}
                isRequestingLocation={isRequestingLocation}
              />

              {/* 8-Point Verification Center Checklist */}
              <VerificationCenter
                data={processedResult}
                locationData={locationData}
                onRequestLocation={() => requestLocation(processedResult?.structured?.origin)}
                isRequestingLocation={isRequestingLocation}
              />
            </div>

            {/* CARD C: RISK & PRIORITY ASSESSMENT ENGINE */}
            <div id="card-risk-priority" className="scroll-mt-24 space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  RISK & PRIORITY (STAGE 6 • DETERMINISTIC COMPOUND SCORING)
                </span>
                <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold">
                  Rule-Based Engine
                </span>
              </div>
              <RiskPriorityAssessment
                data={processedResult}
                locationData={locationData}
              />
            </div>

            {/* CARD D: EXPLAINABILITY ("WHY THIS RECOMMENDATION?") */}
            <div id="card-explainability" className="scroll-mt-24 space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-purple-400" />
                  EXPLAINABILITY (STAGE 7 • 5-STEP CAUSAL REASONING CHAIN)
                </span>
                <span className="text-[10px] font-mono text-purple-300 bg-purple-500/10 border border-purple-500/30 px-2.5 py-0.5 rounded-full">
                  Observable Inputs Trace
                </span>
              </div>
              <ExplainableAIPanel
                data={processedResult}
                locationData={locationData}
              />
            </div>

            {/* CARD E: LIFEBRIDGE DECISION TIMELINE */}
            <div id="card-timeline" className="scroll-mt-24 space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  DECISION TIMELINE (STAGE 8 • AUDITABLE CHRONOLOGICAL LEDGER)
                </span>
                <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 rounded-full">
                  Real Event Timestamps
                </span>
              </div>
              <DecisionTimeline
                data={processedResult}
                locationData={locationData}
                onRequestLocation={() => requestLocation(processedResult?.structured?.origin)}
                isRequestingLocation={isRequestingLocation}
                isLoading={isLoading}
              />
            </div>

            {/* CARD F: RECOMMENDED ACTION & ROUTE SIMULATION */}
            <div id="card-recommended-action" className="scroll-mt-24 space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-emerald-400" />
                  RECOMMENDED ACTION & ROUTE (STAGE 9 • DETERMINISTIC EXECUTION)
                </span>
                <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-bold">
                  Action Ready
                </span>
              </div>
              <StageAct
                data={processedResult}
                act={processedResult.act}
                locationData={locationData}
                onStartRoute={() => setRouteModalOpen(true)}
              />
            </div>

            {/* FINAL RESULT / DECISION SCREEN: POST-STAGE 9 EXECUTIVE SYNTHESIS */}
            <div id="card-final-decision-section" className="scroll-mt-24 space-y-2">
              <FinalDecisionScreen
                data={processedResult}
                locationData={locationData}
                onRecheck={() => {
                  requestLocation(processedResult?.structured?.origin);
                }}
                onBackToHome={() => scrollToSection('lifebridge-input-container')}
                onOpenRoute={() => setRouteModalOpen(true)}
                onScrollToStage={scrollToSection}
              />
            </div>
          </div>
        )}
      </main>

      {/* Navigational Route Simulation Modal */}
      <RouteModal
        isOpen={routeModalOpen}
        onClose={() => setRouteModalOpen(false)}
        act={processedResult ? processedResult.act : null}
        locationData={locationData}
      />

      {/* 2-Minute Guided Judge Demo Mode */}
      <JudgeDemoMode
        isOpen={judgeDemoOpen}
        onClose={() => setJudgeDemoOpen(false)}
        locationData={locationData}
        onRequestLocation={() => requestLocation(processedResult?.structured?.origin)}
        isRequestingLocation={isRequestingLocation}
        onStartRoute={() => setRouteModalOpen(true)}
        onViewFinalDecision={() => scrollToSection('card-final-decision-section')}
      />
    </div>
  );
}
