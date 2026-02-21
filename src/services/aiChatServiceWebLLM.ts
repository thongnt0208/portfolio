import { CreateMLCEngine, type MLCEngineInterface, type InitProgressReport } from '@mlc-ai/web-llm';
import type { ProgressCallback } from '../types/chat';
import type { AIChatService } from './aiChatServiceInterface';
import { SYSTEM_PROMPT } from '../data/chatContext';
import { FALLBACK_RESPONSE, MIN_RESPONSE_LENGTH, truncateToTokenLimit } from '../utils/aiChat/responseUtils';

let engine: MLCEngineInterface | null = null;
let isLoading = false;
let loadingPromise: Promise<void> | null = null;
let isGenerating = false;

const SELECTED_MODEL = 'Qwen2.5-0.5B-Instruct-q4f16_1-MLC';

const isMobileDevice = (): boolean => {
  const ua = navigator.userAgent;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
};

export const checkWebGPUSupport = async (): Promise<{ supported: boolean; error?: string; details?: any }> => {
  const isSecureContext = window.isSecureContext;
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  const port = window.location.port;
  const fullUrl = `${protocol}//${hostname}${port ? ':' + port : ''}`;
  const isMobile = isMobileDevice();

  console.log('WebGPU support check:', { isSecureContext, protocol, hostname, port, fullUrl, isMobile, hasNavigatorGPU: 'gpu' in navigator });

  if (protocol === 'http:' && !['localhost', '127.0.0.1', ''].includes(hostname)) {
    console.warn('HTTP detected on non-localhost - WebGPU blocked');
    const httpsUrl = fullUrl.replace('http://', 'https://');
    const mobileMsg = isMobile ? `\n\nOn mobile, make sure you're visiting the HTTPS version of this site.` : '';
    return {
      supported: false,
      error: `⚠️ This site must use HTTPS for AI chat to work\n\nYour device supports AI features, but this site is accessed via HTTP which blocks them for security.\n\nPlease visit: ${httpsUrl}${mobileMsg}`,
      details: { reason: 'insecure context - HTTP on non-localhost', protocol, hostname, port, fullUrl, httpsUrl, isSecureContext, isMobile, userAgent: navigator.userAgent },
    };
  }

  if (!('gpu' in navigator) || !navigator.gpu) {
    return {
      supported: false,
      error: 'WebGPU is not supported in your browser. Please use Chrome 113+, Edge 113+, or Safari 17.4+ for the best experience.',
      details: { reason: 'navigator.gpu not found', userAgent: navigator.userAgent, isSecureContext, protocol, hostname, isMobile },
    };
  }

  try {
    const gpu = navigator.gpu as any;
    let adapter = await gpu.requestAdapter();
    if (!adapter) adapter = await gpu.requestAdapter({ powerPreference: 'low-power' });
    if (!adapter) adapter = await gpu.requestAdapter({ powerPreference: 'high-performance' });
    if (!adapter) adapter = await gpu.requestAdapter({ forceFallbackAdapter: true });

    if (!adapter) {
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
      const httpsUrl = fullUrl.replace('http://', 'https://');
      const isHttpIssue = !isSecureContext || (protocol === 'http:' && !['localhost', '127.0.0.1'].includes(hostname));

      if (isHttpIssue) {
        const mobileMsg = isMobile
          ? `\n\nOn mobile, make sure you're visiting:\n${httpsUrl}\n\nBookmark the HTTPS version to avoid this issue.`
          : `\n\nFor development: Enable in chrome://flags\n  1. Open chrome://flags/#unsafely-treat-insecure-origin-as-secure\n  2. Add: ${fullUrl}\n  3. Restart Chrome`;
        return {
          supported: false,
          error: `⚠️ This site must use HTTPS for AI chat to work\n\nYour device supports AI features, but this site is accessed via HTTP which blocks them for security.\n\nPlease visit: ${httpsUrl}${mobileMsg}`,
          details: errorDetails,
        };
      }

      const deviceMsg = isMobile
        ? `WebGPU needs to be enabled on your device.\n\nTo enable WebGPU in Chrome:\n1. Open Chrome and visit: chrome://flags\n2. Search for "WebGPU"\n3. Enable these flags:\n   • "Unsafe WebGPU" - Set to "Enabled"\n   • "WebGPU Developer Features" - Set to "Enabled"\n4. Tap "Relaunch" at the bottom\n5. Return to this page and try again\n\nNote: WebGPU is experimental on mobile. If enabling flags doesn't work, your device may not fully support WebGPU yet.`
        : 'WebGPU adapter could not be created. Your device may not support WebGPU or it may be disabled in chrome://flags.';
      return { supported: false, error: deviceMsg, details: errorDetails };
    }

    let adapterInfo: any = { status: 'info not available' };
    try {
      if ('info' in adapter && adapter.info) {
        adapterInfo = { vendor: adapter.info.vendor || 'unknown', architecture: adapter.info.architecture || 'unknown', device: adapter.info.device || 'unknown', description: adapter.info.description || 'unknown' };
      }
    } catch (infoErr) {
      adapterInfo = { error: 'Could not read adapter info', details: String(infoErr) };
    }

    return {
      supported: true,
      details: { adapterInfo, limits: adapter.limits ? 'available' : 'not available', features: adapter.features ? `${adapter.features.size} features` : 'not available', isMobile },
    };
  } catch (err) {
    return {
      supported: false,
      error: `WebGPU initialization failed: ${err instanceof Error ? err.message : String(err)}`,
      details: { reason: 'adapter request failed', errorName: err instanceof Error ? err.name : 'unknown', errorMessage: err instanceof Error ? err.message : String(err), userAgent: navigator.userAgent, isMobile },
    };
  }
};

