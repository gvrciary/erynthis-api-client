import type React from "react";
import { memo, useEffect, useMemo } from "react";
import { useDarkMode } from "../hooks/ui/useDarkMode";
import { useShikiStore } from "../store/shikiStore";

interface SyntaxHighlighterProps {
  code: string;
  language: string;
  className?: string;
}

const SyntaxHighlighter: React.FC<SyntaxHighlighterProps> = memo(
  ({ code, language = "text", className = "" }) => {
    const { highlighter, isLoading, initHighlighter } = useShikiStore();
    const { isDarkMode } = useDarkMode();

    useEffect(() => {
      initHighlighter();
    }, [initHighlighter]);

    const theme = useMemo(() => {
      return isDarkMode ? "github-dark" : "github-light";
    }, [isDarkMode]);

    const highlightedCode = useMemo(() => {
      if (isLoading || !highlighter || !code.trim()) {
        return code;
      }

      try {
        return highlighter.codeToHtml(code, {
          lang: language,
          theme: theme,
        });
      } catch (error) {
        console.warn("Failed to highlight code:", error);
        return `<pre><code>${code}</code></pre>`;
      }
    }, [code, language, highlighter, theme, isLoading]);

    const fallbackContent = useMemo(
      () => (
        <pre
          className={`text-sm text-foreground whitespace-pre-wrap break-all p-4 ${className}`}
        >
          <code>{code}</code>
        </pre>
      ),
      [code, className],
    );

    if (isLoading) {
      return (
        <div className={`flex items-center justify-center p-4 ${className}`}>
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }

    if (!highlightedCode || highlightedCode === code) {
      return fallbackContent;
    }

    return (
      <div
        className={`syntax-highlighter overflow-auto min-h-full ${className}`}
        dangerouslySetInnerHTML={{ __html: highlightedCode }}
      />
    );
  },
);

SyntaxHighlighter.displayName = "SyntaxHighlighter";

export default SyntaxHighlighter;
