import React from 'react';
import { X } from 'lucide-react';
import { useAIChatContext } from '../../../contexts/AIChatContext';

interface ChatPanelHeaderProps {
  isModelReady: boolean;
  onClose: () => void;
}

const backendLabel: Record<string, string> = {
  webgpu: 'WebGPU',
  onnx: 'ONNX',
};

export const ChatPanelHeader: React.FC<ChatPanelHeaderProps> = ({ isModelReady, onClose }) => {
  const { backend, gpuCheck } = useAIChatContext();
  const statusText = isModelReady ? `AI Assistant Ready` : 'Loading...';
  const gpuStatusText = gpuCheck === 'checking' ? 'Checking GPU...' : `Using ${backendLabel[backend] ? `${backendLabel[backend]}` : 'Cannot check GPU'}`;

  return (
    <div className="flex items-center justify-between p-4 border-b border-slate-200">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Ask about Thong</h2>
        <p className="text-xs text-slate-600">{statusText} · {gpuStatusText}</p>
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
};
