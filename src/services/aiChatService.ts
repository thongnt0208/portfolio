import { pipeline, env } from '@xenova/transformers';
import type { ProgressCallback } from '../types/chat';
import { SYSTEM_PROMPT } from '../data/chatContext';
import { aggregateProgress, fileProgressMap } from '../utils/aiChat/aggregateProgress';

// Configure transformers.js environment
env.allowLocalModels = false;
env.useBrowserCache = true;

// Configure GPU acceleration
if (typeof window !== 'undefined') {
  // Configure WASM to run in worker (prevents blocking main thread)
  if (env.backends?.onnx?.wasm) {
    env.backends.onnx.wasm.proxy = true;
  }
}

// Module-level state
let model: any | null = null;
let isLoading = false;
let loadingPromise: Promise<void> | null = null;

/**
 * Truncate text to approximately fit within token limit
 */
const truncateToTokenLimit = (text: string, maxTokens: number): string => {
  const maxWords = Math.floor(maxTokens * 0.75); // 1 token ≈ 0.75 words
  const words = text.split(/\s+/);
  return words.length <= maxWords ? text : words.slice(0, maxWords).join(' ') + '...';
};

/**
 * Extract generated text from pipeline result
 */
const extractGeneratedText = (result: any): string => {
  const raw = Array.isArray(result) ? result[0]?.generated_text : result?.generated_text;

  if (Array.isArray(raw) && raw.length > 0) {
    const last = raw[raw.length - 1];
    return typeof last?.content === 'string' ? last.content : '';
  }

  return typeof raw === 'string' ? raw : '';
};

/**
 * Load the model with progress tracking
 */
export const loadModel = async (onProgress?: ProgressCallback): Promise<void> => {
  if (model) return;
  if (isLoading && loadingPromise) return loadingPromise;

  isLoading = true;
  fileProgressMap.clear();

  loadingPromise = (async () => {
    try {
      // Use Xenova-converted model (ONNX IR ≤8)
      model = await pipeline(
        'text-generation',
        'Xenova/Qwen1.5-0.5B-Chat',
        {
          quantized: true,
          progress_callback: (progress: any) => onProgress?.(aggregateProgress(progress)),
        }
      ) as any;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to load model:', error);
      model = null;
      throw new Error(`Failed to load AI model. ${message}`);
    } finally {
      isLoading = false;
      loadingPromise = null;
    }
  })();

  return loadingPromise;
};

/**
 * Generate a response to the user's question
 */
export const generateResponse = async (userMessage: string): Promise<string> => {
  if (!model) {
    throw new Error('Model not loaded. Please call loadModel() first.');
  }

  try {
    const truncatedSystemPrompt = truncateToTokenLimit(SYSTEM_PROMPT, 400);

    const messages = [
      { role: 'system' as const, content: truncatedSystemPrompt },
      {
        role: 'user' as const,
        content: `${userMessage}\n\nProvide a concise, professional answer based only on the information above.`,
      },
    ];

    const result = await model(messages, {
      max_new_tokens: 150,
      return_full_text: false,
      do_sample: false,
    });

    const cleanResponse = extractGeneratedText(result).split('\n\n')[0].trim();

    return cleanResponse && cleanResponse.length >= 10
      ? cleanResponse
      : "I'm sorry, I couldn't generate a proper response. Please try asking in a different way.";
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
};

/**
 * Check if the model is ready for inference
 */
export const isModelReady = (): boolean => model !== null;

/**
 * Check if the model is currently loading
 */
export const isModelLoading = (): boolean => isLoading;

/**
 * Dispose of the model to free up memory
 */
export const dispose = (): void => {
  model = null;
  isLoading = false;
  loadingPromise = null;
};

// Default export for compatibility
export default {
  loadModel,
  generateResponse,
  isModelReady,
  isModelLoading,
  dispose,
};
