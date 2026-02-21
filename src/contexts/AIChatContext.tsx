import React, { createContext, useContext, useState, useCallback } from 'react';
import type { AIBackend } from '../services/aiChatServiceInterface';
import type { ProgressCallback } from '../types/chat';
import hybridService from '../services/aiChatServiceHybrid';

interface AIChatContextValue {
  backend: AIBackend;
  loadModel: (onProgress?: ProgressCallback) => Promise<void>;
  generateResponse: (message: string) => Promise<string>;
  isModelReady: boolean;
  isModelLoading: boolean;
  checkWebGPU: () => Promise<{ supported: boolean; error?: string; details?: any }>;
}

const AIChatContext = createContext<AIChatContextValue | null>(null);

export const AIChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [backend, setBackend] = useState<AIBackend>('detecting');
  const [modelReady, setModelReady] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);

  const loadModel = useCallback(async (onProgress?: ProgressCallback) => {
    setModelLoading(true);
    try {
      await hybridService.loadModel(onProgress);
      setBackend(hybridService.getBackend());
      setModelReady(true);
    } finally {
      setModelLoading(false);
    }
  }, []);

  const generateResponse = useCallback((message: string) => {
    return hybridService.generateResponse(message);
  }, []);

  const checkWebGPU = useCallback(async () => {
    const { checkWebGPUSupport } = await import('../services/aiChatServiceWebLLM');
    return checkWebGPUSupport();
  }, []);

  return (
    <AIChatContext.Provider
      value={{
        backend,
        loadModel,
        generateResponse,
        isModelReady: modelReady,
        isModelLoading: modelLoading,
        checkWebGPU,
      }}
    >
      {children}
    </AIChatContext.Provider>
  );
};

export const useAIChatContext = (): AIChatContextValue => {
  const ctx = useContext(AIChatContext);
  if (!ctx) {
    throw new Error('useAIChatContext must be used within AIChatProvider');
  }
  return ctx;
};
