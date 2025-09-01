import { X } from "lucide-react";
import { memo, useCallback, useEffect, useRef } from "react";
import { cn } from "@/utils";
import Tooltip from "./tooltip";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

const Modal = memo(
  ({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = "md",
    closeOnBackdrop = true,
    closeOnEscape = true,
    showCloseButton = true,
    className = "",
  }: ModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const backdropRef = useRef<HTMLDivElement>(null);

    const handleKeyDown = useCallback(
      (e: KeyboardEvent) => {
        if (e.key === "Escape" && closeOnEscape) {
          e.preventDefault();
          onClose();
        }
      },
      [closeOnEscape, onClose],
    );

    useEffect(() => {
      if (isOpen) {
        const handleDocumentClick = (e: MouseEvent) => {
          if (
            backdropRef.current &&
            e.target === backdropRef.current &&
            closeOnBackdrop
          ) {
            onClose();
          }
        };

        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("mousedown", handleDocumentClick);
        document.body.style.overflow = "hidden";

        return () => {
          document.removeEventListener("keydown", handleKeyDown);
          document.removeEventListener("mousedown", handleDocumentClick);
          document.body.style.overflow = "";
        };
      }
    }, [isOpen, handleKeyDown, closeOnBackdrop, onClose]);

    const getSizeClasses = () => {
      switch (size) {
        case "sm":
          return "w-80 max-w-sm";
        case "md":
          return "w-96 max-w-md";
        case "lg":
          return "w-128 max-w-lg";
        case "xl":
          return "w-160 max-w-xl";
        default:
          return "w-96 max-w-md";
      }
    };

    if (!isOpen) return null;

    return (
      <div
        ref={backdropRef}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <section
          ref={modalRef}
          className={cn(
            "bg-card rounded-lg border border-border shadow-lg mx-4",
            getSizeClasses(),
            className,
          )}
        >
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            {showCloseButton && (
              <Tooltip content="Close" side="bottom">
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </Tooltip>
            )}
          </div>

          <div className="p-6">{children}</div>

          {footer && (
            <div className="flex justify-end items-center space-x-3 p-6 border-t border-border bg-muted/50">
              {footer}
            </div>
          )}
        </section>
      </div>
    );
  },
);

Modal.displayName = "Modal";

export default Modal;
