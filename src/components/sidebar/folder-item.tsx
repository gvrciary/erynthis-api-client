import {
  Check,
  ChevronDown,
  ChevronRight,
  Edit2,
  Folder,
  Trash2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import Input from "@/components/ui/input";
import type {
  FolderItem as FolderItemType,
  ItemsType,
  RequestItem as RequestItemType,
} from "@/types/data";
import { cn } from "@/utils";
import Tooltip from "@/components/ui/tooltip";
import RequestItem from "./request-item";

interface FolderItemProps {
  folder: FolderItemType;
  requests: RequestItemType[];
  activeRequestId: string | null;
  draggedItem: { type: ItemsType; id: string } | null;
  dragOverItem: string | null;
  onToggle: (folderId: string) => void;
  onEdit: (folderId: string, newName: string) => void;
  onDelete: (folderId: string) => void;
  onSelectRequest: (requestId: string) => void;
  onDeleteRequest: (requestId: string) => void;
  onDragStart: (e: React.MouseEvent, type: ItemsType, id: string) => void;
  onDragOver: (targetId: string) => void;
  onDragLeave: () => void;
}

const FolderItem = ({
  folder,
  requests,
  activeRequestId,
  draggedItem,
  dragOverItem,
  onToggle,
  onEdit,
  onDelete,
  onSelectRequest,
  onDeleteRequest,
  onDragStart,
  onDragOver,
  onDragLeave,
}: FolderItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingName, setEditingName] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);

  const folderRequests = requests.filter((req) =>
    folder.requests.includes(req.id),
  );

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [isEditing]);

  const handleToggle = useCallback(() => {
    if (!isEditing) {
      onToggle(folder.id);
    }
  }, [onToggle, folder.id, isEditing]);

  const handleStartEdit = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsEditing(true);
      setEditingName(folder.name);
    },
    [folder.name],
  );

  const handleSaveEdit = useCallback(() => {
    const trimmedName = editingName.trim();
    if (trimmedName && trimmedName !== folder.name) {
      onEdit(folder.id, trimmedName);
    }
    setIsEditing(false);
    setEditingName("");
  }, [editingName, folder.name, folder.id, onEdit]);

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    setEditingName("");
  }, []);

  const handleEditKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleSaveEdit();
      } else if (e.key === "Escape") {
        handleCancelEdit();
      }
    },
    [handleSaveEdit, handleCancelEdit],
  );

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onDelete(folder.id);
    },
    [onDelete, folder.id],
  );

  const handleDragOver = useCallback(() => {
    onDragOver(folder.id);
  }, [onDragOver, folder.id]);

  const handleEditInputClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  const handleEditBlur = useCallback(() => {
    handleSaveEdit();
  }, [handleSaveEdit]);

  return (
    <div className="mb-2 relative">
      {draggedItem?.type === "request" && (
        <div
          className={cn(
            "absolute inset-0 z-10 rounded-lg",
            dragOverItem === folder.id &&
              "bg-accent/50 border-2 border-primary border-dashed",
          )}
          data-drop-zone="true"
          data-folder-id={folder.id}
          onMouseEnter={handleDragOver}
          onMouseLeave={onDragLeave}
          aria-hidden="true"
        />
      )}

      <div className="group relative flex items-center space-x-2 p-2 rounded-lg hover:bg-muted transition-all duration-150">
        <button
          type="button"
          className="p-1 hover:bg-accent rounded transition-colors duration-150"
          onClick={handleToggle}
          aria-label={`${folder.expanded ? "Collapse" : "Expand"} folder: ${folder.name}`}
          aria-expanded={folder.expanded}
        >
          {folder.expanded ? (
            <ChevronDown className="h-3 w-3 transition-transform duration-150" />
          ) : (
            <ChevronRight className="h-3 w-3 transition-transform duration-150" />
          )}
        </button>

        <Folder className="h-4 w-4 text-muted-foreground flex-shrink-0" />

        {isEditing ? (
          <div className="flex items-center space-x-2 flex-1">
            <Input
              ref={editInputRef}
              type="text"
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              onKeyDown={handleEditKeyDown}
              onBlur={handleEditBlur}
              onClick={handleEditInputClick}
              className="flex-1 text-sm font-medium bg-transparent border-b border-border focus:border-primary outline-none transition-colors duration-150"
              variant="transparent"
              size="sm"
              aria-label="Edit folder name"
            />
            <Tooltip content="Save">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSaveEdit();
                }}
                className="p-1 rounded-md hover:bg-green-100 dark:hover:bg-green-900/30 text-muted-foreground hover:text-green-600 dark:hover:text-green-400 transition-colors duration-150"
                title="Save changes"
                aria-label="Save folder name"
              >
                <Check className="h-3 w-3" />
              </button>
            </Tooltip>
            <Tooltip content="Cancel">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancelEdit();
                }}
                className="p-1 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 text-muted-foreground hover:text-red-600 dark:hover:text-red-400 transition-colors duration-150"
                title="Cancel editing"
                aria-label="Cancel editing"
              >
                <X className="h-3 w-3" />
              </button>
            </Tooltip>
          </div>
        ) : (
          <>
            <button
              type="button"
              className="flex items-center space-x-2 flex-1 min-w-0 cursor-pointer text-left bg-transparent border-none outline-none"
              onClick={handleToggle}
              aria-label={`${folder.expanded ? "Collapse" : "Expand"} folder: ${folder.name}`}
            >
              <span
                className="text-sm font-medium truncate"
                title={folder.name}
              >
                {folder.name}
              </span>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {folder.requests.length}
              </span>
            </button>

            <Tooltip content="Edit">
              <button
                type="button"
                onClick={handleStartEdit}
                className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30 text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-150"
                title="Edit folder name"
                aria-label="Edit folder name"
              >
                <Edit2 className="h-3 w-3" />
              </button>
            </Tooltip>
            <Tooltip content="Delete">
              <button
                type="button"
                onClick={handleDelete}
                className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 text-muted-foreground hover:text-red-600 dark:hover:text-red-400 transition-all duration-150"
                title="Delete folder"
                aria-label="Delete folder"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </Tooltip>
          </>
        )}
      </div>

      {folder.expanded && folderRequests.length > 0 && (
        <div className="ml-6 space-y-1 mt-1">
          {folderRequests.map((request) => (
            <RequestItem
              key={request.id}
              request={request}
              isActive={activeRequestId === request.id}
              isDragged={draggedItem?.id === request.id}
              onSelect={onSelectRequest}
              onDelete={onDeleteRequest}
              onDragStart={onDragStart}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FolderItem;
