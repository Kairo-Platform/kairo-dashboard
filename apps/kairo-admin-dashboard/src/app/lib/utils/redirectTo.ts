type ServerResLike = {
  writeHead?: (status: number, headers: Record<string, string>) => void;
  end?: () => void;
};

export function redirectTo(
  destination: string,
  { res, status }: { res?: ServerResLike | null; status?: number } = {},
): void {
  if (!destination || typeof destination !== "string") return;

  if (res) {
    try {
      res.writeHead?.(status ?? 302, { Location: destination });
      res.end?.();
    } catch (e) {
      if (typeof window !== "undefined") {
        window.location.href = destination;
      }
    }
  } else if (destination[0] === "/" && destination[1] !== "/") {
    if (typeof window !== "undefined") {
      window.location.assign(destination);
    }
  } else if (typeof window !== "undefined") {
    // external URL
    window.location.href = destination;
  }
}

export default redirectTo;
