import type { AIChatService, AIBackend } from './aiChatServiceInterface';
import type { ProgressCallback } from '../types/chat';
import webLLMService, { checkWebGPUSupport } from './aiChatServiceWebLLM';
import onnxService from './aiChatServiceONNX';

let activeBackend: AIBackend = 'detecting';
let activeService: AIChatService | null = null;

export const loadModel = async (onProgress?: ProgressCallback): Promise<void> => {
  const gpuCheck = await checkWebGPUSupport();

  if (!gpuCheck.supported) {
    console.log('WebGPU not available, using ONNX backend');
    activeBackend = 'onnx';
    activeService = onnxService;
    return onnxService.loadModel(onProgress);
  }

  try {
    activeBackend = 'webgpu';
    activeService = webLLMService;
    await webLLMService.loadModel(onProgress);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : '';

    if (errorMsg.includes('ShaderModule') || errorMsg.includes('shader') || errorMsg.includes('compute stage')) {
      console.warn('WebGPU partial support detected, falling back to ONNX');
      activeBackend = 'onnx';
      activeService = onnxService;
      return onnxService.loadModel(onProgress);
    }

    activeBackend = 'error';
    throw error;
  }
};

export const generateResponse = async (message: string): Promise<string> => {
  if (!activeService) {
    throw new Error('No AI backend active. Please load model first.');
  }
  return activeService.generateResponse(message);
};

export const isModelReady = (): boolean => activeService?.isModelReady() ?? false;

export const isModelLoading = (): boolean => activeService?.isModelLoading() ?? false;

export const dispose = async (): Promise<void> => {
  await activeService?.dispose();
  activeBackend = 'detecting';
  activeService = null;
};

export const getBackend = (): AIBackend => activeBackend;

const hybridService = {
  loadModel,
  generateResponse,
  isModelReady,
  isModelLoading,
  dispose,
  getBackend,
};

export default hybridService;
