import { Globe, Plus, Settings, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useEnvironments } from "@/hooks/data/useEnvironments.ts";
import type { Variable } from "@/types/data.ts";
import { cn } from "@/utils";

interface EnvironmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EnvironmentModal = ({ isOpen, onClose }: EnvironmentModalProps) => {
  const {
    environments,
    globalVariables,
    createEnvironment,
    updateEnvironment,
    deleteEnvironment,
    addGlobalVariable,
    updateGlobalVariable,
    deleteGlobalVariable,
    addVariableEnvironment,
  } = useEnvironments();
  const [selectedEnvId, setSelectedEnvId] = useState<string | null>(null);
  const [newEnvName, setNewEnvName] = useState("");
  const [showNewEnvModal, setShowNewEnvModal] = useState(false);
  const [envNameError, setEnvNameError] = useState("");
  const [activeTab, setActiveTab] = useState<"environments" | "globals">(
    "globals",
  );
  const modalRef = useRef<HTMLDivElement>(null);
  const newEnvInputRef = useRef<HTMLInputElement>(null);

  const selectedEnv = environments.find((env) => env.id === selectedEnvId);

  useEffect(() => {
    if (showNewEnvModal && newEnvInputRef.current) {
      newEnvInputRef.current.focus();
    }
  }, [showNewEnvModal]);

  useEffect(() => {
    if (
      globalVariables.length === 0 ||
      globalVariables[globalVariables.length - 1].key.trim() ||
      globalVariables[globalVariables.length - 1].value.trim()
    ) {
      addGlobalVariable();
    }
  }, [globalVariables, addGlobalVariable]);

