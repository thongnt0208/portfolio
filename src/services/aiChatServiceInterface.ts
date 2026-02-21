import type { ProgressCallback } from '../types/chat';

export type { ProgressCallback };

export interface AIChatService {
  loadModel(onProgress?: ProgressCallback): Promise<void>;
  generateResponse(message: string): Promise<string>;
  isModelReady(): boolean;
  isModelLoading(): boolean;
  dispose(): Promise<void>;
}

export type AIBackend = 'detecting' | 'webgpu' | 'onnx' | 'error';