const convertProgress = (report: InitProgressReport) => {
  const progress = typeof report.progress === 'number' ? report.progress : 0;
  const text = report.text || '';
  const progressPercent = progress * 100;
  return {
    progress: progressPercent,
    file: text,
    status: progress === 1 ? ('done' as const) : ('progress' as const),
    files: text ? [{ file: text, loaded: progressPercent, total: 100 }] : [],
  };
};

export const loadModel = async (onProgress?: ProgressCallback): Promise<void> => {
  if (engine) return;
  if (isLoading && loadingPromise) return loadingPromise;

  isLoading = true;

  loadingPromise = (async () => {
    try {
      engine = await CreateMLCEngine(SELECTED_MODEL, {
        initProgressCallback: (report: InitProgressReport) => {
          if (onProgress) onProgress(convertProgress(report));
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      engine = null;

      // Tag shader/compute errors so the hybrid orchestrator can detect them for fallback
      const isShaderError =
        message.includes('ShaderModule') ||
        message.includes('shader') ||
        message.includes('compute stage');

      if (isShaderError) {
        const err = new Error(message);
        (err as any).isShaderFailure = true;
        throw err;
      }

      if (message.includes('fetch') || message.includes('network') || message.includes('Failed to fetch')) {
        throw new Error(`Network error while loading model. Please check your internet connection. Details: ${message}`);
      }
      if (message.includes('memory') || message.includes('allocation')) {
        throw new Error(`Insufficient memory to load model. Try closing other apps. Details: ${message}`);
      }
      throw new Error(`Failed to load AI model: ${message}`);
    } finally {
      isLoading = false;
      loadingPromise = null;
    }
  })();

  return loadingPromise;
};

export const generateResponse = async (userMessage: string): Promise<string> => {
  if (!engine) throw new Error('Model not loaded. Please call loadModel() first.');
  if (isGenerating) throw new Error('Another request is already being processed. Please wait.');

  isGenerating = true;
  try {
    const truncatedSystemPrompt = truncateToTokenLimit(SYSTEM_PROMPT, 400);
    const messages = [
      { role: 'system' as const, content: truncatedSystemPrompt },
      { role: 'user' as const, content: `${userMessage}\n\nProvide a concise, professional answer based only on the information above.` },
    ];

    const response = await engine.chat.completions.create({ messages, max_tokens: 150, temperature: 0.7 });
    const rawContent = response.choices?.[0]?.message?.content;
    if (rawContent == null) throw new Error('AI response missing message content.');

    const cleanResponse = rawContent.trim();
    return cleanResponse.length >= MIN_RESPONSE_LENGTH
      ? cleanResponse
      : FALLBACK_RESPONSE;
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  } finally {
    isGenerating = false;
  }
};

export const isModelReady = (): boolean => engine !== null;
export const isModelLoading = (): boolean => isLoading;

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

const webLLMService: AIChatService = { loadModel, generateResponse, isModelReady, isModelLoading, dispose };
export default webLLMService;
