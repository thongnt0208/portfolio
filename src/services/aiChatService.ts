import { CreateMLCEngine, type MLCEngineInterface, type InitProgressReport } from '@mlc-ai/web-llm';
import type { ProgressCallback } from '../types/chat';
import { SYSTEM_PROMPT } from '../data/chatContext';

// Module-level state
let engine: MLCEngineInterface | null = null;
let isLoading = false;
let loadingPromise: Promise<void> | null = null;
let isGenerating = false;

/**
 * Selected model identifier used by WebLLM.
 *
 * Reference configuration for this model (for documentation only):
 * - Model URL: https://huggingface.co/mlc-ai/Qwen2.5-0.5B-Instruct-q4f16_1-MLC
 * - Model ID: Qwen2.5-0.5B-Instruct-q4f16_1-MLC
 * - Model library (WASM): Qwen2-0.5B-Instruct-q4f16_1-ctx4k_cs1k-webgpu.wasm
 * - Low resource required: true
 * - Approx. VRAM required (MB): 944.62
 * - Overrides: context_window_size = 4096
 */
const SELECTED_MODEL = 'Qwen2.5-0.5B-Instruct-q4f16_1-MLC';

/**
 * Check if WebGPU is supported in the current browser
 */
const checkWebGPUSupport = (): { supported: boolean; error?: string } => {
  if (!('gpu' in navigator)) {
    return {
      supported: false,
      error:
        'WebGPU is not supported in your browser. Please use Chrome 113+, Edge 113+, or Safari 17.4+ for the best experience.',
    };
  }
  return { supported: true };
};

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
  const progress = typeof report.progress === 'number' ? report.progress : 0;
  const text = report.text || '';
  const progressPercent = progress * 100; // Convert 0-1 to 0-100

  return {
    // Overall progress (0-100)
    progress: progressPercent,
    // For backwards compatibility with earlier single-file tracking
    file: text,
    // Status based on exact completion
    status: progress === 1 ? ('done' as const) : ('progress' as const),
    // Multi-file compatible structure: we expose progress per file
    files: text
      ? [
          {
            file: text,
            loaded: progressPercent,
            total: 100,
          },
        ]
      : [],
  };
};

/**
 * Load the model with progress tracking
 */
export const loadModel = async (onProgress?: ProgressCallback): Promise<void> => {
  if (engine) return;
  if (isLoading && loadingPromise) return loadingPromise;

  // Check WebGPU support before attempting to load
  const gpuCheck = checkWebGPUSupport();
  if (!gpuCheck.supported) {
    throw new Error(gpuCheck.error);
  }

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

  // Prevent concurrent generation requests
  if (isGenerating) {
    throw new Error('Another request is already being processed. Please wait.');
  }

  isGenerating = true;

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
      temperature: 0.7, // Intentionally using non-zero temperature for varied responses
    });

    const rawContent = response.choices?.[0]?.message?.content;
    if (rawContent == null) {
      throw new Error('AI response missing message content.');
    }

    const cleanResponse = rawContent.trim();

    return cleanResponse.length >= 4
      ? cleanResponse
      : "I'm sorry, I couldn't generate a proper response. Please try asking in a different way.";
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  } finally {
    isGenerating = false;
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
export const dispose = async (): Promise<void> => {
  if (engine) {
    try {
      await engine.unload();
    } catch (error) {
      console.error('Error unloading engine:', error);
    }
  }
  engine = null;
  isLoading = false;
  loadingPromise = null;
  isGenerating = false;
};

/**
 * Check if WebGPU is supported (exported for UI compatibility checks)
 */
export const checkWebGPU = checkWebGPUSupport;

// Default export for compatibility
export default {
  loadModel,
  generateResponse,
  isModelReady,
  isModelLoading,
  dispose,
  checkWebGPU,
};
