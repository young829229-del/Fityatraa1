export function formatImageUrl(url: string | undefined | null, timestamp?: number | string): string {
  if (!url) return "";
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("data:")) return trimmed;

  const v = timestamp || Date.now();
  try {
    if (trimmed.includes("?")) {
      if (trimmed.includes("v=")) {
        return trimmed.replace(/v=[^&]+/, `v=${v}`);
      }
      return `${trimmed}&v=${v}`;
    }
    return `${trimmed}?v=${v}`;
  } catch {
    return trimmed;
  }
}
