import type { ProgressCallback } from '../types/chat';
import type { AIBackend } from './aiChatServiceInterface';
import webLLMService, { checkWebGPUSupport } from './aiChatServiceWebLLM';
import onnxService from './aiChatServiceONNX';

export type GPUCheckResult = { supported: boolean; error?: string; details?: unknown };

let activeBackend: AIBackend = 'detecting';
let backendListeners: Array<(backend: AIBackend) => void> = [];
let cachedGpuCheck: GPUCheckResult | null = null;

const setBackend = (backend: AIBackend) => {
  activeBackend = backend;
  backendListeners.forEach((fn) => fn(backend));
};

export const getBackend = (): AIBackend => activeBackend;

export const onBackendChange = (fn: (backend: AIBackend) => void): (() => void) => {
  backendListeners.push(fn);
  return () => {
    backendListeners = backendListeners.filter((l) => l !== fn);
  };
};

/** Run WebGPU support check once and cache result. Call when panel opens to show status immediately. */
export const checkGPU = async (): Promise<GPUCheckResult> => {
  if (cachedGpuCheck) return cachedGpuCheck;
  const result = await checkWebGPUSupport();
  cachedGpuCheck = { supported: result.supported, error: result.error, details: result.details };
  return cachedGpuCheck;
};

export const loadModel = async (onProgress?: ProgressCallback): Promise<void> => {
  const gpuCheck = await checkGPU();

  if (!gpuCheck.supported) {
    setBackend('onnx');
    try {
      await onnxService.loadModel(onProgress);
      return;
    } catch (error) {
      setBackend('error');
      throw error;
    }
  }

  // WebGPU available - try WebLLM first
  try {
    setBackend('webgpu');
    await webLLMService.loadModel(onProgress);
  } catch (error) {
    const isShaderFailure = (error as any)?.isShaderFailure === true;
    const message = error instanceof Error ? error.message : '';
    const isComputeError = message.includes('ShaderModule') || message.includes('compute stage') || message.includes('shader');

    if (isShaderFailure || isComputeError) {
      console.warn('Hybrid: WebGPU partial support (shader failure), falling back to ONNX');
      setBackend('onnx');
      try {
        await onnxService.loadModel(onProgress);
        return;
      } catch (onnxError) {
        setBackend('error');
        throw onnxError;
      }
    }

    // Non-recoverable error (network, memory, etc.) - surface it
    setBackend('error');
    throw error;
  }
};

export const generateResponse = async (userMessage: string): Promise<string> => {
  if (activeBackend === 'webgpu') return webLLMService.generateResponse(userMessage);
  if (activeBackend === 'onnx') return onnxService.generateResponse(userMessage);
  throw new Error('No AI backend is ready. Please load the model first.');
};

export const isModelReady = (): boolean => {
  if (activeBackend === 'webgpu') return webLLMService.isModelReady();
  if (activeBackend === 'onnx') return onnxService.isModelReady();
  return false;
};

export const isModelLoading = (): boolean => {
  if (activeBackend === 'webgpu') return webLLMService.isModelLoading();
  if (activeBackend === 'onnx') return onnxService.isModelLoading();
  return false;
};

export const dispose = async (): Promise<void> => {
  await Promise.allSettled([webLLMService.dispose(), onnxService.dispose()]);
  setBackend('detecting');
  cachedGpuCheck = null;
};

export default { loadModel, generateResponse, isModelReady, isModelLoading, dispose, getBackend, onBackendChange, checkGPU };
