import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import type { LoadingProgress } from '../types/chat';
import type { AIBackend } from '../services/aiChatServiceInterface';
import hybridService from '../services/aiChatServiceHybrid';

interface AIChatContextValue {
  backend: AIBackend;
  isModelReady: boolean;
  isModelLoading: boolean;
  loadingProgress: LoadingProgress;
  error: string | null;
  loadModel: () => Promise<void>;
  generateResponse: (message: string) => Promise<string>;
  dispose: () => Promise<void>;
  clearError: () => void;
}

const AIChatContext = createContext<AIChatContextValue | null>(null);

export const useAIChatContext = (): AIChatContextValue => {
  const ctx = useContext(AIChatContext);
  if (!ctx) throw new Error('useAIChatContext must be used inside AIChatProvider');
  return ctx;
};

export const AIChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [backend, setBackend] = useState<AIBackend>('detecting');
  const [isModelReady, setIsModelReady] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState<LoadingProgress>({ progress: 0, file: '', status: 'idle' });
  const [error, setError] = useState<string | null>(null);
  const loadingRef = useRef(false);

  useEffect(() => {
    const unsubscribe = hybridService.onBackendChange((newBackend) => {
      setBackend(newBackend);
    });
    return unsubscribe;
  }, []);

  const loadModel = useCallback(async () => {
    if (loadingRef.current || hybridService.isModelReady()) {
      if (hybridService.isModelReady()) {
        setIsModelReady(true);
        setBackend(hybridService.getBackend());
      }
      return;
    }

    loadingRef.current = true;
    setIsModelLoading(true);
    setError(null);

    try {
      await hybridService.loadModel((progress) => {
        setLoadingProgress(progress);
      });

      if (import.meta.env.DEV) {
        // Keep a deliberate delay in dev so progress/transition states are easier to validate manually.
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }

      setIsModelReady(true);
      setBackend(hybridService.getBackend());
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('AIChatContext: Failed to load model:', err);
      setError(message);
      setBackend(hybridService.getBackend());
    } finally {
      setIsModelLoading(false);
      loadingRef.current = false;
    }
  }, []);

  const generateResponse = useCallback(async (message: string): Promise<string> => {
    return hybridService.generateResponse(message);
  }, []);

  const dispose = useCallback(async () => {
    await hybridService.dispose();
    setIsModelReady(false);
    setIsModelLoading(false);
    setBackend('detecting');
    setLoadingProgress({ progress: 0, file: '', status: 'idle' });
    setError(null);
    loadingRef.current = false;
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AIChatContext.Provider value={{ backend, isModelReady, isModelLoading, loadingProgress, error, loadModel, generateResponse, dispose, clearError }}>
      {children}
    </AIChatContext.Provider>
  );
};
