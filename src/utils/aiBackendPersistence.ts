const STORAGE_KEY = 'ai-backend-preference';
const STORAGE_VERSION = 1;
// Transient issues (driver bugs, shader failures) can resolve after browser/driver updates, so reset preference after 4 days.
const TTL_MS = 4 * 24 * 60 * 60 * 1000;

interface PersistedBackend {
  version: number;
  backend: 'onnx' | 'webgpu';
  timestamp: number;
}

export function getPersistedBackend(): 'onnx' | 'webgpu' | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data: PersistedBackend = JSON.parse(raw);
    if (data.version !== STORAGE_VERSION) return null;
    if (Date.now() - data.timestamp > TTL_MS) {
      clearPersistedBackend();
      return null;
    }
    return data.backend;
  } catch {
    return null;
  }
}

export function persistBackend(backend: 'onnx' | 'webgpu'): void {
  try {
    const data: PersistedBackend = {
      version: STORAGE_VERSION,
      backend,
      timestamp: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage may be unavailable (private browsing, full quota)
  }
}

export function clearPersistedBackend(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // noop
  }
}
