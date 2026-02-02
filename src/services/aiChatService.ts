import { pipeline, env } from '@xenova/transformers';
import type { ProgressCallback } from '../types/chat';
import { SYSTEM_PROMPT } from '../data/chatContext';
import { aggregateProgress, fileProgressMap } from '../utils/aiChat/aggregateProgress';


// Configure transformers.js environment for better browser performance
env.allowLocalModels = false; // Use CDN for model files
env.useBrowserCache = true;   // Cache models in browser

class AIChatService {
  private pipeline: any | null = null;
  private isLoading = false;
  private loadingPromise: Promise<void> | null = null;

  /**
   * Load the model with progress tracking
   * @param onProgress 
   * @returns Promise<void>
   */
  async loadModel(onProgress?: ProgressCallback): Promise<void> {
    // If already loaded, return immediately
    if (this.pipeline) {
      return;
    }

    // If currently loading, return the existing promise
    if (this.isLoading && this.loadingPromise) {
      return this.loadingPromise;
    }

    this.isLoading = true;
    fileProgressMap.clear();

    this.loadingPromise = (async () => {
      try {
        // Use Xenova-converted model (ONNX IR ≤8); onnx-community Qwen2.5 uses IR 10, unsupported in browser
        this.pipeline = await pipeline(
          'text-generation',
          'Xenova/Qwen1.5-0.5B-Chat',
          {
            quantized: true,
            progress_callback: (progress: any) => {
              if (onProgress) {
                onProgress(aggregateProgress(progress));
              }
            },
          }
        ) as any;

      } catch (error) {
        console.error('Failed to load model:', error);
        console.error('Error details:', {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        });
        this.pipeline = null;
        throw new Error(
          `Failed to load AI model. ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      } finally {
        this.isLoading = false;
        this.loadingPromise = null;
      }
    })();

    return this.loadingPromise;
  }

  /**
   * Truncate text to approximately fit within token limit
   */
  private truncateToTokenLimit(text: string, maxTokens: number): string {
    // Rough estimation: 1 token ≈ 0.75 words
    const maxWords = Math.floor(maxTokens * 0.75);
    const words = text.split(/\s+/);
    
    if (words.length <= maxWords) {
      return text;
    }
    
    return words.slice(0, maxWords).join(' ') + '...';
  }

  /**
   * Generate a response to the user's question
   */
  async generateResponse(userMessage: string): Promise<string> {
    if (!this.pipeline) {
      throw new Error('Model not loaded. Please call loadModel() first.');
    }

    try {
      const MAX_SYSTEM_TOKENS = 400;

      // Truncate system prompt if needed
      const truncatedSystemPrompt = this.truncateToTokenLimit(SYSTEM_PROMPT, MAX_SYSTEM_TOKENS);

      // Qwen1.5-Chat expects Chat format (system + user); pipeline applies chat template and add_generation_prompt
      const messages = [
        { role: 'system' as const, content: truncatedSystemPrompt },
        {
          role: 'user' as const,
          content: `${userMessage}\n\nProvide a concise, professional answer based only on the information above.`,
        },
      ];

      const result = await this.pipeline(messages, {
        max_new_tokens: 150,
        return_full_text: false,
        do_sample: false,
      });

      // Chat input: generated_text is Message[] with new assistant message last
      const raw = Array.isArray(result) ? (result[0] as any)?.generated_text : (result as any)?.generated_text;
      let generatedText = '';
      if (Array.isArray(raw) && raw.length > 0) {
        const last = raw[raw.length - 1];
        generatedText = typeof last?.content === 'string' ? last.content : '';
      } else if (typeof raw === 'string') {
        generatedText = raw;
      }

      const cleanResponse = generatedText
        .split('\n\n')[0]
        .trim();

      // Validate response quality
      if (!cleanResponse || cleanResponse.length < 10) {
        return "I'm sorry, I couldn't generate a proper response. Please try asking in a different way.";
      }

      return cleanResponse;
    } catch (error) {
      console.error('Error generating response:', error);
      throw error;
    }
  }

  /**
   * Check if the model is ready for inference
   */
  isModelReady(): boolean {
    return this.pipeline !== null;
  }

  /**
   * Check if the model is currently loading
   */
  isModelLoading(): boolean {
    return this.isLoading;
  }

  /**
   * Dispose of the model to free up memory (optional)
   */
  dispose(): void {
    this.pipeline = null;
    this.isLoading = false;
    this.loadingPromise = null;
  }
}

// Export a singleton instance
export const aiChatService = new AIChatService();
