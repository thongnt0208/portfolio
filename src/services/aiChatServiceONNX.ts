import type { AIChatService } from './aiChatServiceInterface';
import type { ProgressCallback } from '../types/chat';
import { SYSTEM_PROMPT } from '../data/chatContext';

// Module-level state
let pipeline: any = null;
let isLoading = false;
let loadingPromise: Promise<void> | null = null;
let isGenerating = false;

const SELECTED_MODEL = 'Xenova/Qwen1.5-0.5B-Chat';

const truncateToTokenLimit = (text: string, maxTokens: number): string => {
  const maxWords = Math.floor(maxTokens * 0.75);
  const words = text.split(/\s+/);
  return words.length <= maxWords ? text : words.slice(0, maxWords).join(' ') + '...';
};

export const loadModel = async (onProgress?: ProgressCallback): Promise<void> => {
  if (pipeline) return;
  if (isLoading && loadingPromise) return loadingPromise;

  isLoading = true;

  loadingPromise = (async () => {
    try {
      const { pipeline: createPipeline, env } = await import('@xenova/transformers');

      env.allowLocalModels = false;
      env.useBrowserCache = true;
      if (env.backends?.onnx?.wasm) {
        env.backends.onnx.wasm.proxy = true;
      }

      pipeline = await createPipeline('text-generation', SELECTED_MODEL, {
        quantized: true,
        progress_callback: (report: any) => {
          if (!onProgress) return;
          const loaded = report.loaded ?? 0;
          const total = report.total ?? 0;
          const progress = total > 0 ? (loaded / total) * 100 : 0;
          const file = report.file ?? '';
          onProgress({
            progress,
            file,
            status: report.status === 'done' ? 'done' : 'progress',
            loaded,
            total,
            files: file ? [{ file, loaded, total }] : [],
          });
        },
      });
    } catch (error) {
      pipeline = null;
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes('fetch') || message.includes('network') || message.includes('Failed to fetch')) {
        throw new Error(`Network error while loading model. Please check your internet connection. Details: ${message}`);
      }
      throw new Error(`Failed to load AI model (ONNX): ${message}`);
    } finally {
      isLoading = false;
      loadingPromise = null;
    }
  })();

  return loadingPromise;
};

export const generateResponse = async (userMessage: string): Promise<string> => {
  if (!pipeline) {
    throw new Error('Model not loaded. Please call loadModel() first.');
  }

  if (isGenerating) {
    throw new Error('Another request is already being processed. Please wait.');
  }

  isGenerating = true;

  try {
    const truncatedSystemPrompt = truncateToTokenLimit(SYSTEM_PROMPT, 400);

    const prompt = `<|im_start|>system\n${truncatedSystemPrompt}<|im_end|>\n<|im_start|>user\n${userMessage}\n\nProvide a concise, professional answer based only on the information above.<|im_end|>\n<|im_start|>assistant\n`;

    const output = await pipeline(prompt, {
      max_new_tokens: 150,
      temperature: 0.7,
      do_sample: true,
    });

    const rawText: string = Array.isArray(output) ? output[0]?.generated_text ?? '' : output?.generated_text ?? '';
    const assistantStart = rawText.lastIndexOf('<|im_start|>assistant\n');
    const responseText = assistantStart >= 0
      ? rawText.slice(assistantStart + '<|im_start|>assistant\n'.length)
      : rawText.slice(prompt.length);

    const cleaned = responseText.replace(/<\|im_end\|>.*$/s, '').trim();

    return cleaned.length >= 4
      ? cleaned
      : "I'm sorry, I couldn't generate a proper response. Please try asking in a different way.";
  } catch (error) {
    console.error('Error generating response (ONNX):', error);
    throw error;
  } finally {
    isGenerating = false;
  }
};

export const isModelReady = (): boolean => pipeline !== null;

export const isModelLoading = (): boolean => isLoading;

export const dispose = async (): Promise<void> => {
  pipeline = null;
  isLoading = false;
  loadingPromise = null;
  isGenerating = false;
};

const onnxService: AIChatService = {
  loadModel,
  generateResponse,
  isModelReady,
  isModelLoading,
  dispose,
};

export default onnxService;
