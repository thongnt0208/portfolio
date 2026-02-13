import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import aiChatService from '../../../services/aiChatService';
import { ChatInput } from '../ChatInput';
import { ChatPanelHeader } from './ChatPanelHeader';
import { ChatErrorBanner } from './ChatErrorBanner';
import { ChatEmptyState } from './ChatEmptyState';
import { ChatMessagesList } from './ChatMessagesList';
import { ModelLoadingProgress } from '../ModelLoadingProgress';
import type { Message, LoadingProgress } from '../../../types/chat';

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ isOpen, onClose }) => {
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [isModelReady, setIsModelReady] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState<LoadingProgress>({
    progress: 0,
    file: '',
    status: 'idle',
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (isOpen && !hasInitialized.current && !aiChatService.isModelReady()) {
      // Check WebGPU compatibility first (async)
      const checkAndLoad = async () => {
        const gpuCheck = await aiChatService.checkWebGPU();
        console.log('ChatPanel WebGPU check:', gpuCheck);
        if (!gpuCheck.supported) {
          const errorMsg = gpuCheck.error || 'WebGPU is not supported in your browser.';
          console.error('WebGPU not supported in ChatPanel:', gpuCheck.details);
          setError(errorMsg);
          return;
        }
        // Only set flag after WebGPU check passes
        hasInitialized.current = true;
        loadModel();
      };
      checkAndLoad();
    } else if (isOpen && aiChatService.isModelReady()) {
      setIsModelReady(true);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  const loadModel = async () => {
    setIsModelLoading(true);
    setError(null);
    try {
      await aiChatService.loadModel((progress) => {
        setLoadingProgress(progress);
      });
      // Keep the artificial delay only in development to avoid slowing down production UI
      if (import.meta.env.DEV) {
        await new Promise(resolve => setTimeout(resolve, 5000)); // for adjusting UI
      }
      setIsModelReady(true);
      setIsModelLoading(false);
      addMessage(
        'assistant',
        "Hi! I'm here to answer questions about Thong. Feel free to ask about his experience, skills, projects, or anything else!"
      );
    } catch (err) {
      console.error('Failed to load model:', err);
      
      // Check WebGPU status when error occurs
      let webGPUStatus = 'not checked';
      try {
        const gpuCheck = await aiChatService.checkWebGPU();
        webGPUStatus = gpuCheck.supported ? `Supported: ${JSON.stringify(gpuCheck.details)}` : `Not supported: ${gpuCheck.error}`;
      } catch (gpuErr) {
        webGPUStatus = `Check failed: ${gpuErr instanceof Error ? gpuErr.message : String(gpuErr)}`;
      }
      
      // Extract comprehensive error information for debugging
      const errorDetails = {
        message: err instanceof Error ? err.message : String(err),
        name: err instanceof Error ? err.name : 'Unknown',
        stack: err instanceof Error ? err.stack : undefined,
        // Additional error properties that might exist
        ...(err && typeof err === 'object' ? err : {}),
        // WebGPU status at time of error
        webGPU: webGPUStatus,
        webGPUInNavigator: 'gpu' in navigator,
        // Device/browser context
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        screenSize: `${window.screen.width}x${window.screen.height}`,
        viewportSize: `${window.innerWidth}x${window.innerHeight}`,
        timestamp: new Date().toISOString(),
      };
      
      const errorMessage = `Failed to load model:\n${errorDetails.name}: ${errorDetails.message}\n\nWebGPU Status: ${webGPUStatus}\nDevice: ${errorDetails.platform}\nScreen: ${errorDetails.screenSize}\nViewport: ${errorDetails.viewportSize}\n\nFull details:\n${JSON.stringify(errorDetails, null, 2)}`;
      
      console.error('Detailed error info:', errorDetails);
      setError(errorMessage);
      setIsModelLoading(false);
    }
  };

  const addMessage = (role: 'user' | 'assistant', content: string) => {
    const newMessage: Message = {
      id: `${Date.now()}-${Math.random()}`,
      role,
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleSendMessage = async (userMessage: string) => {
    if (!isModelReady || isGenerating) return;
    addMessage('user', userMessage);
    setIsGenerating(true);
    setError(null);

    // Allow React to render the loading state before heavy computation
    await new Promise(resolve => setTimeout(resolve, 0));

    try {
      const response = await aiChatService.generateResponse(userMessage);
      addMessage('assistant', response);
    } catch (err) {
      console.error('Failed to generate response:', err);
      setError('Failed to generate response. Please try again.');
      addMessage(
        'assistant',
        "I'm sorry, I encountered an error. Please try asking your question again."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    hasInitialized.current = false;
    loadModel();
  };

  const showEmptyState =
    isModelReady && messages.length === 0 && !isModelLoading;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-40 md:hidden"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full md:w-[400px] bg-background-light 
                       shadow-2xl z-50 flex flex-col"
          >
            <ChatPanelHeader isModelReady={isModelReady} onClose={onClose} />

            <div className="flex-1 overflow-y-auto p-4">
              {isModelLoading && <ModelLoadingProgress progress={loadingProgress} />}

              {error && <ChatErrorBanner error={error} onRetry={handleRetry} />}

              {showEmptyState && <ChatEmptyState onSelectQuestion={handleSendMessage} />}

              <ChatMessagesList
                messages={messages}
                isGenerating={isGenerating}
                messagesEndRef={messagesEndRef}
              />
            </div>

            {isModelReady && !isModelLoading && <ChatInput onSend={handleSendMessage} disabled={isGenerating || !isModelReady} />}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
