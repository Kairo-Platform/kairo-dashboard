import Color from "color";

// Returns true only for parseable CSS color strings we want to transform.
function isColorString(val: string): boolean {
  if (val === "transparent" || val === "inherit" || val === "currentColor") {
    return false;
  }
  const lower = val.toLowerCase().trim();
  const hasColorPrefix =
    lower.startsWith("#") || lower.startsWith("rgb") || lower.startsWith("hsl");
  if (!hasColorPrefix) return false;
  try {
    Color(val);
    return true;
  } catch {
    return false;
  }
}

// Invert HSL lightness with slight compression to keep contrast comfortable.
function transformColor(colorStr: string): string {
  try {
    const c = Color(colorStr);
    const invertedL = 100 - c.lightness();
    const newL = Math.max(5, Math.min(90, invertedL * 0.88 + 2));
    return c.lightness(newL).hex();
  } catch {
    return colorStr;
  }
}

function transformNode<T>(node: T): T {
  if (typeof node === "string") {
    return (isColorString(node) ? transformColor(node) : node) as unknown as T;
  }
  if (Array.isArray(node)) {
    return node.map(transformNode) as unknown as T;
  }
  if (typeof node === "object" && node !== null) {
    return Object.fromEntries(
      Object.entries(node as Record<string, unknown>).map(([k, v]) => [
        k,
        transformNode(v),
      ]),
    ) as unknown as T;
  }
  return node;
}

/**
 * Recursively inverts every color value in the supplied theme object.
 * Returns an object with the same shape – safe to pass directly to ThemeProvider.
 * Override critical colors (backgrounds, body text …) after calling this.
 */
export function createDarkTheme<T extends object>(lightTheme: T): T {
  return transformNode(lightTheme);
}
