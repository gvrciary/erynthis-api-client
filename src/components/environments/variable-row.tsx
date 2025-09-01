import { Trash2 } from "lucide-react";
import { useCallback } from "react";
import Input from "@/components/ui/input";
import type { Variable } from "@/types/data";
import { cn } from "@/utils";
import Tooltip from "@/components/ui/tooltip";

interface VariableRowProps {
  variable: Variable;
  isLast: boolean;
  onKeyChange: (id: string, key: string) => void;
  onValueChange: (id: string, value: string) => void;
  onToggleEnabled: (id: string, enabled: boolean) => void;
  onDelete: (id: string) => void;
}

const VariableRow = ({
  variable,
  isLast,
  onKeyChange,
  onValueChange,
  onToggleEnabled,
  onDelete,
}: VariableRowProps) => {
  const handleToggle = useCallback(() => {
    onToggleEnabled(variable.id, !variable.enabled);
  }, [variable.id, variable.enabled, onToggleEnabled]);

  const handleKeyChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onKeyChange(variable.id, e.target.value);
    },
    [variable.id, onKeyChange],
  );

  const handleValueChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onValueChange(variable.id, e.target.value);
    },
    [variable.id, onValueChange],
  );

  const handleDelete = useCallback(() => {
    onDelete(variable.id);
  }, [variable.id, onDelete]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
      }
    },
    [],
  );

  return (
    <tr className="border-b border-border hover:bg-accent transition-colors duration-150">
      <td className="py-3 pr-4">
        <Tooltip content={`${variable.enabled ? "Disable" : "Enable"} variable`}>
          <button
            type="button"
            onClick={handleToggle}
            className={cn(
              "w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-150 focus:ring-2 focus:ring-primary focus:ring-offset-2",
              variable.enabled
                ? "bg-primary border-primary text-primary-foreground"
                : "border-border hover:border-primary",
            )}
            title={`${variable.enabled ? "Disable" : "Enable"} variable`}
            aria-label={`${variable.enabled ? "Disable" : "Enable"} variable ${variable.key || "unnamed"}`}
          >
            {variable.enabled && (
              <span className="text-xs font-bold" aria-hidden="true">
                ✓
              </span>
            )}
          </button>
        </Tooltip>
      </td>

      <td className="py-3 pr-4 w-5/12">
        <Input
          type="text"
          value={variable.key}
          onChange={handleKeyChange}
          onKeyDown={handleKeyDown}
          placeholder="VAR_NAME"
          variant="transparent"
          size="sm"
          aria-label="Variable name"
          autoComplete="off"
          spellCheck={false}
        />
      </td>

      <td className="py-3 pr-4 w-5/12">
        <Input
          type="text"
          value={variable.value}
          onChange={handleValueChange}
          onKeyDown={handleKeyDown}
          placeholder="value"
          variant="transparent"
          size="sm"
          aria-label="Variable value"
          autoComplete="off"
        />
      </td>

      <td className="py-3 w-1/12">
        {!isLast && (
          <button
            type="button"
            onClick={handleDelete}
            className="p-1 rounded text-muted-foreground hover:text-red-600 dark:hover:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-150 focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
            title="Delete variable"
            aria-label={`Delete variable ${variable.key || "unnamed"}`}
          >
            <Trash2 className="h-3 w-3" />
          </button>
        )}
      </td>
    </tr>
  );
};

export default VariableRow;
