import { pipeline, env } from '@xenova/transformers';
import type { ProgressCallback } from '../types/chat';
import { SYSTEM_PROMPT } from '../data/chatContext';

// Configure transformers.js environment for better browser performance
env.allowLocalModels = false; // Use CDN for model files
env.useBrowserCache = true;   // Cache models in browser

class AIChatService {
  private pipeline: any | null = null;
  private isLoading = false;
  private loadingPromise: Promise<void> | null = null;

  /**
   * Load the GPT-2 model with progress tracking
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

    this.loadingPromise = (async () => {
      try {
        // Create the text generation pipeline with LaMini-Flan-T5
        // LaMini-Flan-T5-783M is a 783M parameter instruction-tuned model
        // - Specifically trained for question answering and instruction following
        // - Optimized for browser inference with transformers.js
        // - Publicly accessible without authentication
        
        this.pipeline = await pipeline(
          'text2text-generation',
          'Xenova/LaMini-Flan-T5-783M',
          {
            quantized: true, // Use quantized version for better performance
            progress_callback: (progress: any) => {
              if (onProgress) {
                // Extract progress information
                const progressInfo = {
                  progress: progress.progress || 0,
                  file: progress.file || '',
                  status: progress.status || 'downloading',
                  loaded: progress.loaded,
                  total: progress.total,
                };
                onProgress(progressInfo);
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
   * GPT-2 uses roughly 1.3-1.5 tokens per word as a rough estimate
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
      // T5 models work with a max context length of 512 tokens
      const MAX_NEW_TOKENS = 128;
      const RESERVED_TOKENS = 50; // Buffer for question
      const MAX_SYSTEM_TOKENS = 400;

      // Truncate system prompt if needed
      const truncatedSystemPrompt = this.truncateToTokenLimit(SYSTEM_PROMPT, MAX_SYSTEM_TOKENS);

      // Build an instruction prompt optimized for T5/Flan models
      // T5 is an encoder-decoder model, so we format as a clear instruction
      const prompt = `${truncatedSystemPrompt}

Question: ${userMessage}

Provide a concise, professional answer based only on the information above.`;

      // Generate the response with T5-optimized parameters
      const result = await this.pipeline(prompt, {
        max_new_tokens: MAX_NEW_TOKENS,
        temperature: 0.7,
        top_k: 50,
        do_sample: true,
      });

      // Extract the generated text from T5 model
      // T5 returns the output directly in generated_text field
      let generatedText = '';
      if (Array.isArray(result)) {
        generatedText = (result[0] as any)?.generated_text || '';
      } else {
        generatedText = (result as any)?.generated_text || '';
      }

      // T5 models return clean output without the prompt, so use directly
      const cleanResponse = generatedText
        .split('\n\n')[0] // Take the first complete thought
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
