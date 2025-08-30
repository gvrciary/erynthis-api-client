import { useMemo } from "react";
import { useEnvironmentStore } from "@/store/environment-store";
import { resolveVariables } from "@/utils/variables";

export const useEnvironments = () => {
  const {
    environments,
    activeEnvironmentId,
    globalVariables,
    createEnvironment,
    updateEnvironment,
    deleteEnvironment,
    setActiveEnvironment,
    addGlobalVariable,
    updateGlobalVariable,
    deleteGlobalVariable,
    addVariableEnvironment,
  } = useEnvironmentStore();

  const activeEnvironment = useMemo(() => {
    return environments.find((env) => env.id === activeEnvironmentId) || null;
  }, [environments, activeEnvironmentId]);

  const allVariables = useMemo(() => {
    const variables = [...globalVariables];
    if (activeEnvironment) {
      variables.push(...activeEnvironment.variables);
    }
    return variables.filter((v) => v.enabled && v.key.trim() && v.value.trim());
  }, [globalVariables, activeEnvironment]);

  return {
    environments,
    activeEnvironmentId,
    activeEnvironment,
    globalVariables,
    allVariables,
    resolveVariables,
    createEnvironment,
    updateEnvironment,
    deleteEnvironment,
    setActiveEnvironment,
    addGlobalVariable,
    updateGlobalVariable,
    deleteGlobalVariable,
    addVariableEnvironment,
  };
};
