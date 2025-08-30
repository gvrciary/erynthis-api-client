import type { Variable } from "@/types/data";
import VariableRow from "./variable-row";

interface VariablesTableProps {
  variables: Variable[];
  onKeyChange: (id: string, key: string) => void;
  onValueChange: (id: string, value: string) => void;
  onToggleEnabled: (id: string, enabled: boolean) => void;
  onDelete: (id: string) => void;
}

const VariablesTable = ({
  variables,
  onKeyChange,
  onValueChange,
  onToggleEnabled,
  onDelete,
}: VariablesTableProps) => {
  const hasVariables = variables.length > 0;

  if (!hasVariables) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-sm mb-2">No variables yet</p>
        <p className="text-xs">Variables will appear here as you add them</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        className="grid grid-cols-12 gap-4 text-xs font-medium text-muted-foreground uppercase tracking-wider border-b border-border pb-2"
        role="row"
        aria-label="Table header"
      >
        <div className="col-span-1" role="columnheader" aria-label="Enabled">
        </div>
        <div className="col-span-5" role="columnheader">
          Variable
        </div>
        <div className="col-span-5" role="columnheader">
          Value
        </div>
        <div className="col-span-1" role="columnheader" aria-label="Actions">
        </div>
      </div>

      <div role="grid" aria-label="Variables table">
        {variables.map((variable, index) => (
          <VariableRow
            key={variable.id}
            variable={variable}
            index={index}
            isLast={index === variables.length - 1}
            onKeyChange={onKeyChange}
            onValueChange={onValueChange}
            onToggleEnabled={onToggleEnabled}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default VariablesTable;
