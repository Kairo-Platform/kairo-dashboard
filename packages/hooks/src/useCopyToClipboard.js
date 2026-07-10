import { useState } from "react";

export const useCopyToClipboard = () => {
  const [copiedText, setCopiedText] = useState(null);

  const copy = async (text) => {
    if (!navigator?.clipboard) {
      console.warn("Clipboard not supported");
      return new Error("Clipboard not supported");
    }

    // Try to save to clipboard then save it in the state if worked
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      return text;
    } catch (error) {
      console.warn("Copy failed", error);
      setCopiedText(null);
      return error;
    }
  };

  return [copy, copiedText];
};

export default useCopyToClipboard;
