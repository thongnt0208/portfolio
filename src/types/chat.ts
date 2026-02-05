export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface FileProgress {
  file: string;
  loaded: number;
  total: number;
}

export interface LoadingProgress {
  progress: number;
  file: string;
  status: 'idle' | 'progress' | 'done' | 'ready';
  loaded?: number;
  total?: number;
  /** Per-file progress when loading multiple files in parallel */
  files?: FileProgress[];
}

export interface ChatState {
  isOpen: boolean;
  isModelLoading: boolean;
  isModelReady: boolean;
  loadingProgress: LoadingProgress;
  messages: Message[];
  isGenerating: boolean;
  error: string | null;
}

export type ProgressCallback = (progress: LoadingProgress) => void;
