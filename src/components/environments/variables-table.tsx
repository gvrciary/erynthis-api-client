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
      <table className="w-full" aria-label="Variables table">
        <thead>
          <tr className="text-xs font-medium text-muted-foreground uppercase tracking-wider border-b border-border">
            <th
              scope="col"
              className="py-2 w-1/12 text-left"
              aria-label="Enabled"
            ></th>
            <th scope="col" className="py-2 w-5/12 text-left">
              Variable
            </th>
            <th scope="col" className="py-2 w-5/12 text-left">
              Value
            </th>
            <th
              scope="col"
              className="py-2 w-1/12 text-left"
              aria-label="Actions"
            ></th>
          </tr>
        </thead>
        <tbody>
          {variables.map((variable, index) => (
            <VariableRow
              key={variable.id}
              variable={variable}
              isLast={index === variables.length - 1}
              onKeyChange={onKeyChange}
              onValueChange={onValueChange}
              onToggleEnabled={onToggleEnabled}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VariablesTable;
