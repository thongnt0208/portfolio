import { pipeline, env } from '@xenova/transformers';
import type { ProgressCallback } from '../types/chat';
import type { AIChatService } from './aiChatServiceInterface';
import { SYSTEM_PROMPT } from '../data/chatContext';

env.allowLocalModels = false;
env.useBrowserCache = true;

if (typeof window !== 'undefined') {
  if (env.backends?.onnx?.wasm) {
    env.backends.onnx.wasm.proxy = true;
  }
}

let model: any | null = null;
let isLoading = false;
let loadingPromise: Promise<void> | null = null;

// Per-file progress tracking, isolated from WebLLM service
const fileProgressMap = new Map<string, { loaded: number; total: number }>();

type ProgressEvent = {
  file?: string;
  loaded?: number;
  total?: number;
  progress?: number;
  status?: string;
};

const aggregateProgress = (progress: ProgressEvent) => {
  const file = progress.file || '';
  const loaded = progress.loaded ?? 0;
  const total = progress.total ?? 0;
  if (file) fileProgressMap.set(file, { loaded, total });

  let totalLoaded = 0;
  let totalBytes = 0;
  const files: Array<{ file: string; loaded: number; total: number }> = [];
  fileProgressMap.forEach((v, f) => {
    totalLoaded += v.loaded;
    totalBytes += v.total;
    files.push({ file: f, loaded: v.loaded, total: v.total });
  });

  return {
    progress: totalBytes > 0 ? (totalLoaded / totalBytes) * 100 : (progress.progress ?? 0),
    file,
    status: (progress.status as any) || 'progress',
    loaded: totalLoaded,
    total: totalBytes,
    files: files.length ? files : undefined,
  };
};

const truncateToTokenLimit = (text: string, maxTokens: number): string => {
  const maxWords = Math.floor(maxTokens * 0.75);
  const words = text.split(/\s+/);
  return words.length <= maxWords ? text : words.slice(0, maxWords).join(' ') + '...';
};

const extractGeneratedText = (result: any): string => {
  const raw = Array.isArray(result) ? result[0]?.generated_text : result?.generated_text;
  if (Array.isArray(raw) && raw.length > 0) {
    const last = raw[raw.length - 1];
    return typeof last?.content === 'string' ? last.content : '';
  }
  return typeof raw === 'string' ? raw : '';
};

export const loadModel = async (onProgress?: ProgressCallback): Promise<void> => {
  if (model) return;
  if (isLoading && loadingPromise) return loadingPromise;

  isLoading = true;
  fileProgressMap.clear();

  loadingPromise = (async () => {
    try {
      model = await pipeline('text-generation', 'Xenova/Qwen1.5-0.5B-Chat', {
        quantized: true,
        progress_callback: (progress: any) => onProgress?.(aggregateProgress(progress)),
      }) as any;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('ONNX model failed to load:', error);
      model = null;
      throw new Error(`Failed to load AI model (compatible mode). ${message}`);
    } finally {
      isLoading = false;
      loadingPromise = null;
    }
  })();

  return loadingPromise;
};

export const generateResponse = async (userMessage: string): Promise<string> => {
  if (!model) throw new Error('Model not loaded. Please call loadModel() first.');

  try {
    const truncatedSystemPrompt = truncateToTokenLimit(SYSTEM_PROMPT, 400);
    const messages = [
      { role: 'system' as const, content: truncatedSystemPrompt },
      { role: 'user' as const, content: `${userMessage}\n\nProvide a concise, professional answer based only on the information above.` },
    ];

    const result = await model(messages, { max_new_tokens: 150, return_full_text: false, do_sample: false });
    const cleanResponse = extractGeneratedText(result).split('\n\n')[0].trim();

    return cleanResponse && cleanResponse.length >= 10
      ? cleanResponse
      : "I'm sorry, I couldn't generate a proper response. Please try asking in a different way.";
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
};

export const isModelReady = (): boolean => model !== null;
export const isModelLoading = (): boolean => isLoading;

export const dispose = async (): Promise<void> => {
  model = null;
  isLoading = false;
  loadingPromise = null;
  fileProgressMap.clear();
};

const onnxService: AIChatService = { loadModel, generateResponse, isModelReady, isModelLoading, dispose };
export default onnxService;
