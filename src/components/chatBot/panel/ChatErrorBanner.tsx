import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ChatErrorBannerProps {
  error: string;
  onRetry: () => void;
}

export const ChatErrorBanner: React.FC<ChatErrorBannerProps> = ({
  error,
  onRetry,
}) => (
  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
    <div className="flex items-start gap-3">
      <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-red-800 whitespace-pre-wrap break-words max-h-[200px] overflow-y-auto">
          {error}
        </p>
        <button
          onClick={onRetry}
          className="mt-3 flex items-center gap-2 text-sm text-red-600 
                   hover:text-red-700 font-medium transition-colors"
        >
          <RefreshCw size={14} />
          Retry
        </button>
      </div>
    </div>
  </div>
);
