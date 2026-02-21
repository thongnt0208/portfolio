import { CreateMLCEngine, type MLCEngineInterface, type InitProgressReport } from '@mlc-ai/web-llm';
import type { AIChatService } from './aiChatServiceInterface';
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
 * Detect if the user is on a mobile device
 */
const isMobileDevice = (): boolean => {
  const ua = navigator.userAgent;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
};

/**
 * Check if WebGPU is supported in the current browser
 */
const checkWebGPUSupport = async (): Promise<{ supported: boolean; error?: string; details?: any }> => {
  // Check if we're in a secure context first
  const isSecureContext = window.isSecureContext;
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  const port = window.location.port;
  const fullUrl = `${protocol}//${hostname}${port ? ':' + port : ''}`;
  const isMobile = isMobileDevice();
  
  console.log('WebGPU support check:', {
    isSecureContext,
    protocol,
    hostname,
    port,
    fullUrl,
    isMobile,
    hasNavigatorGPU: 'gpu' in navigator,
  });
  
  // Check for obvious insecure context (HTTP on non-localhost)
  if (protocol === 'http:' && !['localhost', '127.0.0.1', ''].includes(hostname)) {
    console.warn('⚠️ HTTP detected on non-localhost - WebGPU blocked');
    
    const httpsUrl = fullUrl.replace('http://', 'https://');
    const mobileMsg = isMobile 
      ? `\n\nOn mobile, make sure you're visiting the HTTPS version of this site.` 
      : '';
    
    return {
      supported: false,
      error: `⚠️ This site must use HTTPS for AI chat to work

Your device supports AI features, but this site is accessed via HTTP which blocks them for security.

Please visit: ${httpsUrl}${mobileMsg}`,
      details: {
        reason: 'insecure context - HTTP on non-localhost',
        protocol,
        hostname,
        port,
        fullUrl,
        httpsUrl,
        isSecureContext,
        isMobile,
        userAgent: navigator.userAgent,
      }
    };
  }
  
  // First check if navigator.gpu exists
  if (!('gpu' in navigator) || !navigator.gpu) {
    return {
      supported: false,
      error:
        'WebGPU is not supported in your browser. Please use Chrome 113+, Edge 113+, or Safari 17.4+ for the best experience.',
      details: {
        reason: 'navigator.gpu not found',
        userAgent: navigator.userAgent,
        isSecureContext,
        protocol,
        hostname,
        isMobile,
      }
    };
  }

  // Try to actually request a WebGPU adapter to verify it works
  try {
    const gpu = navigator.gpu as any;
    
    console.log('Attempting to request WebGPU adapter...', {
      isSecureContext,
      protocol,
      hostname,
      isMobile,
      hasGPU: !!gpu,
    });
    
    // Try different adapter configurations
    // Start with default (no options) as it's most likely to work on mobile
    console.log('Trying default adapter (no options)...');
    let adapter = await gpu.requestAdapter();
    console.log('Default adapter result:', adapter ? 'SUCCESS' : 'null');
    
    if (!adapter) {
      console.log('Trying low-power adapter...');
      adapter = await gpu.requestAdapter({ powerPreference: 'low-power' });
      console.log('Low-power adapter result:', adapter ? 'SUCCESS' : 'null');
    }
    
    if (!adapter) {
      console.log('Trying high-performance adapter...');
      adapter = await gpu.requestAdapter({ powerPreference: 'high-performance' });
      console.log('High-performance adapter result:', adapter ? 'SUCCESS' : 'null');
    }
    
    if (!adapter) {
      console.log('Trying fallback adapter...');
      adapter = await gpu.requestAdapter({ forceFallbackAdapter: true });
      console.log('Fallback adapter result:', adapter ? 'SUCCESS' : 'null');
    }
    
    if (!adapter) {
      // Adapter is null - this often happens in insecure contexts even if navigator.gpu exists
      const errorDetails = {
        reason: 'adapter is null after trying all options',
        userAgent: navigator.userAgent,
        navigatorGPU: typeof navigator.gpu,
        platform: navigator.platform,
        isSecureContext,
        protocol,
        hostname,
        isMobile,
      };
      
      console.error('All adapter requests returned null:', errorDetails);
      
      // Check if this is likely an HTTPS issue
      const httpsUrl = fullUrl.replace('http://', 'https://');
      const isHttpIssue = !isSecureContext || (protocol === 'http:' && !['localhost', '127.0.0.1'].includes(hostname));
      
      if (isHttpIssue) {
        const mobileMsg = isMobile 
          ? `\n\nOn mobile, make sure you're visiting:\n${httpsUrl}\n\nBookmark the HTTPS version to avoid this issue.` 
          : `\n\nFor development: Enable in chrome://flags\n  1. Open chrome://flags/#unsafely-treat-insecure-origin-as-secure\n  2. Add: ${fullUrl}\n  3. Restart Chrome`;
        
        return {
          supported: false,
          error: `⚠️ This site must use HTTPS for AI chat to work

Your device supports AI features, but this site is accessed via HTTP which blocks them for security.

Please visit: ${httpsUrl}${mobileMsg}`,
          details: errorDetails,
        };
      }
      
      // Not an HTTPS issue - likely device limitation or browser flag needed
      const deviceMsg = isMobile
        ? `WebGPU needs to be enabled on your device.

To enable WebGPU in Chrome:
1. Open Chrome and visit: chrome://flags
2. Search for "WebGPU"
3. Enable these flags:
   • "Unsafe WebGPU" - Set to "Enabled"
   • "WebGPU Developer Features" - Set to "Enabled"
4. Tap "Relaunch" at the bottom
5. Return to this page and try again

Note: WebGPU is experimental on mobile. If enabling flags doesn't work, your device may not fully support WebGPU yet.`
        : 'WebGPU adapter could not be created. Your device may not support WebGPU or it may be disabled in chrome://flags.';
      
      return {
        supported: false,
        error: deviceMsg,
        details: errorDetails,
      };
    }
    
    console.log('WebGPU adapter obtained successfully');
    
    // Get adapter info if available
    let adapterInfo: any = { status: 'info not available' };
    try {
      if ('info' in adapter && adapter.info) {
        adapterInfo = {
          vendor: adapter.info.vendor || 'unknown',
          architecture: adapter.info.architecture || 'unknown',
          device: adapter.info.device || 'unknown',
          description: adapter.info.description || 'unknown',
        };
      }
    } catch (infoErr) {
      adapterInfo = { error: 'Could not read adapter info', details: String(infoErr) };
    }
    
    // Successfully got an adapter, WebGPU is truly supported
    return { 
      supported: true,
      details: {
        adapterInfo,
        limits: adapter.limits ? 'available' : 'not available',
        features: adapter.features ? `${adapter.features.size} features` : 'not available',
        isMobile,
      }
    };
  } catch (err) {
    return {
      supported: false,
      error: `WebGPU initialization failed: ${err instanceof Error ? err.message : String(err)}`,
      details: {
        reason: 'adapter request failed',
        errorName: err instanceof Error ? err.name : 'unknown',
        errorMessage: err instanceof Error ? err.message : String(err),
        userAgent: navigator.userAgent,
        isMobile,
      }
    };
  }
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
  const gpuCheck = await checkWebGPUSupport();
  console.log('WebGPU check result:', gpuCheck);
  if (!gpuCheck.supported) {
    const errorMsg = gpuCheck.error || 'WebGPU is not supported';
    console.error('WebGPU not supported:', gpuCheck.details);
    throw new Error(errorMsg);
  }
  
  console.log('WebGPU is supported:', gpuCheck.details);

  isLoading = true;

  loadingPromise = (async () => {
    try {
      console.log('Starting to create MLCEngine with model:', SELECTED_MODEL);
      
      // Create MLCEngine with progress callback
      engine = await CreateMLCEngine(SELECTED_MODEL, {
        initProgressCallback: (report: InitProgressReport) => {
          console.log('Model loading progress:', report);
          if (onProgress) {
            onProgress(convertProgress(report));
          }
        },
      });
      
      console.log('MLCEngine created successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      const stack = error instanceof Error ? error.stack : undefined;
      
      console.error('Failed to load model:', {
        error,
        message,
        stack,
        modelId: SELECTED_MODEL,
        userAgent: navigator.userAgent,
        platform: navigator.platform,
      });
      
      engine = null;
      
      // Re-throw shader errors with original message intact so hybrid can detect them for ONNX fallback
      if (message.includes('ShaderModule') || message.includes('shader') || message.includes('compute stage')) {
        throw error;
      } else if (message.includes('fetch') || message.includes('network') || message.includes('Failed to fetch')) {
        throw new Error(`Network error while loading model. Please check your internet connection. Details: ${message}`);
      } else if (message.includes('memory') || message.includes('allocation')) {
        throw new Error(`Insufficient memory to load model. Try closing other apps. Details: ${message}`);
      } else if (message.includes('WebGPU') || message.includes('GPU')) {
        throw new Error(`GPU initialization failed. ${message}`);
      } else {
        throw new Error(`Failed to load AI model: ${message}`);
      }
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

export { checkWebGPUSupport };

export const checkWebGPU = checkWebGPUSupport;

const webLLMService: AIChatService = {
  loadModel,
  generateResponse,
  isModelReady,
  isModelLoading,
  dispose,
};

export default webLLMService;
