import React from 'react';
import { X } from 'lucide-react';

interface ChatPanelHeaderProps {
  isModelReady: boolean;
  onClose: () => void;
}

export const ChatPanelHeader: React.FC<ChatPanelHeaderProps> = ({
  isModelReady,
  onClose,
}) => (
  <div className="flex items-center justify-between p-4 border-b border-slate-200">
    <div>
      <h2 className="text-lg font-semibold text-slate-900">Ask about Thong</h2>
      <p className="text-xs text-slate-600">
        {isModelReady ? 'AI Assistant Ready' : 'Loading...'}
      </p>
    </div>
    <button
      onClick={onClose}
      className="p-2 hover:bg-slate-100 rounded-full transition-colors"
      aria-label="Close chat"
    >
      <X size={20} className="text-slate-600" />
    </button>
  </div>
);
