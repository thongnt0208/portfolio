import type { ProgressCallback } from '../types/chat';
import type { AIBackend } from './aiChatServiceInterface';
import webLLMService, { checkWebGPUSupport } from './aiChatServiceWebLLM';
import onnxService from './aiChatServiceONNX';
import { runWebGPUShaderTest } from '../utils/webgpuShaderTest';
import { getPersistedBackend, persistBackend, clearPersistedBackend } from '../utils/aiBackendPersistence';

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

const loadONNXBackend = async (onProgress?: ProgressCallback): Promise<void> => {
  setBackend('onnx');
  try {
    await onnxService.loadModel(onProgress);
  } catch (error) {
    setBackend('error');
    throw error;
  }
};

export const loadModel = async (onProgress?: ProgressCallback): Promise<void> => {
  const persisted = getPersistedBackend();
  if (persisted === 'onnx') {
    return loadONNXBackend(onProgress);
  }

  const gpuCheck = await checkGPU();

  if (!gpuCheck.supported) {
    persistBackend('onnx');
    return loadONNXBackend(onProgress);
  }

  const shaderTest = await runWebGPUShaderTest();
  if (!shaderTest.passed) {
    console.warn('Hybrid: WebGPU shader test failed, using ONNX:', shaderTest.error);
    persistBackend('onnx');
    return loadONNXBackend(onProgress);
  }

  try {
    setBackend('webgpu');
    await webLLMService.loadModel(onProgress);
  } catch (error) {
    const isShaderFailure = (error as any)?.isShaderFailure === true;
    const message = error instanceof Error ? error.message : '';
    const isComputeError = message.includes('ShaderModule') || message.includes('compute stage') || message.includes('shader');

    if (isShaderFailure || isComputeError) {
      console.warn('Hybrid: WebGPU model load shader failure, falling back to ONNX');
      persistBackend('onnx');
      return loadONNXBackend(onProgress);
    }

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

export const resetBackendPreference = (): void => {
  clearPersistedBackend();
  cachedGpuCheck = null;
};

export const dispose = async (): Promise<void> => {
  await Promise.allSettled([webLLMService.dispose(), onnxService.dispose()]);
  setBackend('detecting');
  cachedGpuCheck = null;
};

export default { loadModel, generateResponse, isModelReady, isModelLoading, dispose, getBackend, onBackendChange, checkGPU, resetBackendPreference };
