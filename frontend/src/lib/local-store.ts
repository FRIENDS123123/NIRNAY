// Minimal external store backed by localStorage.
//
// Phase 4/5 introduces four independent persisted slices (active role, record
// verification, saved reports, settings). This factory gives each one the same
// subscribe/getSnapshot contract that useSyncExternalStore needs, so a write in
// one place re-renders every reader — including other browser tabs.

export interface LocalStore<T> {
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => T;
  getServerSnapshot: () => T;
  get: () => T;
  set: (value: T) => void;
  update: (updater: (current: T) => T) => void;
  reset: () => void;
}

export function createLocalStore<T>(
  key: string,
  fallback: T,
  /** Rejects malformed persisted data so a bad write can't break the app. */
  isValid: (value: unknown) => value is T,
): LocalStore<T> {
  const listeners = new Set<() => void>();
  let cache: T | null = null;

  function read(): T {
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return fallback;
      const parsed: unknown = JSON.parse(raw);
      return isValid(parsed) ? parsed : fallback;
    } catch {
      return fallback;
    }
  }

  function emit() {
    listeners.forEach((listener) => listener());
  }

  function getSnapshot(): T {
    if (cache === null) cache = read();
    return cache;
  }

  function set(value: T) {
    cache = value;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage unavailable — the in-memory snapshot still drives the UI.
    }
    emit();
  }

  if (typeof window !== "undefined") {
    window.addEventListener("storage", (event) => {
      if (event.key === key) {
        cache = null;
        emit();
      }
    });
  }

  return {
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    getSnapshot,
    getServerSnapshot: () => fallback,
    get: getSnapshot,
    set,
    update(updater) {
      set(updater(getSnapshot()));
    },
    reset() {
      try {
        window.localStorage.removeItem(key);
      } catch {
        // Nothing to do.
      }
      cache = null;
      emit();
    },
  };
}