  useEffect(() => {
    if (
      selectedEnv &&
      (selectedEnv.variables.length === 0 ||
        selectedEnv.variables[selectedEnv.variables.length - 1].key.trim() ||
        selectedEnv.variables[selectedEnv.variables.length - 1].value.trim())
    ) {
      addVariableEnvironment();
    }
  }, [selectedEnv, addVariableEnvironment]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  const handleCreateEnvironment = () => {
    const trimmedName = newEnvName.trim();

    if (!trimmedName) {
      setEnvNameError("El nombre del environment es requerido");
      return;
    }

    if (
      environments.some(
        (env) => env.name.toLowerCase() === trimmedName.toLowerCase(),
      )
    ) {
      setEnvNameError("Ya existe un environment con este nombre");
      return;
    }

    createEnvironment(trimmedName);
    setNewEnvName("");
    setShowNewEnvModal(false);
    setEnvNameError("");
  };

  const handleDeleteEnvironment = (envId: string) => {
    deleteEnvironment(envId);
    if (selectedEnvId === envId) {
      setSelectedEnvId(
        environments.length > 1
          ? environments.find((e) => e.id !== envId)?.id || null
          : null,
      );
    }
  };

  const handleUpdateVariable = (
    variableId: string,
    updates: Partial<Variable>,
  ) => {
    if (!selectedEnv) return;

    const updatedVariables = selectedEnv.variables.map((variable) =>
      variable.id === variableId ? { ...variable, ...updates } : variable,
    );

    updateEnvironment(selectedEnv.id, { variables: updatedVariables });
  };

  const handleDeleteVariable = (variableId: string) => {
    if (!selectedEnv) return;

    const updatedVariables = selectedEnv.variables.filter(
      (variable) => variable.id !== variableId,
    );
    updateEnvironment(selectedEnv.id, { variables: updatedVariables });
  };

  const handleVariableKeyChange = (variableId: string, key: string) => {
    if (selectedEnv) {
      const variable = selectedEnv.variables.find((v) => v.id === variableId);
      const shouldEnable = !variable?.enabled && key.trim();
      handleUpdateVariable(variableId, {
        key,
        enabled: shouldEnable ? true : variable?.enabled || false,
      });
    }
  };

  const handleVariableValueChange = (variableId: string, value: string) => {
    if (selectedEnv) {
      const variable = selectedEnv.variables.find((v) => v.id === variableId);
      const shouldEnable = !variable?.enabled && value.trim();
      handleUpdateVariable(variableId, {
        value,
        enabled: shouldEnable ? true : variable?.enabled || false,
      });
    }
  };

  const handleGlobalVariableKeyChange = (variableId: string, key: string) => {
    const variable = globalVariables.find((v) => v.id === variableId);
    const shouldEnable = !variable?.enabled && key.trim();
    updateGlobalVariable(variableId, {
      key,
      enabled: shouldEnable ? true : variable?.enabled || false,
    });
  };

  const handleGlobalVariableValueChange = (
    variableId: string,
    value: string,
  ) => {
    const variable = globalVariables.find((v) => v.id === variableId);
    const shouldEnable = !variable?.enabled && value.trim();
    updateGlobalVariable(variableId, {
      value,
      enabled: shouldEnable ? true : variable?.enabled || false,
    });
  };

  const renderVariableRow = (
    variable: Variable,
    onKeyChange: (id: string, key: string) => void,
    onValueChange: (id: string, value: string) => void,
    onToggleEnabled: (id: string, enabled: boolean) => void,
    onDelete: (id: string) => void,
    index: number,
  ) => (
    <div
      key={variable.id}
      className="grid grid-cols-12 gap-4 items-center py-3 border-b border-border hover:bg-accent"
    >
      <div className="col-span-1">
        <button
          type="button"
          onClick={() => onToggleEnabled(variable.id, !variable.enabled)}
          className={cn(
            "w-4 h-4 rounded border-2 flex items-center justify-center",
            variable.enabled
              ? "bg-primary border-primary text-primary-foreground"
              : "border-border hover:border-primary",
          )}
        >
          {variable.enabled && <span className="text-xs ">✓</span>}
        </button>
      </div>

      <div className="col-span-5">
        <input
          type="text"
          value={variable.key}
          onChange={(e) => onKeyChange(variable.id, e.target.value)}
          placeholder="VAR_NAME"
          className="w-full px-3 py-2 bg-transparent text-foreground text-sm border-none focus:outline-none focus:bg-accent rounded  placeholder-muted-foreground"
        />
      </div>

      <div className="col-span-5">
        <input
          type="text"
          value={variable.value}
          onChange={(e) => onValueChange(variable.id, e.target.value)}
          placeholder="value"
          className="w-full px-3 py-2 bg-transparent text-foreground text-sm border-none focus:outline-none focus:bg-accent rounded  placeholder-muted-foreground"
        />
      </div>

      <div className="col-span-1">
        {((activeTab === "globals" && index < globalVariables.length - 1) ||
          (activeTab === "environments" &&
            selectedEnv &&
            index < selectedEnv.variables.length - 1)) && (
          <button
            type="button"
            onClick={() => onDelete(variable.id)}
            className="p-1 rounded text-muted-foreground hover:text-red-600"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  );

  const renderVariablesHeader = () => (
    <div className="grid grid-cols-12 gap-4 text-xs font-medium text-muted-foreground uppercase tracking-wider border-b border-border pb-2 ">
      <div className="col-span-1"></div>
      <div className="col-span-5">Variable</div>
      <div className="col-span-5">Value</div>
      <div className="col-span-1"></div>
    </div>
  );

  const renderEmptyState = () => (
    <div className="text-center py-20 text-muted-foreground">
      <Settings className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
      <p className="text-lg mb-2 ">Select an environment</p>
      <p className="text-sm text-muted-foreground ">
        Choose an environment from the sidebar to view and edit variables
      </p>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-card rounded-2xl w-full max-w-4xl h-[85vh] flex shadow-2xl border border-border relative"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground z-10"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="w-64 bg-muted rounded-l-2xl flex flex-col border-r border-border flex-shrink-0">
          <div className="p-4 border-b border-border flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-foreground font-medium ">Environments</h2>
              <button
                type="button"
                onClick={() => setShowNewEnvModal(true)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0">
            <div
              className={cn(
                "p-3 border-b border-border cursor-pointer",
                activeTab === "globals"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent",
              )}
              onClick={() => setActiveTab("globals")}
            >
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <span className="text-sm font-medium ">Global Variables</span>
              </div>
            </div>

            {environments.map((env) => (
              <div
                key={env.id}
                className={cn(
                  "group p-3 border-b border-border cursor-pointer",
                  activeTab === "environments" && selectedEnvId === env.id
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent",
                )}
                onClick={() => {
                  setActiveTab("environments");
                  setSelectedEnvId(env.id);
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium truncate ">
                        {env.name}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 ">
                      {env.variables.length} variables
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteEnvironment(env.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 text-muted-foreground hover:text-red-600"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 bg-card rounded-r-2xl flex flex-col min-w-0">
          <div className="p-6 border-b border-border flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-foreground ">
                  {activeTab === "globals"
                    ? "Global Variables"
                    : selectedEnvId
                      ? environments.find((env) => env.id === selectedEnvId)
                          ?.name
                      : "Select Environment"}
                </h1>
                {activeTab === "environments" && selectedEnvId && (
                  <div className="flex items-center space-x-4 mt-2">
                    <button
                      type="button"
                      className="text-primary hover:text-foreground text-sm "
                    >
                      Reveal Values
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 min-h-0">
            {activeTab === "globals" ? (
              <div className="space-y-4">
                {renderVariablesHeader()}
                {globalVariables.map((variable, index) =>
                  renderVariableRow(
                    variable,
                    handleGlobalVariableKeyChange,
                    handleGlobalVariableValueChange,
                    (id, enabled) => updateGlobalVariable(id, { enabled }),
                    deleteGlobalVariable,
                    index,
                  ),
                )}
              </div>
            ) : selectedEnvId && selectedEnv ? (
              <div className="space-y-4">
                {renderVariablesHeader()}
                {selectedEnv.variables.map((variable, index) =>
                  renderVariableRow(
                    variable,
                    handleVariableKeyChange,
                    handleVariableValueChange,
                    (id, enabled) => handleUpdateVariable(id, { enabled }),
                    handleDeleteVariable,
                    index,
                  ),
                )}
              </div>
            ) : (
              renderEmptyState()
            )}
          </div>
        </div>
      </div>

      {showNewEnvModal && (
        <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm flex items-center justify-center z-[60]">
          <div className="bg-card rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-foreground ">
                New Environment
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowNewEnvModal(false);
                  setNewEnvName("");
                  setEnvNameError("");
                }}
                className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-accent text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor=""
                  className="block text-sm font-medium text-foreground mb-2 "
                >
                  Environment Name
                </label>
                <input
                  ref={newEnvInputRef}
                  type="text"
                  value={newEnvName}
                  onChange={(e) => {
                    setNewEnvName(e.target.value);
                    if (envNameError) setEnvNameError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleCreateEnvironment();
                    } else if (e.key === "Escape") {
                      setShowNewEnvModal(false);
                      setNewEnvName("");
                      setEnvNameError("");
                    }
                  }}
                  placeholder="Enter environment name"
                  className={cn(
                    "w-full px-3 py-2 text-sm border rounded-lg text-foreground placeholder-muted-foreground bg-background focus-ring",
                    envNameError ? "border-red-500 bg-red-50" : "border-border",
                  )}
                />
                {envNameError && (
                  <p className="mt-1 text-xs text-red-600 ">{envNameError}</p>
                )}
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={handleCreateEnvironment}
                  className="flex-1 px-4 py-2 btn-primary rounded-lg text-sm font-medium "
                >
                  Create Environment
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowNewEnvModal(false);
                    setNewEnvName("");
                    setEnvNameError("");
                  }}
                  className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-accent text-sm font-medium "
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnvironmentModal;
