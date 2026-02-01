import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  disabled = false,
  placeholder = 'Ask me anything about Thong...',
}) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus on mount
  useEffect(() => {
    if (!disabled && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [disabled]);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedInput = input.trim();
    if (trimmedInput && !disabled) {
      onSend(trimmedInput);
      setInput('');
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-slate-200 p-4">
      <div className="flex gap-2 items-end">
        {/* Text input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className="w-full px-4 py-3 pr-12 text-sm border border-slate-300 rounded-2xl 
                     resize-none focus:outline-none focus:ring-2 focus:ring-slate-900 
                     focus:border-transparent disabled:bg-slate-100 disabled:cursor-not-allowed
                     placeholder:text-slate-400"
            style={{ maxHeight: '120px' }}
          />
        </div>

        {/* Send button */}
        <button
          type="submit"
          disabled={disabled || !input.trim()}
          className="flex-shrink-0 w-10 h-10 flex items-center justify-center 
                   bg-slate-900 text-white rounded-full hover:bg-slate-800 
                   disabled:bg-slate-300 disabled:cursor-not-allowed
                   transition-colors duration-200"
          aria-label="Send message"
        >
          <Send size={18} />
        </button>
      </div>

      {/* Helper text */}
      <p className="text-xs text-slate-500 mt-2 px-1">
        Press Enter to send, Shift+Enter for new line
      </p>
    </form>
  );
};
