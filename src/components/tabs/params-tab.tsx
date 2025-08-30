import { Check, Link, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useHttpParams } from "@/hooks/http/useHttpParams";
import type { HttpParam } from "@/types/http";
import { cn } from "@/utils";

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
  const [focusedParam, setFocusedParam] = useState<string | null>(null);
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

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, paramId: string) => {
      const params = request?.request.params || [];
      if (e.key === "Enter") {
        e.preventDefault();
        const currentIndex = params.findIndex((p) => p.id === paramId);
        const nextParam = params[currentIndex + 1];
        if (nextParam) {
          setFocusedParam(nextParam.id);
        }
      } else if (e.key === "Escape") {
        setFocusedParam(null);
      }
    },
    [request],
  );

  const isValidParamName = useCallback((name: string): boolean => {
    const paramNameRegex = /^[a-zA-Z0-9_-]+$/;
    return paramNameRegex.test(name);
  }, []);

  const params = request?.request.params || [];
  const enabledCount = params.filter((p) => p.enabled).length;
  const totalCount = params.filter(
    (p) => p.key.trim() || p.value.trim(),
  ).length;

  const renderParamRow = useCallback(
    (param: HttpParam, index: number) => (
      <div key={param.id}>
        <div
          className="grid grid-cols-12 gap-4 items-center py-3 border-b border-border hover:bg-accent transition-colors duration-150"
          role="row"
        >
          <div className="col-span-1" role="gridcell">
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
              aria-checked={param.enabled}
              role="checkbox"
            >
              {param.enabled && (
                <span className="text-xs font-bold" aria-hidden="true">
                  ✓
                </span>
              )}
            </button>
          </div>

          <div className="col-span-5" role="gridcell">
            <input
              type="text"
              value={param.key}
              onChange={(e) => handleParamKeyChange(param.id, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, param.id)}
              onFocus={() => setFocusedParam(param.id)}
              onBlur={() => setFocusedParam(null)}
              placeholder="Parameter name"
              className={cn(
                "w-full px-3 py-2 bg-transparent text-foreground text-sm border-none focus:outline-none focus:bg-accent rounded placeholder-muted-foreground transition-colors duration-150",
                "focus:ring-2 focus:ring-primary focus:ring-offset-1",
                param.key && !isValidParamName(param.key) && "text-red-600",
              )}
              aria-label="Parameter name"
              autoComplete="off"
              spellCheck={false}
            />
          </div>

          <div className="col-span-1 flex justify-center" role="gridcell">
            <span className="text-muted-foreground font-medium">=</span>
          </div>

          <div className="col-span-4" role="gridcell">
            <input
              type="text"
              value={param.value}
              onChange={(e) => handleParamValueChange(param.id, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, param.id)}
              onFocus={() => setFocusedParam(param.id)}
              onBlur={() => setFocusedParam(null)}
              placeholder="Parameter value"
              className={cn(
                "w-full px-3 py-2 bg-transparent text-foreground text-sm border-none focus:outline-none focus:bg-accent rounded placeholder-muted-foreground transition-colors duration-150",
                "focus:ring-2 focus:ring-primary focus:ring-offset-1",
              )}
              aria-label="Parameter value"
              autoComplete="off"
            />
          </div>

          <div className="col-span-1" role="gridcell">
            {index < params.length - 1 && (
              <button
                type="button"
                onClick={() => removeParam(param.id)}
                className="p-1 rounded text-muted-foreground hover:text-red-600 dark:hover:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-150 focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                title="Delete parameter"
                aria-label={`Delete parameter ${param.key || "unnamed"}`}
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {param.key && !isValidParamName(param.key) && (
          <div className="ml-16 mt-1 text-xs text-red-600 flex items-center space-x-2">
            <div className="w-1 h-1 bg-red-600 rounded-full"></div>
            <span>
              Invalid parameter name. Use only alphanumeric characters, hyphens,
              and underscores.
            </span>
          </div>
        )}
      </div>
    ),
    [
      handleParamKeyChange,
      handleParamValueChange,
      handleKeyDown,
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
            <div
              className="grid grid-cols-12 gap-4 text-xs font-medium text-muted-foreground uppercase tracking-wider border-b border-border pb-2 mb-4"
              role="row"
              aria-label="Table header"
            >
              <div
                className="col-span-1"
                role="columnheader"
                aria-label="Enabled"
              >
              </div>
              <div className="col-span-5" role="columnheader">
                Parameter Name
              </div>
              <div
                className="col-span-1"
                role="columnheader"
                aria-label="Separator"
              >
              </div>
              <div className="col-span-4" role="columnheader">
                Parameter Value
              </div>
              <div
                className="col-span-1"
                role="columnheader"
                aria-label="Actions"
              >
              </div>
            </div>

            <div role="grid" aria-label="Parameters table">
              {params.map(renderParamRow)}
            </div>
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
