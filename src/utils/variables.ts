import { useEnvironmentStore } from "@/store/environment-store";
import type { Variable } from "@/types/data";

export const resolveVariables = (text: string): string => {
  if (!text) return "";

  const { globalVariables, environments, activeEnvironmentId } =
    useEnvironmentStore.getState();

  const variables: Variable[] = [
    ...globalVariables,
    ...(environments.find((env) => env.id === activeEnvironmentId)?.variables ??
      []),
  ].filter(({ enabled, key, value }) => enabled && key.trim() && value.trim());

  return variables.reduce((acc, { key, value }) => {
    const pattern = new RegExp(`\\{\\{\\s*${key.trim()}\\s*\\}\\}`, "g");
    return acc.replace(pattern, value.trim());
  }, text);
};
