import { GripVertical, Trash2 } from "lucide-react";
import { useCallback, useState } from "react";
import type { ItemsType, RequestItem as RequestItemType } from "@/types/data";
import { cn, getMethodColor } from "@/utils";

interface RequestItemProps {
  request: RequestItemType;
  isActive: boolean;
  isDragged: boolean;
  onSelect: (requestId: string) => void;
  onDelete: (requestId: string) => void;
  onDragStart: (
    e: React.DragEvent,
    type: ItemsType,
    id: string,
  ) => void;
  onDragEnd: (e: React.DragEvent) => void;
}

const RequestItem = ({
  request,
  isActive,
  isDragged,
  onSelect,
  onDelete,
  onDragStart,
  onDragEnd,
}: RequestItemProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = useCallback(() => {
    onSelect(request.id);
  }, [onSelect, request.id]);

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onDelete(request.id);
    },
    [onDelete, request.id],
  );

  const handleDragStart = useCallback(
    (e: React.DragEvent) => {
      onDragStart(e, "request", request.id);
    },
    [onDragStart, request.id],
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const displayText = request.request.url.trim()
    ? request.request.url
    : request.name || "Untitled Request";

  return (
    <button
      type="button"
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "group relative w-full p-3 rounded-lg cursor-pointer text-left",
        isActive
          ? "bg-accent text-accent-foreground border border-border shadow-sm"
          : "hover:bg-muted text-muted-foreground hover:text-foreground",
        isDragged && "opacity-50 transform rotate-1",
      )}
      aria-label={`Select request: ${displayText}`}
    >
      <div className="flex items-center space-x-2">
        <GripVertical className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing transition-opacity duration-150" />

        <span
          className={cn(
            "text-xs px-2 py-1 rounded font-medium border",
            getMethodColor(request.request.method),
          )}
        >
          {request.request.method}
        </span>

        <span className="text-sm truncate flex-1 min-w-0" title={displayText}>
          {displayText}
        </span>

        {isHovered && (
          <button
            type="button"
            onClick={handleDelete}
            className="p-1 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 text-muted-foreground hover:text-red-600 dark:hover:text-red-400 transition-colors duration-150 opacity-0 group-hover:opacity-100"
            title="Delete request"
            aria-label={`Delete request: ${displayText}`}
          >
            <Trash2 className="h-3 w-3" />
          </button>
        )}
      </div>
    </button>
  );
};

export default RequestItem;
