import { useCallback, useEffect, useState } from "react";
import Modal from "@/components/ui/modal";
import { useEnvironments } from "@/hooks/data/useEnvironments";
import type { EnvironmentScope } from "@/types/data";
import EnvironmentContent from "./environment-content";
import EnvironmentSidebar from "./environment-sidebar";
import NewEnvironmentModal from "./new-environment-modal";

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
  const [activeTab, setActiveTab] = useState<EnvironmentScope>("globals");

  const [showNewEnvModal, setShowNewEnvModal] = useState(false);
  const [newEnvName, setNewEnvName] = useState("");
  const [envNameError, setEnvNameError] = useState("");

  const selectedEnv = environments.find((env) => env.id === selectedEnvId);

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

  const handleTabChange = useCallback((tab: EnvironmentScope) => {
    setActiveTab(tab);
  }, []);

  const handleEnvironmentSelect = useCallback((envId: string) => {
    setSelectedEnvId(envId);
  }, []);

  const handleCreateEnvironment = useCallback(() => {
    const trimmedName = newEnvName.trim();

    if (!trimmedName) {
      setEnvNameError("The environment name is required");
      return;
    }

    if (
      environments.some(
        (env) => env.name.toLowerCase() === trimmedName.toLowerCase(),
      )
    ) {
      setEnvNameError("An environment with this name already exists");
      return;
    }

    createEnvironment(trimmedName);
    setNewEnvName("");
    setShowNewEnvModal(false);
    setEnvNameError("");
  }, [newEnvName, environments, createEnvironment]);

  const handleDeleteEnvironment = useCallback(
    (envId: string) => {
      deleteEnvironment(envId);
      if (selectedEnvId === envId) {
        setSelectedEnvId(
          environments.length > 1
            ? environments.find((e) => e.id !== envId)?.id || null
            : null,
        );
      }
    },
    [deleteEnvironment, selectedEnvId, environments],
  );

  const handleOpenNewEnvModal = useCallback(() => {
    setShowNewEnvModal(true);
    setNewEnvName("");
    setEnvNameError("");
  }, []);

  const handleCloseNewEnvModal = useCallback(() => {
    setShowNewEnvModal(false);
    setNewEnvName("");
    setEnvNameError("");
  }, []);

  const handleNewEnvNameChange = useCallback((name: string) => {
    setNewEnvName(name);
  }, []);

  const handleNewEnvErrorClear = useCallback(() => {
    setEnvNameError("");
  }, []);

  const handleUpdateVariable = useCallback(
    (
      variableId: string,
      updates: Partial<{ key: string; value: string; enabled: boolean }>,
    ) => {
      if (!selectedEnv) return;

      const updatedVariables = selectedEnv.variables.map((variable) =>
        variable.id === variableId ? { ...variable, ...updates } : variable,
      );

      updateEnvironment(selectedEnv.id, { variables: updatedVariables });
    },
    [selectedEnv, updateEnvironment],
  );

  const handleDeleteVariable = useCallback(
    (variableId: string) => {
      if (!selectedEnv) return;

      const updatedVariables = selectedEnv.variables.filter(
        (variable) => variable.id !== variableId,
      );
      updateEnvironment(selectedEnv.id, { variables: updatedVariables });
    },
    [selectedEnv, updateEnvironment],
  );

  const handleVariableKeyChange = useCallback(
    (variableId: string, key: string) => {
      if (selectedEnv) {
        const variable = selectedEnv.variables.find((v) => v.id === variableId);
        const shouldEnable = !variable?.enabled && key.trim();
        handleUpdateVariable(variableId, {
          key,
          enabled: shouldEnable ? true : variable?.enabled || false,
        });
      }
    },
    [selectedEnv, handleUpdateVariable],
  );

  const handleVariableValueChange = useCallback(
    (variableId: string, value: string) => {
      if (selectedEnv) {
        const variable = selectedEnv.variables.find((v) => v.id === variableId);
        const shouldEnable = !variable?.enabled && value.trim();
        handleUpdateVariable(variableId, {
          value,
          enabled: shouldEnable ? true : variable?.enabled || false,
        });
      }
    },
    [selectedEnv, handleUpdateVariable],
  );

  const handleVariableToggle = useCallback(
    (variableId: string, enabled: boolean) => {
      handleUpdateVariable(variableId, { enabled });
    },
    [handleUpdateVariable],
  );

  const handleGlobalVariableKeyChange = useCallback(
    (variableId: string, key: string) => {
      const variable = globalVariables.find((v) => v.id === variableId);
      const shouldEnable = !variable?.enabled && key.trim();
      updateGlobalVariable(variableId, {
        key,
        enabled: shouldEnable ? true : variable?.enabled || false,
      });
    },
    [globalVariables, updateGlobalVariable],
  );

  const handleGlobalVariableValueChange = useCallback(
    (variableId: string, value: string) => {
      const variable = globalVariables.find((v) => v.id === variableId);
      const shouldEnable = !variable?.enabled && value.trim();
      updateGlobalVariable(variableId, {
        value,
        enabled: shouldEnable ? true : variable?.enabled || false,
      });
    },
    [globalVariables, updateGlobalVariable],
  );

  const handleGlobalVariableToggle = useCallback(
    (variableId: string, enabled: boolean) => {
      updateGlobalVariable(variableId, { enabled });
    },
    [updateGlobalVariable],
  );

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Environment Manager"
        size="xl"
        className="w-full max-w-4xl h-[85vh]"
      >
        <div className="flex h-full -m-6">
          <EnvironmentSidebar
            environments={environments}
            activeTab={activeTab}
            selectedEnvId={selectedEnvId}
            onTabChange={handleTabChange}
            onEnvironmentSelect={handleEnvironmentSelect}
            onEnvironmentDelete={handleDeleteEnvironment}
            onNewEnvironment={handleOpenNewEnvModal}
          />

          <EnvironmentContent
            activeTab={activeTab}
            selectedEnv={selectedEnv}
            globalVariables={globalVariables}
            onGlobalKeyChange={handleGlobalVariableKeyChange}
            onGlobalValueChange={handleGlobalVariableValueChange}
            onGlobalToggle={handleGlobalVariableToggle}
            onGlobalDelete={deleteGlobalVariable}
            onVariableKeyChange={handleVariableKeyChange}
            onVariableValueChange={handleVariableValueChange}
            onVariableToggle={handleVariableToggle}
            onVariableDelete={handleDeleteVariable}
          />
        </div>
      </Modal>

      <NewEnvironmentModal
        isOpen={showNewEnvModal}
        onClose={handleCloseNewEnvModal}
        onCreate={handleCreateEnvironment}
        existingEnvironments={environments}
        environmentName={newEnvName}
        onNameChange={handleNewEnvNameChange}
        error={envNameError}
        onErrorClear={handleNewEnvErrorClear}
      />
    </>
  );
};

export default EnvironmentModal;
