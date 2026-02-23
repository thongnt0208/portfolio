import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import type { LoadingProgress } from '../types/chat';
import type { AIBackend } from '../services/aiChatServiceInterface';
import type { GPUCheckResult } from '../services/aiChatServiceHybrid';
import hybridService from '../services/aiChatServiceHybrid';

export type GPUCheckStatus = 'idle' | 'checking' | GPUCheckResult;

interface AIChatContextValue {
  backend: AIBackend;
  gpuCheck: GPUCheckStatus;
  isModelReady: boolean;
  isModelLoading: boolean;
  loadingProgress: LoadingProgress;
  error: string | null;
  checkGPU: () => Promise<GPUCheckResult>;
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
  const [gpuCheck, setGpuCheck] = useState<GPUCheckStatus>('idle');
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

  const checkGPU = useCallback(async (): Promise<GPUCheckResult> => {
    setGpuCheck('checking');
    try {
      const result = await hybridService.checkGPU();
      setGpuCheck(result);
      return result;
    } catch (err) {
      const result: GPUCheckResult = { supported: false, error: err instanceof Error ? err.message : String(err) };
      setGpuCheck(result);
      return result;
    }
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
    setGpuCheck('idle');
    setLoadingProgress({ progress: 0, file: '', status: 'idle' });
    setError(null);
    loadingRef.current = false;
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AIChatContext.Provider value={{ backend, gpuCheck, isModelReady, isModelLoading, loadingProgress, error, checkGPU, loadModel, generateResponse, dispose, clearError }}>
      {children}
    </AIChatContext.Provider>
  );
};
