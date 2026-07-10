"use client";

import { useState, useImperativeHandle, forwardRef } from "react";
import styled from "styled-components";
import { Button, ButtonClass } from "../../components/ui";
import { Icon } from "@iconify/react";

const CodeSnippetContainer = styled.div`
  .Editor {
    width: 100%;
    textarea {
      width: 100%;
      min-height: 12rem;
      padding: 1rem;
      font-family: "Source Code Pro", monospace;
      font-size: 0.9rem;
      border-radius: 0.75rem;
      border: 1px solid ${(p) => p.theme.colors.gray_03};
      background: ${(p) => p.theme.colors.gray_02};
      color: ${(p) => p.theme.colors.text_01};
      resize: vertical;
    }
  }

  .Actions {
    margin-top: 0.75rem;
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
  }

  .Extracted {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    max-height: 30rem;
    overflow: auto;
    .Block {
      padding: 0.75rem;
      border-radius: 0.75rem;
      display: flex;
      flex-direction: column;
      height: auto;
      pre {
        margin: 0;
        overflow: auto;
        flex: 1 1 auto;
        code {
          white-space: pre-wrap;
          word-break: break-word;
          display: block;
        }
      }
    }
    .Block:first-child {
      flex: 1 1 auto;
    }
  }
`;

type ExtractedData = {
  jsonBody?: any;
  jsonString?: string;
};

type CodeSnippetProps = {
  value?: string;
  onChange?: (code: string) => void;
  onExtract?: (data: ExtractedData) => void;
  placeholder?: string;
  /** mode: 'editor' (textarea), 'preview' (read-only), 'both' */
  mode?: "editor" | "preview" | "both";
  /** show action buttons when in editor mode (ignored for 'both') */
  showActionsInEditor?: boolean;
  /** when true, automatically run extract after paste in editor mode */
  autoExtractOnPaste?: boolean;
};

// Helper: find first balanced JSON structure (object or array) in text
function findFirstJson(text: string): string | null {
  const objStart = text.indexOf("{");
  const arrStart = text.indexOf("[");
  // Pick whichever appears first; -1 means not found
  let start: number;
  let open: string;
  let close: string;
  if (objStart === -1 && arrStart === -1) return null;
  if (arrStart === -1 || (objStart !== -1 && objStart < arrStart)) {
    start = objStart;
    open = "{";
    close = "}";
  } else {
    start = arrStart;
    open = "[";
    close = "]";
  }
  let depth = 0;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (ch === open) depth++;
    if (ch === close) depth--;
    if (depth === 0) {
      return text.slice(start, i + 1);
    }
  }
  return null;
}

const CodeSnippet = forwardRef(function CodeSnippet(
  {
    value = "",
    onChange,
    onExtract,
    placeholder,
    mode = "both",
    showActionsInEditor = true,
    autoExtractOnPaste = false,
  }: CodeSnippetProps,
  ref
) {
  const [code, setCode] = useState<string>(value);
  const [extracted, setExtracted] = useState<ExtractedData>({});

  useImperativeHandle(ref, () => ({
    getExtracted: () => extracted,
    getCode: () => code,
  }));

  const handleCodeChange = (v: string) => {
    setCode(v);
    if (typeof onChange === "function") onChange(v);
  };

  const runExtract = () => {
    return runExtractFromText(code);
  };

  const runExtractFromText = (text: string) => {
    const result: ExtractedData = {};
    const jsonText = findFirstJson(text);
    if (jsonText) {
      result.jsonString = jsonText;
      try {
        result.jsonBody = JSON.parse(jsonText);
      } catch (e) {
        try {
          result.jsonBody = JSON.parse(jsonText.replace(/'/g, '"'));
        } catch (e2) {
          result.jsonBody = undefined;
        }
      }
    }

    setExtracted(result);
    if (typeof onExtract === "function") onExtract(result);
    return result;
  };

  const handleClear = () => {
    setCode("");
    setExtracted({});
    if (typeof onChange === "function") onChange("");
    if (typeof onExtract === "function") onExtract({});
  };

  return (
    <CodeSnippetContainer>
      {(mode === "editor" || mode === "both") && (
        <div className="Editor">
          <textarea
            placeholder={placeholder || "Paste JSON code here..."}
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            onPaste={(e) => {
              if (!(mode === "editor" || mode === "both")) return;
              const pasted = e.clipboardData?.getData("text") || "";
              if (!pasted) return;
              // prevent the default browser paste so we can control insertion
              e.preventDefault();
              const target = e.currentTarget as HTMLTextAreaElement;
              const start = target.selectionStart || 0;
              const end = target.selectionEnd || 0;
              const before = code.substring(0, start);
              const after = code.substring(end);
              const newCode = before + pasted + after;
              // update value and notify parent
              setCode(newCode);
              if (typeof onChange === "function") onChange(newCode);
              // run extract on the composed text if requested
              if (autoExtractOnPaste) {
                setTimeout(() => {
                  runExtractFromText(newCode);
                }, 0);
              }
            }}
          />
        </div>
      )}

      {(mode === "both" || (mode === "editor" && showActionsInEditor)) && (
        <div className="Actions">
          <div>
            <Button
              classes={[ButtonClass.OUTLINED, ButtonClass.WITH_ICON]}
              onClick={runExtract}
            >
              <Icon icon="mdi:magnify" width={18} height={18} />
              <span>Extract</span>
            </Button>
          </div>
          <div>
            <Button
              classes={[ButtonClass.OUTLINED, ButtonClass.WITH_ICON]}
              onClick={handleClear}
            >
              <Icon icon="mdi:trash-can-outline" width={18} height={18} />
              <span>Clear</span>
            </Button>
          </div>
        </div>
      )}

      {(mode === "preview" || mode === "both") && (
        <div className="Extracted">
          <div className="Block">
            <pre>
              <code>{code}</code>
            </pre>
          </div>

          {extracted.jsonBody && (
            <div className="Block">
              <strong>JSON body</strong>
              <pre>
                <code>{JSON.stringify(extracted.jsonBody, null, 2)}</code>
              </pre>
            </div>
          )}

          {extracted.jsonString && (
            <div className="Block">
              <strong>Raw JSON string</strong>
              <pre>
                <code>{extracted.jsonString}</code>
              </pre>
            </div>
          )}
        </div>
      )}
    </CodeSnippetContainer>
  );
});

export default CodeSnippet;
