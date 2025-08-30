import {
  Check,
  ChevronDown,
  ChevronRight,
  Edit2,
  Folder,
  Globe,
  GripVertical,
  Moon,
  Plus,
  Settings,
  Sun,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import EnvironmentModal from "@/components/environments/environment-modal";
import { useEnvironments } from "@/hooks/data/useEnvironments";
import { useTheme } from "@/providers/theme-provider";
import { useHttpStore } from "@/store/http-store";
import type { DropdownOption } from "@/types/data";
import { cn, getMethodColor } from "@/utils";
import Dropdown from "./drop-down";

interface SidebarProps {
  visible: boolean;
  onMouseLeave: () => void;
  className?: string;
}

const Sidebar = ({ visible, onMouseLeave, className }: SidebarProps) => {
  const { toggleTheme, isDarkMode } = useTheme();
  const {
    environments,
    activeEnvironmentId,
    activeEnvironment,
    setActiveEnvironment,
  } = useEnvironments();
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
    type: "request" | "folder";
    id: string;
  } | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [folderNameError, setFolderNameError] = useState("");
  const [showContextMenu, setShowContextMenu] = useState<{
    x: number;
    y: number;
    show: boolean;
  }>({ x: 0, y: 0, show: false });
  const [hoveredRequest, setHoveredRequest] = useState<string | null>(null);
  const [showEnvironmentModal, setShowEnvironmentModal] = useState(false);
  const [editingFolder, setEditingFolder] = useState<string | null>(null);
  const [editingFolderName, setEditingFolderName] = useState("");

  const modalInputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  const unorganizedRequests = requests.filter(
    (req) => !folders.some((folder) => folder.requests.includes(req.id)),
  );

  useEffect(() => {
    if (showFolderModal && modalInputRef.current) {
      modalInputRef.current.focus();
    }
  }, [showFolderModal]);

  useEffect(() => {
    const handleClickOutside = (_e: MouseEvent) => {
      if (showContextMenu.show) {
        setShowContextMenu({ x: 0, y: 0, show: false });
      }
    };

    if (showContextMenu.show) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showContextMenu.show]);

  const handleCreateRequest = () => {
    createRequest();
  };

  const handleOpenFolderModal = () => {
    setShowFolderModal(true);
    setFolderName("");
    setFolderNameError("");
  };

  const handleCreateFolder = () => {
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
  };

  const handleCloseFolderModal = () => {
    setShowFolderModal(false);
    setFolderName("");
    setFolderNameError("");
  };

  const handleDeleteRequest = (requestId: string) => {
    deleteRequest(requestId);
  };

  const handleDeleteFolder = (folderId: string) => {
    deleteFolder(folderId);
  };

  const handleEditFolder = (folderId: string, currentName: string) => {
    setEditingFolder(folderId);
    setEditingFolderName(currentName);
    setTimeout(() => {
      editInputRef.current?.focus();
      editInputRef.current?.select();
    }, 0);
  };

  const handleSaveEditFolder = () => {
    if (editingFolder && editingFolderName.trim()) {
      updateNameToFolder(editingFolder, editingFolderName.trim());
    }
    setEditingFolder(null);
    setEditingFolderName("");
  };

  const handleCancelEditFolder = () => {
    setEditingFolder(null);
    setEditingFolderName("");
  };

  const handleEditKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveEditFolder();
    } else if (e.key === "Escape") {
      handleCancelEditFolder();
    }
  };

  const handleSetActiveEnvironment = (envId: string) => {
    if (envId === "none") {
      setActiveEnvironment(null);
    } else {
      setActiveEnvironment(envId);
    }
  };

  const environmentOptions: DropdownOption[] = [
    {
      value: "none",
      label: "No environment",
      icon: X,
    },
    ...environments.map((env) => ({
      value: env.id,
      label: env.name,
      icon: Globe,
    })),
  ];

  const addOptions: DropdownOption[] = [
    {
      value: "request",
      label: "HTTP Request",
      icon: Globe,
    },
    {
      value: "folder",
      label: "Folder",
      icon: Folder,
    },
  ];

  const handleAddItemSelect = (value: string) => {
    if (value === "request") {
      handleCreateRequest();
    } else if (value === "folder") {
      handleOpenFolderModal();
    }
  };

  const handleDragStart = (
    e: React.DragEvent,
    type: "request" | "folder",
    id: string,
  ) => {
    e.stopPropagation();

    setDraggedItem({ type, id });

    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.setData("application/x-item-type", type);

    const element = e.currentTarget as HTMLElement;
    element.style.opacity = "0.5";
    element.style.transform = "rotate(2deg)";
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.stopPropagation();

    const element = e.currentTarget as HTMLElement;
    element.style.opacity = "1";
    element.style.transform = "none";

    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
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
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragOverItem(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetFolderId: string) => {
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
  };

  const handleDropOutsideFolder = (e: React.DragEvent) => {
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
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowContextMenu({
      x: e.clientX,
      y: e.clientY,
      show: true,
    });
  };

  const handleCreateFromContext = (type: "request" | "folder") => {
    setShowContextMenu({ x: 0, y: 0, show: false });
    if (type === "folder") {
      handleOpenFolderModal();
    } else {
      handleCreateRequest();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCreateFolder();
    } else if (e.key === "Escape") {
      handleCloseFolderModal();
    }
  };

  const hasOpenModals =
    showEnvironmentModal ||
    showFolderModal ||
    showContextMenu.show ||
    editingFolder;

  const handleMouseLeave = (_e: React.MouseEvent) => {
    if (hasOpenModals) {
      return;
    }
    onMouseLeave();
  };

  const renderRequestItem = (request: any) => (
    <div
      key={request.id}
      draggable
      onDragStart={(e) => handleDragStart(e, "request", request.id)}
      onDragEnd={handleDragEnd}
      onClick={() => setActiveRequest(request.id)}
      onMouseEnter={() => setHoveredRequest(request.id)}
      onMouseLeave={() => setHoveredRequest(null)}
      className={cn(
        "group relative p-3 rounded-lg cursor-pointer",
        activeRequestId === request.id
          ? "bg-accent text-accent-foreground border border-border"
          : "hover:bg-muted text-muted-foreground",
        draggedItem?.id === request.id && "opacity-50",
      )}
    >
      <div className="flex items-center space-x-2">
        <GripVertical className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing" />
        <span
          className={cn(
            "text-xs px-2 py-1 rounded font-medium border",
            getMethodColor(request.request.method),
          )}
        >
          {request.request.method}
        </span>
        <span className="text-sm truncate flex-1">
          {request.request.url.trim() ? request.request.url : request.name}
        </span>
        {hoveredRequest === request.id && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteRequest(request.id);
            }}
            className="p-1 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 text-muted-foreground hover:text-red-600 dark:hover:text-red-400"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  );

  if (!visible) return null;

  return (
    <>
      <div
        className={cn(
          "w-80 h-full bg-card border-r border-border shadow-sm flex flex-col",
          className,
        )}
        onMouseLeave={handleMouseLeave}
        onContextMenu={handleContextMenu}
        style={{ transition: "transform 300ms cubic-bezier(0.4, 0, 0.2, 1)" }}
      >
        <div className="p-4 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-1 flex-1 min-w-0">
              <button
                type="button"
                onClick={() => setShowEnvironmentModal(true)}
                className="p-1.5 rounded-md bg-muted text-muted-foreground hover:bg-accent flex-shrink-0"
                title="Manage environments"
              >
                <Settings className="h-3.5 w-3.5" />
              </button>

              <Dropdown
                options={environmentOptions}
                value={activeEnvironmentId || "none"}
                onChange={handleSetActiveEnvironment}
                customDisplay={
                  activeEnvironment ? activeEnvironment.name : "No environment"
                }
                className="flex-1 min-w-0 max-w-[140px]"
                buttonClassName="px-2 py-1 text-xs rounded-md border border-border hover:bg-muted w-full min-w-0 truncate"
                optionsClassName="left-0 w-52"
                showIcon={false}
              />
            </div>

            <div className="flex items-center space-x-1 flex-shrink-0">
              <button
                type="button"
                onClick={toggleTheme}
                className="p-1.5 rounded-md bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
                title={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
              >
                <div className="relative w-3.5 h-3.5">
                  <Sun
                    className={cn(
                      "absolute inset-0 w-3.5 h-3.5",
                      isDarkMode
                        ? "opacity-0 rotate-90 scale-75"
                        : "opacity-100 rotate-0 scale-100",
                    )}
                  />
                  <Moon
                    className={cn(
                      "absolute inset-0 w-3.5 h-3.5",
                      isDarkMode
                        ? "opacity-100 rotate-0 scale-100"
                        : "opacity-0 -rotate-90 scale-75",
                    )}
                  />
                </div>
              </button>
              <Dropdown
                options={addOptions}
                value=""
                onChange={handleAddItemSelect}
                customDisplay={<Plus className="h-3.5 w-3.5" />}
                className="relative"
                buttonClassName="p-1.5 rounded-md btn-primary w-7 h-7 flex items-center justify-center"
                optionsClassName="right-0 w-44"
                showIcon={true}
                showCheck={false}
              />
            </div>
          </div>
        </div>

        <div
          className="flex-1 overflow-y-auto p-2 min-h-0"
          onDragOver={(e) => {
            e.preventDefault();
            if (draggedItem && draggedItem.type === "request") {
              e.dataTransfer.dropEffect = "move";
            }
          }}
          onDrop={handleDropOutsideFolder}
        >
          {(requests.length > 0 || folders.length > 0) && (
            <div className="space-y-2">
              {folders.map((folder) => (
                <div key={folder.id} className="mb-2">
                  <div
                    className={cn(
                      "group flex items-center space-x-2 p-2 rounded-lg hover:bg-muted cursor-pointer",
                      dragOverItem === folder.id &&
                        "bg-accent border-2 border-primary border-dashed",
                    )}
                    onClick={() =>
                      editingFolder !== folder.id && toggleFolder(folder.id)
                    }
                    onDragOver={(e) => handleDragOver(e, folder.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, folder.id)}
                  >
                    <button
                      type="button"
                      className="p-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (editingFolder !== folder.id) {
                          toggleFolder(folder.id);
                        }
                      }}
                    >
                      {folder.expanded ? (
                        <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ChevronRight className="h-3 w-3" />
                      )}
                    </button>
                    <Folder className="h-4 w-4 text-muted-foreground" />

                    {editingFolder === folder.id ? (
                      <div className="flex items-center space-x-2 flex-1">
                        <input
                          ref={editInputRef}
                          type="text"
                          value={editingFolderName}
                          onChange={(e) => setEditingFolderName(e.target.value)}
                          onKeyDown={handleEditKeyPress}
                          onBlur={handleSaveEditFolder}
                          className="flex-1 text-sm font-medium bg-transparent border-b border-border focus:border-primary outline-none"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSaveEditFolder();
                          }}
                          className="p-1 rounded-md hover:bg-green-100 dark:hover:bg-green-900/30 text-muted-foreground hover:text-green-600 dark:hover:text-green-400"
                        >
                          <Check className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancelEditFolder();
                          }}
                          className="p-1 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 text-muted-foreground hover:text-red-600 dark:hover:text-red-400"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="text-sm font-medium flex-1 truncate">
                          {folder.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {folder.requests.length}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditFolder(folder.id, folder.name);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30 text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          <Edit2 className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFolder(folder.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 text-muted-foreground hover:text-red-600 dark:hover:text-red-400"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </>
                    )}
                  </div>

                  {folder.expanded && (
                    <div className="ml-6 space-y-1 mt-1">
                      {folder.requests.map((requestId) => {
                        const request = requests.find(
                          (r) => r.id === requestId,
                        );
                        if (!request) return null;
                        return renderRequestItem(request);
                      })}
                    </div>
                  )}
                </div>
              ))}

              {unorganizedRequests.length > 0 && (
                <div className="space-y-1">
                  {unorganizedRequests.map(renderRequestItem)}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showContextMenu.show && (
        <button
          type="button"
          className="fixed z-50 bg-card border border-border rounded-md shadow-lg py-1 min-w-32 animate-in fade-in-0 zoom-in-95"
          style={{
            left: showContextMenu.x,
            top: showContextMenu.y,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => handleCreateFromContext("request")}
            className="w-full px-3 py-2 text-left hover:bg-muted flex items-center space-x-2 text-sm "
          >
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span className="capitalize">HTTP Request</span>
          </button>
          <div className="border-t border-border mt-1 pt-1">
            <button
              type="button"
              onClick={() => handleCreateFromContext("folder")}
              className="w-full px-3 py-2 text-left hover:bg-muted flex items-center space-x-2 text-sm "
            >
              <Folder className="h-4 w-4 text-muted-foreground" />
              <span>Folder</span>
            </button>
          </div>
        </button>
      )}

      {showFolderModal && (
        <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in-0">
          <div className="bg-card rounded-lg p-6 w-96 max-w-md mx-4 animate-in zoom-in-95 slide-in-from-bottom-4 border border-border shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground ">
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
                htmlFor=""
                className="block text-sm font-medium text-foreground mb-2 "
              >
                Folder name
              </label>
              <input
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
                <p className="mt-1 text-sm text-red-600 ">{folderNameError}</p>
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
                className="px-4 py-2 text-sm font-medium btn-primary disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors "
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
