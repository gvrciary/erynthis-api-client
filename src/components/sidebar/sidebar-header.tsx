import { Folder, Plus, Settings } from "lucide-react";
import { useCallback } from "react";
import type { ContextMenuItem } from "@/components/ui/context-menu";
import ContextMenu from "@/components/ui/context-menu";
import Dropdown from "@/components/ui/drop-down";
import { useEnvironments } from "@/hooks/data/useEnvironments";
import { useContextMenu } from "@/hooks/ui/use-context-menu";
import type { DropdownOption } from "@/types/data";
import ToggleMode from "../ui/toggle-mode";

interface SidebarHeaderProps {
  onOpenEnvironmentModal: () => void;
  onCreateRequest: () => void;
  onOpenFolderModal: () => void;
}

const SidebarHeader = ({
  onOpenEnvironmentModal,
  onCreateRequest,
  onOpenFolderModal,
}: SidebarHeaderProps) => {
  const {
    environments,
    activeEnvironmentId,
    activeEnvironment,
    setActiveEnvironment,
  } = useEnvironments();

  const { contextMenu, handleContextMenu, closeContextMenu } = useContextMenu();

  const handleSetActiveEnvironment = useCallback(
    (envId: string) => {
      if (envId === "none") {
        setActiveEnvironment(null);
      } else {
        setActiveEnvironment(envId);
      }
    },
    [setActiveEnvironment],
  );

  const environmentOptions: DropdownOption[] = [
    {
      value: "none",
      label: "No environment",
      icon: Settings,
    },
    ...environments.map((env) => ({
      value: env.id,
      label: env.name,
      icon: Settings,
    })),
  ];

  const contextMenuItems: ContextMenuItem[] = [
    {
      id: "request",
      label: "HTTP Request",
      icon: Settings,
      onClick: onCreateRequest,
    },
    {
      id: "folder",
      label: "Folder",
      icon: Folder,
      onClick: onOpenFolderModal,
      separator: true,
    },
  ];

  return (
    <>
      <div className="p-4 border-b border-border flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1 flex-1 min-w-0">
            <button
              type="button"
              onClick={onOpenEnvironmentModal}
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
            <ToggleMode />

            <button
              type="button"
              onClick={handleContextMenu}
              className="p-1.5 rounded-md btn-primary w-7 h-7 flex items-center justify-center hover:opacity-90"
              title="Add new item"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      <ContextMenu
        isOpen={contextMenu.isOpen}
        position={contextMenu.position}
        items={contextMenuItems}
        onClose={closeContextMenu}
        minWidth={150}
      />
    </>
  );
};

export default SidebarHeader;
