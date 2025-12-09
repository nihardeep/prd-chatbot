const SESSION_KEY = 'travelmate_search_session';
export const SESSION_DURATION_MS = 20 * 60 * 1000; // 20 minutes

const hasStorage = () =>
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const safelyParse = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export const getStoredSession = () => {
  if (!hasStorage()) return null;
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  const parsed = safelyParse(raw);
  if (!parsed || !parsed.id || !parsed.createdAt) return null;
  return parsed;
};

export const isSessionValid = (session) => {
  if (!session || !session.createdAt) return false;
  return Date.now() - session.createdAt < SESSION_DURATION_MS;
};

export const clearSearchSession = () => {
  if (!hasStorage()) return;
  window.localStorage.removeItem(SESSION_KEY);
};

export const createSearchSession = () => {
  if (!hasStorage()) {
    return {
      id: `session_${Date.now()}`,
      createdAt: Date.now(),
    };
  }
  const session = {
    id: `session_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    createdAt: Date.now(),
  };
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
};

export const getOrCreateSearchSession = () => {
  const existing = getStoredSession();
  if (existing && isSessionValid(existing)) {
    return existing;
  }
  return createSearchSession();
};

export const enforceSessionValidityOrRefresh = () => {
  const session = getStoredSession();
  if (session && !isSessionValid(session)) {
    clearSearchSession();
    window.location.reload();
  }
};


