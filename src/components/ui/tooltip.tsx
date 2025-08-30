import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
}

const Tooltip = ({ content, children, side = "top" }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const padding = 8;
    let x = 0;
    let y = 0;

    switch (side) {
      case "top":
        x = rect.left + rect.width / 2;
        y = rect.top - padding;
        break;
      case "bottom":
        x = rect.left + rect.width / 2;
        y = rect.bottom + padding;
        break;
      case "left":
        x = rect.left - padding;
        y = rect.top + rect.height / 2;
        break;
      case "right":
        x = rect.right + padding;
        y = rect.top + rect.height / 2;
        break;
    }

    setPosition({ x, y });
  }, [side]);

  const showTooltip = useCallback(() => {
    setIsVisible(true);
    calculatePosition();
  }, [calculatePosition]);

  const hideTooltip = useCallback(() => {
    setIsVisible(false);
  }, []);

  useEffect(() => {
    if (isVisible) {
      const handleScroll = () => hideTooltip();
      const handleResize = () => hideTooltip();

      window.addEventListener("scroll", handleScroll, true);
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("scroll", handleScroll, true);
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [isVisible, hideTooltip]);

  const getTransformStyles = () => {
    switch (side) {
      case "top":
        return "transform -translate-x-1/2 -translate-y-full";
      case "bottom":
        return "transform -translate-x-1/2";
      case "left":
        return "transform -translate-x-full -translate-y-1/2";
      case "right":
        return "transform -translate-y-1/2";
      default:
        return "transform -translate-x-1/2 -translate-y-full";
    }
  };

  return (
    <>
      <div
        ref={triggerRef}
        className="inline-block"
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
      >
        {children}
      </div>
      {typeof document !== "undefined" &&
        isVisible &&
        createPortal(
          <div
            id="tooltip-content"
            role="tooltip"
            className={`fixed z-[9999] px-2 py-1 text-xs text-foreground bg-card border border-border rounded whitespace-nowrap shadow-lg pointer-events-none ${getTransformStyles()}`}
            style={{
              left: `${position.x}px`,
              top: `${position.y}px`,
            }}
          >
            {content}
          </div>,
          document.body,
        )}
    </>
  );
};

export default Tooltip;
