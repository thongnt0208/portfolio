import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, RefreshCw } from 'lucide-react';
import { aiChatService } from '../../services/aiChatService';
import { ChatMessage, TypingIndicator } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ModelLoadingProgress } from './ModelLoadingProgress';
import type { Message, LoadingProgress } from '../../types/chat';

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

  // Load model when chat panel opens for the first time
  useEffect(() => {
    if (isOpen && !hasInitialized.current && !aiChatService.isModelReady()) {
      hasInitialized.current = true;
      loadModel();
    } else if (isOpen && aiChatService.isModelReady()) {
      setIsModelReady(true);
    }
  }, [isOpen]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadModel = async () => {
    setIsModelLoading(true);
    setError(null);

    try {
      await aiChatService.loadModel((progress) => {
        setLoadingProgress(progress);
      });

      setIsModelReady(true);
      setIsModelLoading(false);

      // Add welcome message
      addMessage('assistant', "Hi! I'm here to answer questions about Thong. Feel free to ask about his experience, skills, projects, or anything else!");
    } catch (err) {
      console.error('Failed to load model:', err);
      setError('Failed to load the AI model. Please check your internet connection and try again.');
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

    // Add user message
    addMessage('user', userMessage);
    setIsGenerating(true);
    setError(null);

    try {
      // Generate AI response
      const response = await aiChatService.generateResponse(userMessage);
      addMessage('assistant', response);
    } catch (err) {
      console.error('Failed to generate response:', err);
      setError('Failed to generate response. Please try again.');
      addMessage('assistant', "I'm sorry, I encountered an error. Please try asking your question again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    hasInitialized.current = false;
    loadModel();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-40 md:hidden"
            onClick={handleClose}
          />

          {/* Chat panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full md:w-[400px] bg-background-light 
                     shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Ask about Thong
                </h2>
                <p className="text-xs text-slate-600">
                  {isModelReady ? 'AI Assistant Ready' : 'Loading...'}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                aria-label="Close chat"
              >
                <X size={20} className="text-slate-600" />
              </button>
            </div>

            {/* Content area */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* Loading state */}
              {isModelLoading && (
                <ModelLoadingProgress progress={loadingProgress} />
              )}

              {/* Error state */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-red-800">{error}</p>
                      <button
                        onClick={handleRetry}
                        className="mt-2 flex items-center gap-2 text-sm text-red-600 
                                 hover:text-red-700 font-medium"
                      >
                        <RefreshCw size={14} />
                        Retry
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Messages */}
              {isModelReady && messages.length === 0 && !isModelLoading && (
                <div className="text-center py-8">
                  <p className="text-slate-600 text-sm">
                    Start a conversation by asking a question!
                  </p>
                  <div className="mt-4 space-y-2">
                    <button
                      onClick={() => handleSendMessage("What are Thong's main skills?")}
                      className="block w-full px-4 py-2 text-sm text-left bg-slate-100 
                               hover:bg-slate-200 rounded-xl transition-colors"
                    >
                      What are Thong's main skills?
                    </button>
                    <button
                      onClick={() => handleSendMessage("Tell me about his work experience")}
                      className="block w-full px-4 py-2 text-sm text-left bg-slate-100 
                               hover:bg-slate-200 rounded-xl transition-colors"
                    >
                      Tell me about his work experience
                    </button>
                    <button
                      onClick={() => handleSendMessage("What projects has he worked on?")}
                      className="block w-full px-4 py-2 text-sm text-left bg-slate-100 
                               hover:bg-slate-200 rounded-xl transition-colors"
                    >
                      What projects has he worked on?
                    </button>
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}

              {isGenerating && <TypingIndicator />}

              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            {isModelReady && !isModelLoading && (
              <ChatInput
                onSend={handleSendMessage}
                disabled={isGenerating || !isModelReady}
              />
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
