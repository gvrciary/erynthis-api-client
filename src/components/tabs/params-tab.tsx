import { Link, X } from "lucide-react";
import { useCallback, useEffect } from "react";
import Input from "@/components/ui/input";
import { useHttpParams } from "@/hooks/http/useHttpParams";
import type { HttpParam } from "@/types/http";
import { cn } from "@/utils";
import Tooltip from "../ui/tooltip";

interface ParamsTabProps {
  className?: string;
}

const ParamsTab = ({ className }: ParamsTabProps) => {
  const {
    getSelectedRequest,
    addParam,
    removeParam,
    toggleParam,
    updateParamKey,
    updateParamValue,
  } = useHttpParams();

  const request = getSelectedRequest();

  useEffect(() => {
    const params = request?.request.params || [];
    if (
      params.length === 0 ||
      params[params.length - 1].key.trim() ||
      params[params.length - 1].value.trim()
    ) {
      addParam();
    }
  }, [request, addParam]);

  const handleParamKeyChange = useCallback(
    (id: string, key: string) => {
      const params = request?.request.params || [];
      updateParamKey(id, key);
      const param = params.find((p) => p.id === id);
      if (param && !param.enabled && key.trim()) {
        toggleParam(id);
      }
    },
    [request, updateParamKey, toggleParam],
  );

  const handleParamValueChange = useCallback(
    (id: string, value: string) => {
      const params = request?.request.params || [];
      updateParamValue(id, value);
      const param = params.find((p) => p.id === id);
      if (param && !param.enabled && value.trim()) {
        toggleParam(id);
      }
    },
    [request, updateParamValue, toggleParam],
  );

  const isValidParamName = useCallback((name: string): boolean => {
    const paramNameRegex = /^[a-zA-Z0-9_-]+$/;
    return paramNameRegex.test(name);
  }, []);

  const params = request?.request.params || [];

  const renderParamRow = useCallback(
    (param: HttpParam, index: number) => (
      <>
        <tr
          key={param.id}
          className="border-b border-border hover:bg-accent transition-colors duration-150"
        >
          <td className="py-3 pr-4 w-1/12">
            <Tooltip
              content={`${param.enabled ? "Disable" : "Enable"} parameter`}
              side="right"
            >
              <button
                type="button"
                onClick={() => toggleParam(param.id)}
                className={cn(
                  "w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-150 focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  param.enabled
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-border hover:border-primary",
                )}
                title={`${param.enabled ? "Disable" : "Enable"} parameter`}
                aria-label={`${param.enabled ? "Disable" : "Enable"} parameter ${param.key || "unnamed"}`}
              >
                {param.enabled && (
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
              value={param.key}
              onChange={(e) => handleParamKeyChange(param.id, e.target.value)}
              placeholder="Parameter name"
              variant="transparent"
              error={param.key ? !isValidParamName(param.key) : false}
              aria-label="Parameter name"
              autoComplete="off"
              spellCheck={false}
            />
          </td>

          <td className="py-3 pr-4 w-1/12 text-center">
            <span className="text-muted-foreground font-medium">=</span>
          </td>

          <td className="py-3 pr-4 w-4/12">
            <Input
              type="text"
              value={param.value}
              onChange={(e) => handleParamValueChange(param.id, e.target.value)}
              placeholder="Parameter value"
              variant="transparent"
              aria-label="Parameter value"
              autoComplete="off"
            />
          </td>

          <td className="py-3 w-1/12">
            {index < params.length - 1 && (
              <Tooltip content="Delete">
                <button
                  type="button"
                  onClick={() => removeParam(param.id)}
                  className="p-1 rounded text-muted-foreground hover:text-red-600 dark:hover:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-150 focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                  title="Delete parameter"
                  aria-label={`Delete parameter ${param.key || "unnamed"}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Tooltip>
            )}
          </td>
        </tr>

        {param.key && !isValidParamName(param.key) && (
          <tr>
            <td colSpan={5} className="py-1 pl-16">
              <div className="text-xs text-red-600 flex items-center space-x-2">
                <div className="w-1 h-1 bg-red-600 rounded-full"></div>
                <span>
                  Invalid parameter name. Use only alphanumeric characters,
                  hyphens, and underscores.
                </span>
              </div>
            </td>
          </tr>
        )}
      </>
    ),
    [
      handleParamKeyChange,
      handleParamValueChange,
      isValidParamName,
      toggleParam,
      removeParam,
      params.length,
    ],
  );

  if (!request) return null;

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <table className="w-full" aria-label="Parameters table">
              <thead>
                <tr className="text-xs font-medium text-muted-foreground uppercase tracking-wider border-b border-border">
                  <th
                    scope="col"
                    className="py-2 w-1/12 text-left"
                    aria-label="Enabled"
                  ></th>
                  <th scope="col" className="py-2 w-5/12 text-left pl-3">
                    Parameter Name
                  </th>
                  <th
                    scope="col"
                    className="py-2 w-1/12 text-left"
                    aria-label="Separator"
                  ></th>
                  <th scope="col" className="py-2 w-4/12 text-left pl-3">
                    Parameter Value
                  </th>
                  <th
                    scope="col"
                    className="py-2 w-1/12 text-left"
                    aria-label="Actions"
                  ></th>
                </tr>
              </thead>
              <tbody>{params.map(renderParamRow)}</tbody>
            </table>
          </div>
        </div>

        <div className="p-4 border-t border-border flex-shrink-0">
          <div className="flex items-center space-x-2 mb-2">
            <Link className="h-3.5 w-3.5 text-muted-foreground" />
            <h4 className="text-xs font-medium text-foreground ">
              Generated URL
            </h4>
          </div>
          <div className="p-3 bg-background rounded-lg border border-border">
            <code className="text-xs text-primary break-all ">
              {request.request.url ||
                "Enter a URL to see the generated query string"}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParamsTab;
