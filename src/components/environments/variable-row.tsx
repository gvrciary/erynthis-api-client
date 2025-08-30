import { Trash2 } from "lucide-react";
import { useCallback } from "react";
import type { Variable } from "@/types/data";
import { cn } from "@/utils";

interface VariableRowProps {
  variable: Variable;
  index: number;
  isLast: boolean;
  onKeyChange: (id: string, key: string) => void;
  onValueChange: (id: string, value: string) => void;
  onToggleEnabled: (id: string, enabled: boolean) => void;
  onDelete: (id: string) => void;
}

const VariableRow = ({
  variable,
  index,
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
    <div
      className="grid grid-cols-12 gap-4 items-center py-3 border-b border-border hover:bg-accent transition-colors duration-150"
      role="row"
    >
      <div className="col-span-1" role="gridcell">
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
          aria-checked={variable.enabled}
          role="checkbox"
        >
          {variable.enabled && (
            <span className="text-xs font-bold" aria-hidden="true">
              ✓
            </span>
          )}
        </button>
      </div>

      <div className="col-span-5" role="gridcell">
        <input
          type="text"
          value={variable.key}
          onChange={handleKeyChange}
          onKeyDown={handleKeyDown}
          placeholder="VAR_NAME"
          className={cn(
            "w-full px-3 py-2 bg-transparent text-foreground text-sm border-none focus:outline-none focus:bg-accent rounded placeholder-muted-foreground transition-colors duration-150",
            "focus:ring-2 focus:ring-primary focus:ring-offset-1",
          )}
          aria-label="Variable name"
          autoComplete="off"
          spellCheck={false}
        />
      </div>

      <div className="col-span-5" role="gridcell">
        <input
          type="text"
          value={variable.value}
          onChange={handleValueChange}
          onKeyDown={handleKeyDown}
          placeholder="value"
          className={cn(
            "w-full px-3 py-2 bg-transparent text-foreground text-sm border-none focus:outline-none focus:bg-accent rounded placeholder-muted-foreground transition-colors duration-150",
            "focus:ring-2 focus:ring-primary focus:ring-offset-1",
          )}
          aria-label="Variable value"
          autoComplete="off"
        />
      </div>

      <div className="col-span-1" role="gridcell">
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
      </div>
    </div>
  );
};

export default VariableRow;
