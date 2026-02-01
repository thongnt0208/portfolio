import React from 'react';
import { motion } from 'framer-motion';
import type { LoadingProgress } from '../../types/chat';

interface ModelLoadingProgressProps {
  progress: LoadingProgress;
}

export const ModelLoadingProgress: React.FC<ModelLoadingProgressProps> = ({ progress }) => {
  const percentage = Math.round(progress.progress * 100);
  const fileName = progress.file.split('/').pop() || progress.file;

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      {/* Loading spinner */}
      <motion.div
        className="w-12 h-12 border-4 border-slate-300 border-t-slate-900 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />

      {/* Loading text */}
      <div className="text-center space-y-2">
        <p className="text-lg font-medium text-slate-900">
          {progress.status === 'done' ? 'Model loaded!' : 'Loading AI model...'}
        </p>
        
        {fileName && progress.status !== 'done' && (
          <p className="text-sm text-slate-600">
            {fileName}
          </p>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-xs">
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-slate-900"
            initial={{ width: '0%' }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>
        
        {/* Percentage text */}
        <p className="text-sm text-slate-600 text-center mt-2">
          {percentage}%
        </p>
      </div>

      {/* File size info (if available) */}
      {progress.loaded && progress.total && (
        <p className="text-xs text-slate-500">
          {formatBytes(progress.loaded)} / {formatBytes(progress.total)}
        </p>
      )}
    </div>
  );
};

// Helper function to format bytes
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
