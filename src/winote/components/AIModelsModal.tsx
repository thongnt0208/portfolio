import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Brain, Download, Trash2, Check, Clock, HardDrive } from 'lucide-react';
import { useUIStore } from '../store/useUIStore';

export interface AIModelItem {
  id: string;
  name: string;
  size: string;
  downloaded: boolean;
}

const defaultModels: AIModelItem[] = [
  { id: '1', name: 'Qwen 0.5B', size: '~340MB', downloaded: true },
  { id: '2', name: 'Phi-2 Mini', size: '~1.6GB', downloaded: false },
  { id: '3', name: 'Llama 3 8B', size: '~4.7GB', downloaded: false },
];

export const AIModelsModal: React.FC = () => {
  const { closeAIModelsModal } = useUIStore();
  const [models, setModels] = useState<AIModelItem[]>(defaultModels);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!downloadingId) {
      setProgress(0);
      return;
    }
    const interval = setInterval(() => {
      setProgress((p) => (p >= 100 ? 100 : p + 2));
    }, 80);
    return () => clearInterval(interval);
  }, [downloadingId]);

  useEffect(() => {
    if (progress >= 100 && downloadingId) {
      setModels((prev) =>
        prev.map((m) => (m.id === downloadingId ? { ...m, downloaded: true } : m))
      );
      setDownloadingId(null);
    }
  }, [progress, downloadingId]);

  const handleDownload = (id: string) => {
    setDownloadingId(id);
    setProgress(0);
  };

  const handleCancelDownload = () => {
    setDownloadingId(null);
    setProgress(0);
  };

  const handleRemove = (id: string) => {
    setModels((prev) =>
      prev.map((m) => (m.id === id ? { ...m, downloaded: false } : m))
    );
  };

  const downloadingModel = downloadingId ? models.find((m) => m.id === downloadingId) : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center"
    >
      <div
        onClick={closeAIModelsModal}
        className="absolute inset-0 bg-[rgba(30,30,20,0.7)] backdrop-blur-[4px]"
      />

      <motion.div
        initial={{ y: 40, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0, scale: 0.96 }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="relative w-[calc(100%-32px)] max-w-[400px] max-h-[85vh] flex flex-col rounded-wn-xl overflow-hidden bg-wn-bg-light shadow-[var(--wn-shadow-card),0_20px_60px_rgba(0,0,0,0.15)] border border-wn-border"
      >
        {/* Header — matches Figma "Download AI Model" / "to start smart features" */}
        <div className="p-5 border-b border-wn-divider flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-wn-card-green shadow-wn-card-sm">
              <Brain size={20} className="text-wn-text-primary" />
            </div>
            <div>
              <h2 className="text-wn-lg font-bold text-wn-text-primary font-wn">Download AI Model</h2>
              <p className="text-wn-xs text-wn-text-tertiary font-wn">to start smart features</p>
            </div>
          </div>
          <button
            onClick={closeAIModelsModal}
            aria-label="Close"
            className="w-9 h-9 rounded-full border border-wn-border bg-wn-bg-light flex items-center justify-center cursor-pointer hover:bg-wn-card-gray transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Info row: Estimated time, Storage required — Figma style */}
          <div className="grid grid-cols-2 gap-3">
            <div className="clay-inset p-3 rounded-wn-md flex items-center gap-2">
              <Clock size={18} className="text-wn-text-tertiary shrink-0" />
              <div>
                <p className="text-wn-xs text-wn-text-tertiary">Estimated time</p>
                <p className="text-wn-sm font-medium text-wn-text-primary">~ 2 min</p>
              </div>
            </div>
            <div className="clay-inset p-3 rounded-wn-md flex items-center gap-2">
              <HardDrive size={18} className="text-wn-text-tertiary shrink-0" />
              <div>
                <p className="text-wn-xs text-wn-text-tertiary">Storage required</p>
                <p className="text-wn-sm font-medium text-wn-text-primary">148 MB</p>
              </div>
            </div>
          </div>

          {/* Progress when downloading */}
          {downloadingModel && (
            <div className="space-y-2">
              <div className="flex justify-between text-wn-sm">
                <span className="text-wn-text-secondary">Downloading...</span>
                <span className="font-medium text-wn-text-primary">{Math.min(progress, 100)}%</span>
              </div>
              <div className="h-2 rounded-full bg-wn-card-gray overflow-hidden shadow-wn-inset">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ type: 'tween', duration: 0.2 }}
                  className="h-full rounded-full bg-wn-cta-bg"
                />
              </div>
            </div>
          )}

          {/* Model list */}
          <div className="space-y-3">
            {models.map((model) => (
              <div
                key={model.id}
                className="clay-card p-4 flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-wn-lg flex items-center justify-center shrink-0 bg-wn-card-green-light">
                  <Brain size={24} className="text-wn-text-secondary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-wn-base font-semibold text-wn-text-primary truncate">
                    {model.name}
                  </p>
                  <p className="text-wn-xs text-wn-text-tertiary">{model.size}</p>
                </div>
                {model.downloaded ? (
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="flex items-center gap-1.5 text-wn-xs text-wn-text-secondary">
                      <Check size={14} className="text-[var(--wn-accent-green)]" />
                      Downloaded
                    </span>
                    <button
                      onClick={() => handleRemove(model.id)}
                      aria-label={`Remove ${model.name}`}
                      className="w-8 h-8 rounded-wn-sm flex items-center justify-center border border-wn-border bg-wn-bg-light cursor-pointer hover:bg-wn-card-gray transition-colors"
                    >
                      <Trash2 size={14} className="text-wn-text-tertiary" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleDownload(model.id)}
                    disabled={!!downloadingId}
                    className="shrink-0 flex items-center gap-2 px-3 py-2 rounded-wn-lg text-wn-sm font-medium cursor-pointer border-none transition-all disabled:opacity-70 bg-wn-cta-bg text-wn-white shadow-wn-btn font-wn"
                  >
                    <Download size={14} />
                    Download
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Privacy — Figma copy */}
          <p className="text-wn-xs text-wn-text-secondary text-center">
            Works fully on-device. We&apos;ll never upload your notes.
          </p>

          {downloadingId && (
            <button
              onClick={handleCancelDownload}
              className="w-full py-2 text-wn-sm text-wn-text-tertiary hover:text-wn-text-primary transition-colors cursor-pointer bg-transparent border-none font-wn"
            >
              Cancel
            </button>
          )}
        </div>

        <div className="p-4 pt-2 border-t border-wn-divider shrink-0">
          <p className="text-wn-xs text-wn-text-tertiary text-center">
            Tip: Keep Wi-Fi on for faster download.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};
