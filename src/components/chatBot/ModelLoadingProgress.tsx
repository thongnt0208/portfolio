import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { LoadingProgress } from '../../types/chat';

interface ModelLoadingProgressProps {
  progress: LoadingProgress;
}

const COMPLETE_STATUSES: LoadingProgress['status'][] = ['done', 'ready'];
const COMPLETE_PERCENTAGE = 100;
const BYTES_UNIT = 1024;
const BYTE_SIZES = ['Bytes', 'KB', 'MB', 'GB'] as const;

const SPINNER_CONFIG = {
  duration: 1,
  ease: 'linear' as const,
};

const PROGRESS_BAR_CONFIG = {
  duration: 0.3,
  ease: 'easeOut' as const,
};

const isCompleteStatus = (status: LoadingProgress['status']): boolean =>
  COMPLETE_STATUSES.includes(status);

const isValidNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

const formatBytes = (bytes: number): string => {
  if (!isValidNumber(bytes) || bytes < 0) return '0 Bytes';
  if (bytes === 0) return '0 Bytes';

  const index = Math.floor(Math.log(bytes) / Math.log(BYTES_UNIT));
  const formattedValue = Math.round((bytes / Math.pow(BYTES_UNIT, index)) * 100) / 100;

  return `${formattedValue} ${BYTE_SIZES[index]}`;
};

/** Rounds to 1 decimal for MB/GB to reduce flicker when values update rapidly */
const formatBytesStable = (bytes: number): string => {
  if (!isValidNumber(bytes) || bytes < 0) return '0 Bytes';
  if (bytes === 0) return '0 Bytes';

  const index = Math.floor(Math.log(bytes) / Math.log(BYTES_UNIT));
  const value = bytes / Math.pow(BYTES_UNIT, index);
  const formattedValue = index >= 2 ? Math.round(value * 10) / 10 : Math.round(value * 100) / 100;

  return `${formattedValue} ${BYTE_SIZES[index]}`;
};

const extractFileName = (filePath: string): string =>
  filePath.split('/').pop() || filePath;

const fileProgressPercentage = (loaded: number, total: number): number =>
  total > 0 ? Math.round((loaded / total) * 100) : 0;

export const ModelLoadingProgress: React.FC<ModelLoadingProgressProps> = ({ progress }) => {
  const isComplete = useMemo(() => isCompleteStatus(progress.status), [progress.status]);

  const percentage = useMemo(() => {
    if (isComplete) return COMPLETE_PERCENTAGE;
    return isValidNumber(progress.progress) ? Math.round(progress.progress) : 0;
  }, [isComplete, progress.progress]);

  const fileName = useMemo(() => extractFileName(progress.file), [progress.file]);

  const showFileSize = useMemo(
    () => !isComplete && isValidNumber(progress.loaded) && isValidNumber(progress.total),
    [isComplete, progress.loaded, progress.total]
  );

  const hasMultipleFiles = !isComplete && progress.files && progress.files.length > 0;

  const statusMessage = isComplete ? 'Model loaded, preparing to chat...' : 'Loading AI model...';

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <motion.div
        className="w-12 h-12 border-4 border-slate-300 border-t-slate-900 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ ...SPINNER_CONFIG, repeat: Infinity }}
      />

      <div className="text-center space-y-2">
        <p className="text-lg font-medium text-slate-900">{statusMessage}</p>
        {!isComplete && !hasMultipleFiles && fileName && (
          <p className="text-sm text-slate-600">{fileName}</p>
        )}
      </div>

      <div className="w-full max-w-xs">
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-slate-900"
            initial={{ width: '0%' }}
            animate={{ width: `${percentage}%` }}
            transition={PROGRESS_BAR_CONFIG}
          />
        </div>
        <p className="text-sm text-slate-600 text-center mt-2">{percentage}%</p>
      </div>

      {hasMultipleFiles && (
        <div className="w-full max-w-xs space-y-1.5">
          {progress.files!.map((f) => (
            <div key={f.file} className="flex items-center gap-2">
              <span className="text-xs text-slate-600 truncate flex-1 min-w-0" title={f.file}>
                {extractFileName(f.file)}
              </span>
              <span className="text-xs text-slate-500 tabular-nums shrink-0">
                {fileProgressPercentage(f.loaded, f.total)}%
              </span>
            </div>
          ))}
        </div>
      )}

      {showFileSize && !hasMultipleFiles && (
        <p className="text-xs text-slate-500 min-w-[110px] text-center tabular-nums">
          {formatBytes(progress.loaded!)} / {formatBytes(progress.total!)}
        </p>
      )}

      {showFileSize && hasMultipleFiles && progress.loaded != null && progress.total != null && (
        <p className="text-xs text-slate-500 min-w-[110px] text-center tabular-nums">
          {formatBytesStable(progress.loaded)} / {formatBytesStable(progress.total)} total
        </p>
      )}
    </div>
  );
};
