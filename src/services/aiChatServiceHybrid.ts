import type { ProgressCallback } from '../types/chat';
import type { AIBackend } from './aiChatServiceInterface';
import webLLMService, { checkWebGPUSupport } from './aiChatServiceWebLLM';
import onnxService from './aiChatServiceONNX';

let activeBackend: AIBackend = 'detecting';
let backendListeners: Array<(backend: AIBackend) => void> = [];

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

export const loadModel = async (onProgress?: ProgressCallback): Promise<void> => {
  const gpuCheck = await checkWebGPUSupport();
  console.log('Hybrid: WebGPU check result:', gpuCheck);

  if (!gpuCheck.supported) {
    console.log('Hybrid: WebGPU unavailable, using ONNX');
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
    console.log('Hybrid: WebGPU available, trying WebLLM');
    setBackend('webgpu');
    await webLLMService.loadModel(onProgress);
    console.log('Hybrid: WebLLM loaded successfully');
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
};

export const checkWebGPU = checkWebGPUSupport;

export default { loadModel, generateResponse, isModelReady, isModelLoading, dispose, getBackend, onBackendChange, checkWebGPU };
