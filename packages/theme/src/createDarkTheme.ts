import Color from "color";

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

export function createDarkTheme<T extends object>(lightTheme: T): T {
  return transformNode(lightTheme);
}
