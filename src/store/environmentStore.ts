import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Environment, Variable } from "../types/data";
import { generateId } from "../utils";

export interface EnvironmentStore {
  environments: Environment[];
  activeEnvironmentId: string | null;
  globalVariables: Variable[];

  createEnvironment: (name: string) => string;
  updateEnvironment: (id: string, environment: Partial<Environment>) => void;
  deleteEnvironment: (id: string) => void;
  setActiveEnvironment: (id: string | null) => void;
  addGlobalVariable: () => void;
  addVariableEnvironment: () => void;
  updateGlobalVariable: (id: string, updates: Partial<Variable>) => void;
  deleteGlobalVariable: (id: string) => void;
}

export const useEnvironmentStore = create<EnvironmentStore>()(
  persist(
    (set) => ({
      environments: [],
      activeEnvironmentId: null,
      globalVariables: [
        {
          id: generateId("var"),
          key: "",
          value: "",
          enabled: false,
        },
      ],

      createEnvironment: (name) => {
        if (!name) return "";

        const defaultVariable: Variable = {
          id: generateId("var"),
          key: "",
          value: "",
          enabled: false,
        };

        const newEnvironment: Environment = {
          id: generateId("env"),
          name,
          variables: [defaultVariable],
        };

        set((state) => ({
          environments: [...state.environments, newEnvironment],
          activeEnvironmentId: newEnvironment.id,
        }));

        return newEnvironment.id;
      },

      updateEnvironment: (id, environment) => {
        set((state) => ({
          environments: state.environments.map((env) =>
            env.id === id ? { ...env, ...environment } : env,
          ),
        }));
      },

      deleteEnvironment: (id) => {
        set((state) => ({
          environments: state.environments.filter((env) => env.id !== id),
          activeEnvironmentId:
            state.activeEnvironmentId === id ? null : state.activeEnvironmentId,
        }));
      },

      setActiveEnvironment: (id) => {
        set({ activeEnvironmentId: id });
      },

      addGlobalVariable: () => {
        const newVariable: Variable = {
          id: generateId("var"),
          key: "",
          value: "",
          enabled: false,
        };
        set((state) => ({
          globalVariables: [...state.globalVariables, newVariable],
        }));
      },

      updateGlobalVariable: (id, updates) => {
        set((state) => ({
          globalVariables: state.globalVariables.map((varItem) =>
            varItem.id === id ? { ...varItem, ...updates } : varItem,
          ),
        }));
      },

      deleteGlobalVariable: (id) => {
        set((state) => ({
          globalVariables: state.globalVariables.filter(
            (varItem) => varItem.id !== id,
          ),
        }));
      },
      
      addVariableEnvironment: () => {
        const newVariable: Variable = {
          id: generateId("var"),
          key: "",
          value: "",
          enabled: false,
        };
        set((state) => {
          const activeEnv = state.environments.find(
            (env) => env.id === state.activeEnvironmentId,
          );
          if (activeEnv) {
            return {
              environments: state.environments.map((env) =>
                env.id === activeEnv.id
                  ? { ...env, variables: [...env.variables, newVariable] }
                  : env,
              ),
            };
          }
          return state;
        });
      },
    }),
    {
      name: "environment-store",
      partialize: (state) => ({
        environments: state.environments,
        activeEnvironmentId: state.activeEnvironmentId,
        globalVariables: state.globalVariables,
      }),
    },
  ),
);
