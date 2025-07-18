import { Check, Copy } from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useMemo, useState, memo } from "react";
import { copyToClipboard } from "../utils";

interface CopyButtonProps {
  content: string;
  title?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "ghost";
}

const CopyButton: React.FC<CopyButtonProps> = memo(
  ({
    content,
    title = "Copy",
    className = "",
    size = "md",
    variant = "default",
  }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = useCallback(async () => {
      try {
        await copyToClipboard(content);
        setIsCopied(true);
      } catch (error) {
        console.error("Failed to copy:", error);
      }
    }, [content]);

    useEffect(() => {
      if (isCopied) {
        const timer = setTimeout(() => {
          setIsCopied(false);
        }, 2000);
        return () => clearTimeout(timer);
      }
    }, [isCopied]);

    const getSizeClasses = useMemo(() => {
      switch (size) {
        case "sm":
          return "w-3 h-3";
        case "md":
          return "w-4 h-4";
        case "lg":
          return "w-5 h-5";
        default:
          return "w-4 h-4";
      }
    }, [size]);

    const getButtonClasses = useMemo(() => {
      const baseClasses =
        "p-1 rounded-md transition-all duration-200 flex items-center justify-center";
      const sizeClasses = size === "sm" ? "p-0.5" : "p-1";

      if (variant === "ghost") {
        return `${baseClasses} ${sizeClasses} hover:bg-muted text-muted-foreground hover:text-foreground`;
      }

      return `${baseClasses} ${sizeClasses} hover:bg-muted text-muted-foreground hover:text-foreground`;
    }, [size, variant]);

    const buttonTitle = useMemo(
      () => (isCopied ? "Copied!" : title),
      [isCopied, title],
    );

    return (
      <button
        type="button"
        onClick={handleCopy}
        className={`${getButtonClasses} ${className}`}
        title={buttonTitle}
        disabled={isCopied}
      >
        <div className="relative">
          <Copy
            className={`${getSizeClasses} transition-all duration-200 ${
              isCopied ? "scale-0 opacity-0" : "scale-100 opacity-100"
            }`}
          />
          <Check
            className={`${getSizeClasses} absolute inset-0 transition-all duration-200 text-green-500 ${
              isCopied ? "scale-100 opacity-100" : "scale-0 opacity-0"
            }`}
          />
        </div>
      </button>
    );
  },
);

CopyButton.displayName = "CopyButton";

export default CopyButton;
