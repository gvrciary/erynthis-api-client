import { Settings } from "lucide-react";
import type { Environment, EnvironmentScope, Variable } from "@/types/data";
import VariablesTable from "./variables-table";

interface EnvironmentContentProps {
  activeTab: EnvironmentScope;
  selectedEnv: Environment | undefined;
  globalVariables: Variable[];
  onGlobalKeyChange: (id: string, key: string) => void;
  onGlobalValueChange: (id: string, value: string) => void;
  onGlobalToggle: (id: string, enabled: boolean) => void;
  onGlobalDelete: (id: string) => void;
  onVariableKeyChange: (id: string, key: string) => void;
  onVariableValueChange: (id: string, value: string) => void;
  onVariableToggle: (id: string, enabled: boolean) => void;
  onVariableDelete: (id: string) => void;
}

const EnvironmentContent = ({
  activeTab,
  selectedEnv,
  globalVariables,
  onGlobalKeyChange,
  onGlobalValueChange,
  onGlobalToggle,
  onGlobalDelete,
  onVariableKeyChange,
  onVariableValueChange,
  onVariableToggle,
  onVariableDelete,
}: EnvironmentContentProps) => {
  const getTitle = () => {
    if (activeTab === "globals") {
      return "Global Variables";
    }
    if (selectedEnv) {
      return selectedEnv.name;
    }
    return "Select Environment";
  };

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-20">
      <Settings className="h-16 w-16 mx-auto mb-6 text-muted-foreground opacity-50" />
      <div className="text-center max-w-md">
        <h3 className="text-lg font-medium mb-2 text-foreground">
          Select an Environment
        </h3>
      </div>
    </div>
  );

  const renderContent = () => {
    if (activeTab === "globals") {
      return (
        <VariablesTable
          variables={globalVariables}
          onKeyChange={onGlobalKeyChange}
          onValueChange={onGlobalValueChange}
          onToggleEnabled={onGlobalToggle}
          onDelete={onGlobalDelete}
        />
      );
    }

    if (selectedEnv) {
      return (
        <VariablesTable
          variables={selectedEnv.variables || []}
          onKeyChange={onVariableKeyChange}
          onValueChange={onVariableValueChange}
          onToggleEnabled={onVariableToggle}
          onDelete={onVariableDelete}
        />
      );
    }

    return renderEmptyState();
  };

  return (
    <div className="flex-1 bg-card rounded-r-lg flex flex-col min-w-0">
      <div className="p-6 border-b border-border flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-foreground mb-1">
              {getTitle()}
            </h1>

            <div className="flex items-center space-x-4 mt-3">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-muted-foreground">
                  {activeTab === "environments" && selectedEnv
                    ? selectedEnv.variables?.length
                    : activeTab === "globals"
                      ? globalVariables.length
                      : 0}{" "}
                  variables
                </span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">
                  {activeTab === "environments" && selectedEnv
                    ? selectedEnv.variables?.filter((v) => v.enabled).length ||
                      0
                    : activeTab === "globals"
                      ? globalVariables.filter((v) => v.enabled).length
                      : 0}{" "}
                  enabled
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 min-h-0">
        {renderContent()}
      </div>
    </div>
  );
};

export default EnvironmentContent;
