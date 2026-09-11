import type { MessageVariable } from "./types";

export function getVariableCompletion(
  message: string,
  start: number,
  end = start,
) {
  if (start !== end) return null;
  const match = /\{\{([^{}\n]*)$/.exec(message.slice(0, start));
  if (!match) return null;

  const suffix = /^[\w.-]*(?:\}\})?/.exec(message.slice(start))?.[0] ?? "";
  return {
    start: match.index,
    end: start + suffix.length,
    query: match[1].trim().toLowerCase(),
  };
}

export function matchMessageVariables(
  variables: MessageVariable[],
  query: string,
) {
  return variables.filter(
    ({ token, description }) =>
      token.toLowerCase().includes(query) ||
      description.toLowerCase().includes(query),
  );
}

export function completeMessageVariable(
  message: string,
  range: { start: number; end: number },
  token: string,
) {
  return {
    message: message.slice(0, range.start) + token + message.slice(range.end),
    cursor: range.start + token.length,
  };
}

export function splitMessagePlaceholders(message: string) {
  return message.split(/(\{\{[^{}\n]+\}\})/g).map((text) => ({
    text,
    placeholder: /^\{\{[^{}\n]+\}\}$/.test(text),
  }));
}
