import { useCallback, useEffect, useRef } from "react";
import { cn } from "@/utils";

export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  disabled?: boolean;
  separator?: boolean;
}

export interface ContextMenuProps {
  isOpen: boolean;
  position: { x: number; y: number };
  items: ContextMenuItem[];
  onClose: () => void;
  className?: string;
  minWidth?: number;
}

const ContextMenu = ({
  isOpen,
  position,
  items,
  onClose,
  className,
  minWidth = 128,
}: ContextMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    },
    [onClose],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, handleClickOutside, handleKeyDown]);

  const handleItemClick = useCallback(
    (item: ContextMenuItem) => {
      if (!item.disabled) {
        item.onClick();
        onClose();
      }
    },
    [onClose],
  );

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className={cn(
        "fixed z-50 bg-card border border-border rounded-md shadow-lg py-1 animate-in fade-in-0 zoom-in-95",
        className,
      )}
      style={{
        left: position.x,
        top: position.y,
        minWidth,
      }}
      role="menu"
      aria-label="Context menu"
    >
      {items.map((item, index) => (
        <div key={item.id}>
          {item.separator && index > 0 && (
            <div className="border-t border-border my-1" />
          )}
          <button
            type="button"
            onClick={() => handleItemClick(item)}
            disabled={item.disabled}
            className={cn(
              "w-full px-3 py-2 text-left flex items-center space-x-2 text-sm transition-colors",
              item.disabled
                ? "text-muted-foreground cursor-not-allowed opacity-50"
                : "hover:bg-muted hover:text-foreground hover:shadow-sm hover:bg-zinc-300/50 dark:hover:bg-zinc-600/50",
            )}
          >
            {item.icon && (
              <item.icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            )}
            <span>{item.label}</span>
          </button>
        </div>
      ))}
    </div>
  );
};

export default ContextMenu;
