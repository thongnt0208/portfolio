import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAIChatContext } from '../../../contexts/AIChatContext';
import { ChatInput } from '../ChatInput';
import { ChatPanelHeader } from './ChatPanelHeader';
import { ChatErrorBanner } from './ChatErrorBanner';
import { ChatEmptyState } from './ChatEmptyState';
import { ChatMessagesList } from './ChatMessagesList';
import { ModelLoadingProgress } from '../ModelLoadingProgress';
import type { Message } from '../../../types/chat';

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ isOpen, onClose }) => {
  const { isModelReady, isModelLoading, loadingProgress, error, checkGPU, loadModel, generateResponse, dispose, clearError } = useAIChatContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);
  const hasShownGreeting = useRef(false);

  const addMessage = useCallback((role: 'user' | 'assistant', content: string) => {
    const newMessage: Message = {
      id: `${Date.now()}-${Math.random()}`,
      role,
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  }, []);

  useEffect(() => {
    if (isOpen && !hasInitialized.current) {
      hasInitialized.current = true;
      checkGPU().then(() => loadModel());
    }
  }, [isOpen, checkGPU, loadModel]);

  useEffect(() => {
    if (isModelReady && messages.length === 0 && !hasShownGreeting.current) {
      hasShownGreeting.current = true;
      addMessage('assistant', "Hi! I'm here to answer questions about Thong. Feel free to ask about his experience, skills, projects, or anything else!");
    }
  }, [isModelReady, messages.length, addMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  const handleSendMessage = async (userMessage: string) => {
    if (!isModelReady || isGenerating) return;
    addMessage('user', userMessage);
    setIsGenerating(true);
    setLocalError(null);

    await new Promise((resolve) => setTimeout(resolve, 0));

    try {
      const response = await generateResponse(userMessage);
      addMessage('assistant', response);
    } catch (err) {
      console.error('Failed to generate response:', err);
      setLocalError('Failed to generate response. Please try again.');
      addMessage('assistant', "I'm sorry, I encountered an error. Please try asking your question again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRetry = async () => {
    const hadLoadError = !!error;
    clearError();
    setLocalError(null);

    // Full re-initialization is only needed when model loading failed.
    if (!hadLoadError) return;

    hasShownGreeting.current = messages.length > 0;

    try {
      await dispose();
      await checkGPU();
      await loadModel();
    } catch (err) {
      console.error('Failed to retry model initialization:', err);
    }
  };

  const displayError = error || localError;
  const showEmptyState = isModelReady && messages.length === 0 && !isModelLoading;

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

              {displayError && <ChatErrorBanner error={displayError} onRetry={handleRetry} isRetryable={!!error} />}

              {showEmptyState && <ChatEmptyState onSelectQuestion={handleSendMessage} />}

              <ChatMessagesList
                messages={messages}
                isGenerating={isGenerating}
                messagesEndRef={messagesEndRef}
              />
            </div>

            {isModelReady && !isModelLoading && (
              <ChatInput onSend={handleSendMessage} disabled={isGenerating || !isModelReady} />
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
