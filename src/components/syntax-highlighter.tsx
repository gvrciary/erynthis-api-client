import { memo, useEffect, useMemo } from "react";
import { useShikiStore } from "@/store/shikiStore";
import { cn } from "@/utils";
import { useTheme } from "@/providers/theme-provider";

interface SyntaxHighlighterProps {
  code: string;
  language: string;
  className?: string;
}

const SyntaxHighlighter = memo(
  ({ code, language = "text", className = "" }: SyntaxHighlighterProps) => {
    const { highlighter, isLoading, initHighlighter } = useShikiStore();
    const { isDarkMode } = useTheme();

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
      } catch {
        return `<pre><code>${code}</code></pre>`;
      }
    }, [code, language, highlighter, theme, isLoading]);

    const fallbackContent = useMemo(
      () => (
        <pre
          className={cn(
            "text-sm text-foreground whitespace-pre-wrap break-all p-4",
            className,
          )}
        >
          <code>{code}</code>
        </pre>
      ),
      [code, className],
    );

    if (isLoading) {
      return (
        <div className={cn("flex items-center justify-center p-4", className)}>
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }

    if (!highlightedCode || highlightedCode === code) {
      return fallbackContent;
    }

    return (
      <div
        className={cn("syntax-highlighter overflow-auto min-h-full", className)}
        dangerouslySetInnerHTML={{ __html: highlightedCode }}
      />
    );
  },
);

SyntaxHighlighter.displayName = "SyntaxHighlighter";

export default SyntaxHighlighter;
