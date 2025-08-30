import { X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import EnvironmentModal from "@/components/environments/environment-modal";
import type { ContextMenuItem } from "@/components/ui/context-menu";
import ContextMenu from "@/components/ui/context-menu";
import { useContextMenu } from "@/hooks/ui/use-context-menu";
import { useHttpStore } from "@/store/http-store";
import type { ItemsType } from "@/types/data";
import { cn } from "@/utils";
import FolderItem from "./folder-item";
import RequestItem from "./request-item";
import SidebarHeader from "./sidebar-header";

interface SidebarProps {
  visible: boolean;
  onMouseLeave: () => void;
  className?: string;
}

const Sidebar = ({ visible, onMouseLeave, className }: SidebarProps) => {
  const {
    requests,
    folders,
    activeRequestId,
    createRequest,
    deleteRequest,
    setActiveRequest,
    createFolder,
    deleteFolder,
    toggleFolder,
    updateNameToFolder,
    addRequestToFolder,
    removeRequestFromFolder,
  } = useHttpStore();

  const [draggedItem, setDraggedItem] = useState<{
    type: ItemsType;
    id: string;
  } | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [folderNameError, setFolderNameError] = useState("");
  const [showEnvironmentModal, setShowEnvironmentModal] = useState(false);

  const modalInputRef = useRef<HTMLInputElement>(null);
  const { contextMenu, handleContextMenu, closeContextMenu } = useContextMenu();

  const unorganizedRequests = requests.filter(
    (req) => !folders.some((folder) => folder.requests.includes(req.id)),
  );

  useEffect(() => {
    if (showFolderModal && modalInputRef.current) {
      modalInputRef.current.focus();
    }
  }, [showFolderModal]);

  const handleCreateRequest = useCallback(() => {
    createRequest();
  }, [createRequest]);

  const handleOpenFolderModal = useCallback(() => {
    setShowFolderModal(true);
    setFolderName("");
    setFolderNameError("");
  }, []);

  const handleCreateFolder = useCallback(() => {
    const trimmedName = folderName.trim();

    if (!trimmedName) {
      setFolderNameError("Folder name is required");
      return;
    }

    if (
      folders.some(
        (folder) => folder.name.toLowerCase() === trimmedName.toLowerCase(),
      )
    ) {
      setFolderNameError("A folder with this name already exists");
      return;
    }

    createFolder(trimmedName);
    setShowFolderModal(false);
    setFolderName("");
    setFolderNameError("");
  }, [folderName, folders, createFolder]);

  const handleCloseFolderModal = useCallback(() => {
    setShowFolderModal(false);
    setFolderName("");
    setFolderNameError("");
  }, []);

  const handleDeleteRequest = useCallback(
    (requestId: string) => {
      deleteRequest(requestId);
    },
    [deleteRequest],
  );

  const handleDeleteFolder = useCallback(
    (folderId: string) => {
      deleteFolder(folderId);
    },
    [deleteFolder],
  );

  const handleEditFolder = useCallback(
    (folderId: string, newName: string) => {
      updateNameToFolder(folderId, newName);
    },
    [updateNameToFolder],
  );

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleCreateFolder();
      } else if (e.key === "Escape") {
        handleCloseFolderModal();
      }
    },
    [handleCreateFolder, handleCloseFolderModal],
  );

  const handleDragStart = useCallback(
    (e: React.DragEvent, type: ItemsType, id: string) => {
      e.stopPropagation();

      setDraggedItem({ type, id });

      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", id);
      e.dataTransfer.setData("application/x-item-type", type);

      const element = e.currentTarget as HTMLElement;
      element.style.opacity = "0.5";
      element.style.transform = "rotate(2deg)";
    },
    [],
  );

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    e.stopPropagation();

    const element = e.currentTarget as HTMLElement;
    element.style.opacity = "1";
    element.style.transform = "none";

    setDraggedItem(null);
    setDragOverItem(null);
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent, targetId: string) => {
      e.preventDefault();
      e.stopPropagation();

      if (
        draggedItem &&
        draggedItem.type === "request" &&
        draggedItem.id !== targetId
      ) {
        e.dataTransfer.dropEffect = "move";
        setDragOverItem(targetId);
      }
    },
    [draggedItem],
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragOverItem(null);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, targetFolderId: string) => {
      e.preventDefault();
      e.stopPropagation();

      const draggedId = e.dataTransfer.getData("text/plain");
      const draggedType = e.dataTransfer.getData("application/x-item-type");

      setDragOverItem(null);

      if (
        !draggedId ||
        draggedType !== "request" ||
        draggedId === targetFolderId
      ) {
        return;
      }

      addRequestToFolder(draggedId, targetFolderId);
      setDraggedItem(null);
    },
    [addRequestToFolder],
  );

  const handleDropOutsideFolder = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const draggedId = e.dataTransfer.getData("text/plain");
      const draggedType = e.dataTransfer.getData("application/x-item-type");

      if (!draggedId || draggedType !== "request") {
        return;
      }

      folders.forEach((folder) => {
        if (folder.requests.includes(draggedId)) {
          removeRequestFromFolder(draggedId, folder.id);
        }
      });

      setDraggedItem(null);
      setDragOverItem(null);
    },
    [folders, removeRequestFromFolder],
  );

  const hasOpenModals =
    showEnvironmentModal || showFolderModal || contextMenu.isOpen;

  const handleMouseLeave = useCallback(
    (_e: React.MouseEvent) => {
      if (hasOpenModals) {
        return;
      }
      onMouseLeave();
    },
    [hasOpenModals, onMouseLeave],
  );

  const contextMenuItems: ContextMenuItem[] = [
    {
      id: "request",
      label: "HTTP Request",
      onClick: handleCreateRequest,
    },
    {
      id: "folder",
      label: "Folder",
      onClick: handleOpenFolderModal,
      separator: true,
    },
  ];

  if (!visible) return null;

  return (
    <>
      <nav
        className={cn(
          "w-80 h-full bg-card border-r border-border shadow-sm flex flex-col",
          className,
        )}
        onMouseLeave={handleMouseLeave}
        onContextMenu={handleContextMenu}
        style={{ transition: "transform 300ms cubic-bezier(0.4, 0, 0.2, 1)" }}
        aria-label="Sidebar navigation"
      >
        <SidebarHeader
          onOpenEnvironmentModal={() => setShowEnvironmentModal(true)}
          onCreateRequest={handleCreateRequest}
          onOpenFolderModal={handleOpenFolderModal}
        />

        <section
          className="flex-1 overflow-y-auto p-2 min-h-0"
          onDragOver={(e) => {
            e.preventDefault();
            if (draggedItem && draggedItem.type === "request") {
              e.dataTransfer.dropEffect = "move";
            }
          }}
          onDrop={handleDropOutsideFolder}
          aria-label="Requests and folders list"
        >
          {requests.length > 0 || folders.length > 0 ? (
            <div className="space-y-2">
              {folders.map((folder) => (
                <FolderItem
                  key={folder.id}
                  folder={folder}
                  requests={requests}
                  activeRequestId={activeRequestId}
                  draggedItem={draggedItem}
                  dragOverItem={dragOverItem}
                  onToggle={toggleFolder}
                  onEdit={handleEditFolder}
                  onDelete={handleDeleteFolder}
                  onSelectRequest={setActiveRequest}
                  onDeleteRequest={handleDeleteRequest}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                />
              ))}

              {unorganizedRequests.length > 0 && (
                <div className="space-y-1">
                  {unorganizedRequests.map((request) => (
                    <RequestItem
                      key={request.id}
                      request={request}
                      isActive={activeRequestId === request.id}
                      isDragged={draggedItem?.id === request.id}
                      onSelect={setActiveRequest}
                      onDelete={handleDeleteRequest}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8">
              <div className="text-center">
                <p className="text-lg mb-2">No requests yet</p>
                <p className="text-sm mb-4">
                  Create your first HTTP request or folder
                </p>
                <button
                  type="button"
                  onClick={handleCreateRequest}
                  className="px-4 py-2 btn-primary rounded-md text-sm hover:opacity-90"
                >
                  Create Request
                </button>
              </div>
            </div>
          )}
        </section>
      </nav>

      <ContextMenu
        isOpen={contextMenu.isOpen}
        position={contextMenu.position}
        items={contextMenuItems}
        onClose={closeContextMenu}
        minWidth={150}
      />

      {showFolderModal && (
        <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in-0">
          <div className="bg-card rounded-lg p-6 w-96 max-w-md mx-4 animate-in zoom-in-95 slide-in-from-bottom-4 border border-border shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                New Folder
              </h3>
              <button
                type="button"
                onClick={handleCloseFolderModal}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4">
              <label
                htmlFor="folder-name"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Folder name
              </label>
              <input
                id="folder-name"
                ref={modalInputRef}
                type="text"
                value={folderName}
                onChange={(e) => {
                  setFolderName(e.target.value);
                  if (folderNameError) setFolderNameError("");
                }}
                onKeyDown={handleKeyPress}
                placeholder="Enter folder name"
                className={cn(
                  "w-full px-3 py-2 border rounded-md focus-ring input",
                  folderNameError ? "border-red-500" : "border-border",
                )}
              />
              {folderNameError && (
                <p className="mt-1 text-sm text-red-600">{folderNameError}</p>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCloseFolderModal}
                className="px-4 py-2 text-sm font-medium text-muted-foreground btn-secondary rounded-md"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateFolder}
                disabled={!folderName.trim()}
                className="px-4 py-2 text-sm font-medium btn-primary disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
              >
                Create Folder
              </button>
            </div>
          </div>
        </div>
      )}

      <EnvironmentModal
        isOpen={showEnvironmentModal}
        onClose={() => setShowEnvironmentModal(false)}
      />
    </>
  );
};

export default Sidebar;
