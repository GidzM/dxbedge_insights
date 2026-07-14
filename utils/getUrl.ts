export const getFullUrl = (path?: string): string => {
  if (typeof window !== "undefined") {
    const origin = window.location.origin;
    return path ? `${origin}${path}` : origin;
  }

  // SSR fallback (not used in Vite, but safe)
  return path || "";
};
