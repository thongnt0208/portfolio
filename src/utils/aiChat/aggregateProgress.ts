import { LoadingProgress } from "@/types/chat";

export const fileProgressMap = new Map<string, { loaded: number; total: number }>();

/**
 * Aggregate progress from the model into a single progress object
 * @param progress 
 * @returns LoadingProgress from "@/types/chat"
 */
export function aggregateProgress(progress: any): LoadingProgress {
  const file = progress.file || '';
  const loaded = progress.loaded ?? 0;
  const total = progress.total ?? 0;
  if (file) {
    fileProgressMap.set(file, { loaded, total });
  }
  let totalLoaded = 0;
  let totalBytes = 0;
  const files: Array<{ file: string; loaded: number; total: number }> = [];
  fileProgressMap.forEach((v, f) => {
    totalLoaded += v.loaded;
    totalBytes += v.total;
    files.push({ file: f, loaded: v.loaded, total: v.total });
  });
  const overallProgress = totalBytes > 0 ? (totalLoaded / totalBytes) * 100 : progress.progress ?? 0;
  return {
    progress: overallProgress,
    file: progress.file || '',
    status: (progress.status as LoadingProgress['status']) || 'progress',
    loaded: totalLoaded,
    total: totalBytes,
    files: files.length ? files : undefined,
  };
}