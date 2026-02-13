import { CreateMLCEngine, type MLCEngineInterface, type InitProgressReport } from '@mlc-ai/web-llm';
import type { ProgressCallback } from '../types/chat';
import { SYSTEM_PROMPT } from '../data/chatContext';

// Module-level state
let engine: MLCEngineInterface | null = null;
let isLoading = false;
let loadingPromise: Promise<void> | null = null;

// Selected model - using a lightweight Qwen model optimized for WebGPU
// {
//       model: "https://huggingface.co/mlc-ai/Qwen2.5-0.5B-Instruct-q4f16_1-MLC",
//       model_id: "Qwen2.5-0.5B-Instruct-q4f16_1-MLC",
//       model_lib:
//         modelLibURLPrefix +
//         modelVersion +
//         "/Qwen2-0.5B-Instruct-q4f16_1-ctx4k_cs1k-webgpu.wasm",
//       low_resource_required: true,
//       vram_required_MB: 944.62,
//       overrides: {
//         context_window_size: 4096,
//       },
//     },
const SELECTED_MODEL = 'Qwen2.5-0.5B-Instruct-q4f16_1-MLC';

/**
 * Truncate text to approximately fit within token limit
 */
const truncateToTokenLimit = (text: string, maxTokens: number): string => {
  const maxWords = Math.floor(maxTokens * 0.75); // 1 token ≈ 0.75 words
  const words = text.split(/\s+/);
  return words.length <= maxWords ? text : words.slice(0, maxWords).join(' ') + '...';
};

/**
 * Convert WebLLM's InitProgressReport to our LoadingProgress format
 */
const convertProgress = (report: InitProgressReport) => {
  const progress = report.progress || 0;
  const text = report.text || '';

  return {
    progress: progress * 100, // Convert 0-1 to 0-100
    file: text,
    status: progress >= 0.99 ? ('done' as const) : ('progress' as const),
  };
};

/**
 * Load the model with progress tracking
 */
export const loadModel = async (onProgress?: ProgressCallback): Promise<void> => {
  if (engine) return;
  if (isLoading && loadingPromise) return loadingPromise;

  isLoading = true;

  loadingPromise = (async () => {
    try {
      // Create MLCEngine with progress callback
      engine = await CreateMLCEngine(SELECTED_MODEL, {
        initProgressCallback: (report: InitProgressReport) => {
          if (onProgress) {
            onProgress(convertProgress(report));
          }
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to load model:', error);
      engine = null;
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
  if (!engine) {
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

    const response = await engine.chat.completions.create({
      messages,
      max_tokens: 150,
      temperature: 0.7,
    });

    const cleanResponse = response.choices[0]?.message?.content?.trim() || '';

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
export const isModelReady = (): boolean => engine !== null;

/**
 * Check if the model is currently loading
 */
export const isModelLoading = (): boolean => isLoading;

/**
 * Dispose of the model to free up memory
 */
export const dispose = (): void => {
  engine = null;
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
