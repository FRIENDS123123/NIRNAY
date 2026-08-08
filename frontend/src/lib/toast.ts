import { useSyncExternalStore } from "react";

export type ToastTone = "success" | "info" | "danger";

export interface Toast {
  id: string;
  title: string;
  description?: string;
  tone: ToastTone;
}

const DURATION_MS = 3600;

let toasts: Toast[] = [];
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const getSnapshot = () => toasts;
const getServerSnapshot = () => toasts;

export function useToasts(): Toast[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function dismissToast(id: string) {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}

/** Fires a transient confirmation. Safe to call from anywhere, no context needed. */
export function toast(input: { title: string; description?: string; tone?: ToastTone }) {
  const entry: Toast = {
    id: `TOAST-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    title: input.title,
    description: input.description,
    tone: input.tone ?? "success",
  };
  toasts = [entry, ...toasts].slice(0, 3);
  emit();
  setTimeout(() => dismissToast(entry.id), DURATION_MS);
}
