import { Globe, Plus, Trash2 } from "lucide-react";
import { useCallback } from "react";
import type { Environment, EnvironmentScope } from "@/types/data";
import { cn } from "@/utils";

interface EnvironmentSidebarProps {
  environments: Environment[];
  activeTab: EnvironmentScope;
  selectedEnvId: string | null;
  onTabChange: (tab: EnvironmentScope) => void;
  onEnvironmentSelect: (envId: string) => void;
  onEnvironmentDelete: (envId: string) => void;
  onNewEnvironment: () => void;
}

const EnvironmentSidebar = ({
  environments,
  activeTab,
  selectedEnvId,
  onTabChange,
  onEnvironmentSelect,
  onEnvironmentDelete,
  onNewEnvironment,
}: EnvironmentSidebarProps) => {
  const handleGlobalsClick = useCallback(() => {
    onTabChange("globals");
  }, [onTabChange]);

  const handleEnvironmentClick = useCallback(
    (envId: string) => {
      onTabChange("environments");
      onEnvironmentSelect(envId);
    },
    [onTabChange, onEnvironmentSelect],
  );

  const handleDeleteClick = useCallback(
    (e: React.MouseEvent, envId: string) => {
      e.stopPropagation();
      onEnvironmentDelete(envId);
    },
    [onEnvironmentDelete],
  );

  return (
    <div className="w-64 bg-muted rounded-l-lg flex flex-col border-r border-border flex-shrink-0">
      <div className="p-4 border-b border-border flex-shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-foreground font-medium">Environments</h2>
          <button
            type="button"
            onClick={onNewEnvironment}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors duration-150"
            title="Create new environment"
            aria-label="Create new environment"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        <button
          type="button"
          className={cn(
            "w-full p-3 border-b border-border cursor-pointer transition-colors duration-150 text-left",
            activeTab === "globals"
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-foreground",
          )}
          onClick={handleGlobalsClick}
          aria-label="Global variables"
        >
          <div className="flex items-center space-x-2">
            <Globe className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm font-medium">Global Variables</span>
          </div>
        </button>

        {environments.map((env) => (
          <div
            key={env.id}
            className={cn(
              "group relative border-b border-border transition-colors duration-150",
              activeTab === "environments" && selectedEnvId === env.id
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            <button
              type="button"
              className="w-full p-3 cursor-pointer transition-colors duration-150 text-left"
              onClick={() => handleEnvironmentClick(env.id)}
              aria-label={`Environment: ${env.name}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0 pr-8">
                  <div className="flex items-center space-x-2">
                    <span
                      className="text-sm font-medium truncate"
                      title={env.name}
                    >
                      {env.name}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {env.variables?.length || 0} variables
                  </div>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={(e) => handleDeleteClick(e, env.id)}
              className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-muted-foreground hover:text-red-600 dark:hover:text-red-400 transition-all duration-150"
              title={`Delete environment: ${env.name}`}
              aria-label={`Delete environment: ${env.name}`}
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnvironmentSidebar;
