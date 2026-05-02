export const REMOTE_BACKEND = 'https://sektor-backend.onrender.com';

/** Render erişilemezse tarayıcıdaki origin (dev’de genelde http://localhost:5173). */
export function getLocalFallbackOrigin() {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return 'http://localhost:5173';
}

let resolvedOrigin = null;

export async function resolveBackendOrigin() {
  try {
    const controller = new AbortController();
    const tid = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`${REMOTE_BACKEND.replace(/\/$/, '')}/health`, {
      method: 'GET',
      mode: 'cors',
      signal: controller.signal,
    });
    clearTimeout(tid);
    if (res.ok) {
      resolvedOrigin = REMOTE_BACKEND;
      return resolvedOrigin;
    }
  } catch {
    /* Render uyuyorsa veya ağ yoksa yerel fallback */
  }
  resolvedOrigin = getLocalFallbackOrigin();
  return resolvedOrigin;
}

export function getBackendOrigin() {
  return resolvedOrigin;
}
