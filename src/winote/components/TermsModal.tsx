import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useUIStore } from '../store/useUIStore';

const TERMS_STORAGE_KEY = 'winote-terms-accepted-v1';

const CORE_TERMS = [
  "You are responsible for the content you write and store in your notes.",
  "The app can automatically download the AI model on your device for smart features. This will use your device storage.",
  "The AI can automatically running in the background without your knowledge.",
  "WiNote do not responsible for any data or content you write in your notes and any data AI models in this app generated. You are responsible for your own data and content.",
  "WiNote do not responsible for any leaks or breaches of your data by any methods, including but not limited to: physical theft, hacking, or any other methods.",
  "WiNote do not responsible for any data loss or damage to your device."
];

export const TermsModal: React.FC = () => {
  const { closeTermsModal } = useUIStore();
  const [isDeclined, setIsDeclined] = useState(false);

  const handleAccept = () => {
    try {
      window.localStorage.setItem(TERMS_STORAGE_KEY, 'true');
    } catch {
      // ignore storage errors
    }
    closeTermsModal();
  };

  if (isDeclined) {
    return (
      <motion.div
        key="declined-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[65] flex items-center justify-center p-4"
      >
        <div className="absolute inset-0 bg-wn-overlay backdrop-blur-md" />
        <motion.div
          initial={{ y: 20, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          className="relative z-10 flex flex-col items-center text-center w-full max-w-[320px] bg-wn-bg-light p-6 rounded-wn-xl border border-wn-border shadow-wn-card"
        >
          <div className="w-12 h-12 rounded-full border border-wn-border bg-wn-card-gray flex items-center justify-center mb-4 shadow-wn-card-sm">
            <X className="w-5 h-5 text-wn-text-primary" />
          </div>
          <h2 className="text-[18px] font-normal text-wn-text-primary mb-2 font-wn">App Access Required</h2>
          <p className="text-[13px] leading-relaxed text-wn-text-tertiary mb-6">
            You must accept the terms and conditions to continue using WiNote.
          </p>
          <button
            onClick={() => setIsDeclined(false)}
            className="w-full px-4 py-3 rounded-2xl bg-wn-cta-bg text-wn-white text-[14px] font-semibold font-wn shadow-wn-btn transition-transform active:scale-95 border-none cursor-pointer"
          >
            Review Terms Again
          </button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[65] flex items-center justify-center"
    >
      <div
        onClick={() => setIsDeclined(true)}
        className="absolute inset-0 bg-wn-overlay backdrop-blur-[4px]"
      />

      <motion.div
        initial={{ y: 40, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0, scale: 0.96 }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="relative w-[calc(100%-32px)] max-w-[360px] max-h-[90vh] flex flex-col rounded-wn-xl overflow-hidden bg-wn-bg-light shadow-[var(--wn-shadow-card),0_20px_60px_rgba(0,0,0,0.18)] border border-wn-border"
      >
        {/* Header */}
        <div className="px-5 pt-5 pb-4 flex items-start gap-3">
          <div className="w-11 h-11 rounded-2xl bg-wn-card-green shadow-wn-card-sm border border-wn-border flex items-center justify-center shrink-0">
            <div className="w-5 h-5 border border-wn-text-primary rounded-[4px]" />
          </div>
          <div className="flex-1">
            <h2 className="text-[20px] leading-[25px] font-normal text-wn-text-primary font-wn">
              Accept Terms &amp;
              <br />
              Conditions
            </h2>
            <p className="mt-1 text-[12.5px] leading-[18px] text-wn-text-tertiary">
              Review how WiNote control your data and keep your privacy.
            </p>
          </div>
          <button
            onClick={() => setIsDeclined(true)}
            aria-label="Close"
            className="w-8 h-8 rounded-full border border-wn-border bg-wn-bg-light flex items-center justify-center cursor-pointer hover:bg-wn-card-gray transition-colors shrink-0"
          >
            <X size={16} className="text-wn-text-secondary" />
          </button>
        </div>

        {/* Scroll area with terms content */}
        <div className="mx-4 mb-3 rounded-3xl border border-wn-divider bg-wn-bg shadow-wn-inset overflow-hidden flex-1 min-h-0">
          <div className="max-h-[340px] overflow-y-auto px-4 py-4 space-y-6">
            
            {/* Privacy highlights */}
            <section>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-wn-accent-green-dark shrink-0" />
                <h3 className="text-[14px] font-semibold leading-[21px] text-wn-text-primary">
                  Privacy highlights
                </h3>
              </div>
              <div className="rounded-2xl border border-wn-border bg-wn-card-yellow shadow-wn-card-sm p-3 mb-3">
                <p className="text-[12.5px] leading-[18px] text-wn-text-primary mb-1.5">
                  By default, your notes stay on your device. WiNote do not collect any data from your notes or any data AI models in this app generated.
                </p>
              </div>

              <div className="space-y-2">
                <div className="rounded-2xl border border-wn-divider bg-wn-card-green-light p-3">
                  <h4 className="text-[12px] font-semibold leading-[18px] text-wn-text-primary mb-1">
                    What WiNote DO NOT do
                  </h4>
                  <p className="text-[11.5px] leading-[16.5px] text-wn-text-tertiary">
                    WiNote DO NOT sell your note content.
                  </p>
                  <p className="text-[11.5px] leading-[16.5px] text-wn-text-tertiary mt-1">
                    WiNote DO NOT use your note content for AI model training purpose.
                  </p>
                </div>
                <div className="rounded-2xl border border-wn-divider bg-wn-card-green-light p-3">
                  <h4 className="text-[12px] font-semibold leading-[18px] text-wn-text-primary mb-1">
                    What WiNote may collect
                  </h4>
                  <p className="text-[11.5px] leading-[16.5px] text-wn-text-tertiary">
                    Basic diagnostics (including but not limited to: app version, crash logs) to improve stability.
                  </p>
                </div>
              </div>
            </section>

            {/* Data usage & controls */}
            <section>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-wn-accent-green-dark shrink-0" />
                <h3 className="text-[14px] font-semibold leading-[21px] text-wn-text-primary">
                  Data usage &amp; controls
                </h3>
              </div>
              <div className="rounded-2xl border border-wn-divider bg-wn-bg-light p-3">
                <h4 className="text-[13px] font-medium leading-[19.5px] text-wn-text-primary mb-1">
                  Model download size
                </h4>
                <p className="text-[11.5px] leading-[16.5px] text-wn-text-tertiary">
                  The AI model can be large and will use device storage. Download over Wi‑Fi is recommended.
                </p>
              </div>
            </section>

            {/* Core terms */}
            <section>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-wn-accent-green-dark shrink-0" />
                <h3 className="text-[14px] font-semibold leading-[21px] text-wn-text-primary">
                  Core terms
                </h3>
              </div>
              <ul className="space-y-2 text-[13.5px] leading-[22.5px] text-wn-text-secondary">
                {CORE_TERMS.map((term, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-2 w-[3px] h-3 rounded-full bg-wn-text-primary/60 shrink-0" />
                    <p>{term}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section className="pt-2 border-t border-wn-divider border-opacity-30">
              <p className="text-[12px] leading-[16.5px] text-wn-text-tertiary">
                By tapping <span className="font-semibold text-wn-text-primary">Accept</span>, you agree to the Terms &amp; Conditions and acknowledge the Privacy highlights above.
              </p>
            </section>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-5 pb-5 space-y-3">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setIsDeclined(true)}
              className="flex-1 px-4 py-2.5 rounded-2xl bg-wn-bg-light shadow-wn-btn text-[13px] font-medium text-wn-text-primary font-wn cursor-pointer border-none"
            >
              Decline
            </button>
            <button
              type="button"
              onClick={handleAccept}
              className="flex-1 px-4 py-2.5 rounded-2xl bg-wn-cta-bg text-wn-white shadow-wn-btn text-[14px] font-semibold font-wn cursor-pointer border-none"
            >
              Accept &amp; Continue
            </button>
          </div>
          <p className="text-center text-[11.5px] leading-[18px] text-wn-text-tertiary">
            You can review these anytime in Settings.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

