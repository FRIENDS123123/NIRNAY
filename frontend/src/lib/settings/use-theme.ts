import { useEffect } from "react";
import { useSettings, type ThemePreference } from "./store";

function resolve(preference: ThemePreference): "light" | "dark" {
  if (preference !== "system") return preference;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/**
 * Applies the theme by stamping `data-theme` on <html>. The entire design
 * system is token-based, so the dark palette is a token swap in index.css —
 * no component needs to know which theme is active.
 */
export function useThemeEffect() {
  const { theme } = useSettings();

  useEffect(() => {
    const apply = () => {
      document.documentElement.dataset.theme = resolve(theme);
    };
    apply();

    if (theme !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [theme]);
}
