import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Sparkles,
  X,
  UploadCloud,
  Car,
  AlertOctagon,
  FileText,
  Radio,
  MapPin,
  CheckCircle2,
  Globe,
  Keyboard,
  Volume2,
  RotateCcw,
} from 'lucide-react';
import { LocationStatus, SupportedLanguageCode } from '../types';
import { SUPPORTED_LANGUAGES, getLanguageConfig } from '../multilingualData';

interface LifeBridgeInputProps {
  input: string;
  setInput: (val: string) => void;
  onSubmit: (
    text: string,
    image?: { base64: string; mimeType: string },
    language?: SupportedLanguageCode
  ) => void;
  isLoading: boolean;
  onSelectExample: (exampleIndex: number) => void;
  locationStatus?: LocationStatus;
  onRequestLocation?: () => void;
  isRequestingLocation?: boolean;
  currentLanguage: SupportedLanguageCode;
  onSelectLanguage: (code: SupportedLanguageCode) => void;
}

export const LifeBridgeInput: React.FC<LifeBridgeInputProps> = ({
  input,
  setInput,
  onSubmit,
  isLoading,
  onSelectExample,
  locationStatus,
  onRequestLocation,
  isRequestingLocation,
  currentLanguage,
  onSelectLanguage,
}) => {
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [uploadedImage, setUploadedImage] = useState<{
    base64: string;
    mimeType: string;
    previewUrl: string;
    fileName: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const activeLangConfig = getLanguageConfig(currentLanguage);

  // Initialize Speech Recognition for active language
  const toggleSpeech = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        'Speech recognition is not supported in this browser. You can type natively in ' +
          activeLangConfig.name +
          '.'
      );
      setSpeechSupported(false);
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      setInterimTranscript('');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      // Set to current language's BCP-47 locale tag
      recognition.lang = activeLangConfig.speechCode;

      recognition.onstart = () => {
        setIsListening(true);
        setInterimTranscript('');
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += transcript;
          } else {
            interim += transcript;
          }
        }
        if (interim) {
          setInterimTranscript(interim);
        }
        if (final) {
          setInput(final);
          setInterimTranscript('');
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        setInterimTranscript('');
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Speech recognition failed to start:', err);
      setIsListening(false);
      setInterimTranscript('');
    }
  };

  // Switch language and update placeholder if input is empty or matches previous sample
  const handleLanguageChange = (code: SupportedLanguageCode) => {
    onSelectLanguage(code);
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Load sample situation in selected language
  const handleLoadSample = () => {
    setInput(activeLangConfig.samplePrompt);
  };

  // Image Upload Handling
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const base64 = dataUrl.split(',')[1];
      setUploadedImage({
        base64,
        mimeType: file.type || 'image/jpeg',
        previewUrl: dataUrl,
        fileName: file.name,
      });
      if (!input.trim()) {
        setInput(`Extracted context from image: ${file.name}`);
      }
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setUploadedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !uploadedImage) return;
    onSubmit(
      input,
      uploadedImage
        ? { base64: uploadedImage.base64, mimeType: uploadedImage.mimeType }
        : undefined,
      currentLanguage
    );
  };

  return (
    <div id="lifebridge-input-container" className="space-y-4">
      {/* 3 Benchmark Scenario Shortcuts */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400/80 mr-1 font-mono">
          Scenarios:
        </span>

        {/* Example 1 */}
        <button
          type="button"
          id="example-btn-travel"
          onClick={() => onSelectExample(0)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900/90 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/50 text-slate-200 hover:text-cyan-300 transition-all shadow-sm cursor-pointer"
        >
          <Car className="w-3.5 h-3.5 text-cyan-400" />
          <span>Doctor Transit + Rain (Default)</span>
        </button>

        {/* Example 2 */}
        <button
          type="button"
          id="example-btn-emergency"
          onClick={() => onSelectExample(1)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900/90 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-500/50 text-slate-200 hover:text-rose-300 transition-all shadow-sm cursor-pointer"
        >
          <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
          <span>Chest Discomfort / Emergency</span>
        </button>

        {/* Example 3 */}
        <button
          type="button"
          id="example-btn-doc"
          onClick={() => onSelectExample(2)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900/90 hover:bg-blue-950/40 border border-slate-800 hover:border-blue-500/50 text-slate-200 hover:text-blue-300 transition-all shadow-sm cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5 text-blue-400" />
          <span>Multimodal Notice Photo</span>
        </button>
      </div>

      {/* Main Multilingual Input Container */}
      <form
        onSubmit={handleSubmit}
        className="bg-slate-900/90 border border-slate-800 focus-within:border-cyan-500/60 rounded-2xl p-4 sm:p-6 shadow-2xl transition-all relative space-y-4"
      >
        {/* ========================================================== */}
        {/* MULTILINGUAL HEADER & QUICK LANGUAGE SELECTOR BAR */}
        {/* ========================================================== */}
        <div className="space-y-3 pb-3 border-b border-slate-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <span>Speak or type in your language</span>
                  <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                    10 Languages
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Input naturally. LifeBridge extracts ground-truth facts and executes through the 9-stage pipeline.
                </p>
              </div>
            </div>

            {/* Active Language Tag */}
            <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800 text-xs font-mono">
              <span className="text-sm">{activeLangConfig.flag}</span>
              <span className="text-cyan-300 font-bold">{activeLangConfig.name}</span>
              <span className="text-slate-400 text-[11px]">({activeLangConfig.nativeName})</span>
            </div>
          </div>

          {/* 10 Language Select Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-thin">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = lang.code === currentLanguage;
              return (
                <button
                  key={lang.code}
                  type="button"
                  id={`input-lang-chip-${lang.code}`}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20 scale-105'
                      : 'bg-slate-950/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800/90'
                  }`}
                  title={`${lang.name} - ${lang.nativeName}`}
                >
                  <span className="text-xs">{lang.flag}</span>
                  <span className="font-bold">{lang.code.toUpperCase()}</span>
                  <span className="hidden md:inline text-[11px] opacity-90">{lang.nativeName}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================== */}
        {/* INPUT MODE TOGGLE (TEXT INPUT vs VOICE INPUT) */}
        {/* ========================================================== */}
        <div className="flex items-center justify-between gap-3">
          <div className="inline-flex p-1 rounded-xl bg-slate-950 border border-slate-800">
            <button
              type="button"
              id="input-mode-text-btn"
              onClick={() => setInputMode('text')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                inputMode === 'text'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span>Text Input</span>
            </button>

            <button
              type="button"
              id="input-mode-voice-btn"
              onClick={() => {
                setInputMode('voice');
                if (!isListening) {
                  toggleSpeech();
                }
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                inputMode === 'voice'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Voice Input</span>
            </button>
          </div>

          {/* Quick Sample in selected language */}
          <button
            type="button"
            id="load-multilingual-sample-btn"
            onClick={handleLoadSample}
            className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 hover:underline font-mono cursor-pointer"
            title={`Populate realistic situation in ${activeLangConfig.name}`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Try Sample in</span>
            <span className="font-bold">{activeLangConfig.nativeName}</span>
          </button>
        </div>

        {/* ========================================================== */}
        {/* TAB 1: TEXT INPUT AREA */}
        {/* ========================================================== */}
        {inputMode === 'text' ? (
          <div className="space-y-2">
            <textarea
              id="messy-human-input-textarea"
              rows={3}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={activeLangConfig.placeholder}
              className="w-full bg-slate-950/70 border border-slate-800/80 rounded-xl px-4 py-3 text-sm sm:text-base text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 resize-none leading-relaxed font-sans"
            />
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono px-1">
              <span>
                Active Language: <strong className="text-slate-300">{activeLangConfig.name} ({activeLangConfig.nativeName})</strong>
              </span>
              <span>{input.length} characters</span>
            </div>
          </div>
        ) : (
          /* ========================================================== */
          /* TAB 2: VOICE INPUT CONSOLE */
          /* ========================================================== */
          <div
            id="voice-input-console"
            className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-3 relative overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-white uppercase">
                    Voice Dictation Engine
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                    Locale: {activeLangConfig.speechCode}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Speak clearly in <strong className="text-cyan-300">{activeLangConfig.name} ({activeLangConfig.nativeName})</strong>. Web Speech API transcribes directly into your script.
                </p>
              </div>

              {/* Big Interactive Mic Button */}
              <button
                type="button"
                id="voice-console-record-btn"
                onClick={toggleSpeech}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer shadow-lg ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse shadow-rose-500/30'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-cyan-500/20 hover:scale-105'
                }`}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-4 h-4" />
                    <span>Listening... (Click to Stop)</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4" />
                    <span>Start Speaking in {activeLangConfig.nativeName}</span>
                  </>
                )}
              </button>
            </div>

            {/* Listening Wave Visualizer when recording */}
            {isListening && (
              <div className="flex items-center justify-center gap-1.5 py-2">
                <span className="w-1.5 h-6 bg-rose-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-8 bg-rose-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-10 bg-cyan-400 rounded-full animate-bounce" />
                <span className="w-1.5 h-8 bg-rose-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-6 bg-rose-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
              </div>
            )}

            {/* Live Transcript Box */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-sm font-sans min-h-[60px] flex items-center justify-between gap-3">
              <div className="flex-1">
                {input || interimTranscript ? (
                  <div className="space-y-1">
                    <div className="text-white font-medium">{input}</div>
                    {interimTranscript && (
                      <div className="text-cyan-400 italic text-xs">
                        "{interimTranscript}..."
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-slate-500 italic text-xs">
                    {isListening
                      ? `Listening for ${activeLangConfig.name} speech...`
                      : `Click the microphone button to dictate your situation in ${activeLangConfig.nativeName}.`}
                  </span>
                )}
              </div>

              {input && (
                <button
                  type="button"
                  onClick={() => setInput('')}
                  className="text-slate-400 hover:text-rose-400 p-1 rounded transition-colors text-xs flex items-center gap-1"
                  title="Clear spoken text"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Uploaded Image Preview Tag if active */}
        {uploadedImage && (
          <div className="flex items-center gap-3 bg-slate-950 border border-cyan-500/30 rounded-xl p-2 px-3 text-xs">
            <img
              src={uploadedImage.previewUrl}
              alt="Uploaded document"
              className="w-10 h-10 object-cover rounded-lg border border-slate-800"
            />
            <div className="flex-1 truncate">
              <div className="font-semibold text-cyan-300 truncate">
                {uploadedImage.fileName}
              </div>
              <div className="text-[10px] text-slate-400">Attached for multimodal synthesis</div>
            </div>
            <button
              type="button"
              onClick={clearImage}
              className="text-slate-400 hover:text-rose-400 p-1 rounded-md"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Multilingual Translation Intent Preview Banner */}
        <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs font-mono">
          <div className="flex items-center gap-2 text-cyan-300 truncate">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse flex-shrink-0" />
            <span className="truncate">
              {activeLangConfig.flag} {activeLangConfig.name} Intent → Cognitive Extraction → 9-Stage Action Pipeline
            </span>
          </div>
          <span className="hidden sm:inline text-[10px] text-slate-400 font-normal">
            Zero API jargon
          </span>
        </div>

        {/* ========================================================== */}
        {/* BOTTOM CONTROL BAR: ATTACH, GPS & ANALYZE SITUATION BUTTON */}
        {/* ========================================================== */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-800/70">
          {/* Left Actions: Voice Toggle, Attach Photo, Location */}
          <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
            {/* Microphone Quick Button */}
            <button
              type="button"
              id="voice-input-btn"
              onClick={toggleSpeech}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                isListening
                  ? 'bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse shadow-lg shadow-rose-500/20'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300'
              }`}
              title={`Voice input in ${activeLangConfig.nativeName}`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4 text-rose-400" />
                  <span className="font-mono text-rose-300">Listening...</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 text-cyan-400" />
                  <span>Voice ({activeLangConfig.code.toUpperCase()})</span>
                </>
              )}
            </button>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*,.pdf"
              className="hidden"
            />

            {/* Image Upload Trigger */}
            <button
              type="button"
              id="image-upload-btn"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-950 border border-slate-800 text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300 transition-all cursor-pointer"
            >
              <UploadCloud className="w-4 h-4 text-blue-400" />
              <span>Attach Photo / Doc</span>
            </button>

            {/* Device GPS Location Button */}
            {onRequestLocation && (
              <button
                type="button"
                id="input-allow-location-btn"
                onClick={onRequestLocation}
                disabled={isRequestingLocation}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  locationStatus === 'Location Verified'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300'
                }`}
                title="Cross-check device physical GPS coordinates"
              >
                {isRequestingLocation ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                    <span>Locating...</span>
                  </>
                ) : locationStatus === 'Location Verified' ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>GPS Verified</span>
                  </>
                ) : (
                  <>
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Allow Location</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Analyze Situation Submit Button */}
          <button
            type="submit"
            id="translate-action-btn"
            disabled={isLoading || (!input.trim() && !uploadedImage)}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-500 hover:from-cyan-300 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-black px-7 py-3 rounded-xl text-xs sm:text-sm tracking-wide transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Analyzing Situation...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950" />
                <span>Analyze Situation</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
