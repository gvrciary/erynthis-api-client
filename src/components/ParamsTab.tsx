import { Check, Link, X } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { useHttpParams } from "../hooks/http/useHttpParams";
import type { HttpParam } from "../types/http";

interface ParamsTabProps {
  className?: string;
}

const ParamsTab: React.FC<ParamsTabProps> = ({ className }) => {
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

  if (!request) return null;

  const handleParamKeyChange = (id: string, key: string) => {
    const params = request.request.params || [];
    updateParamKey(id, key);
    const param = params.find((p) => p.id === id);
    if (param && !param.enabled && key.trim()) {
      toggleParam(id);
    }
  };

  const handleParamValueChange = (id: string, value: string) => {
    const params = request.request.params || [];
    updateParamValue(id, value);
    const param = params.find((p) => p.id === id);
    if (param && !param.enabled && value.trim()) {
      toggleParam(id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, paramId: string) => {
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
  };

  const isValidParamName = (name: string): boolean => {
    const paramNameRegex = /^[a-zA-Z0-9_-]+$/;
    return paramNameRegex.test(name);
  };

  const params = request?.request.params || [];
  const enabledCount = params.filter((p) => p.enabled).length;
  const totalCount = params.filter(
    (p) => p.key.trim() || p.value.trim(),
  ).length;

  const renderParamRow = (param: HttpParam, index: number) => (
    <div
      key={param.id}
      className={`group relative p-3 rounded-lg border transition-all duration-200 ${
        param.enabled
          ? "bg-card border-border hover:border-primary hover:bg-accent"
          : "bg-muted border-border opacity-60"
      }`}
    >
      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={() => toggleParam(param.id)}
          className={`flex-shrink-0 w-4 h-4 rounded border-2 transition-all duration-200 flex items-center justify-center ${
            param.enabled
              ? "bg-primary border-primary"
              : "bg-transparent border-border hover:border-primary"
          }`}
        >
          {param.enabled && (
            <Check
              className="h-2.5 w-2.5 text-primary-foreground"
              strokeWidth={3}
            />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <input
            type="text"
            value={param.key}
            onChange={(e) => handleParamKeyChange(param.id, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, param.id)}
            onFocus={() => setFocusedParam(param.id)}
            onBlur={() => setFocusedParam(null)}
            placeholder="Parameter name"
            className={`w-full px-3 py-2 bg-background border rounded-md text-foreground placeholder-muted-foreground transition-all duration-200 outline-none text-sm  ${
              focusedParam === param.id
                ? "border-primary focus-ring"
                : isValidParamName(param.key) || !param.key
                  ? "border-border hover:border-primary"
                  : "border-red-500 ring-1 ring-red-500"
            }`}
          />
        </div>

        <div className="flex-shrink-0 text-muted-foreground font-medium ">
          =
        </div>

        <div className="flex-1 min-w-0">
          <input
            type="text"
            value={param.value}
            onChange={(e) => handleParamValueChange(param.id, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, param.id)}
            onFocus={() => setFocusedParam(param.id)}
            onBlur={() => setFocusedParam(null)}
            placeholder="Parameter value"
            className={`w-full px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder-muted-foreground transition-all duration-200 outline-none text-sm  ${
              focusedParam === param.id
                ? "border-primary focus-ring"
                : "hover:border-primary"
            }`}
          />
        </div>

        {index < params.length - 1 && (
          <button
            type="button"
            onClick={() => removeParam(param.id)}
            className="flex-shrink-0 p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-red-100 text-muted-foreground hover:text-red-600 transition-all duration-200"
            title="Remove parameter"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {param.key && !isValidParamName(param.key) && (
        <div className="mt-2 text-xs text-red-600 flex items-center space-x-2 ">
          <div className="w-1 h-1 bg-red-600 rounded-full"></div>
          <span>
            Invalid parameter name. Use only alphanumeric characters, hyphens,
            and underscores.
          </span>
        </div>
      )}

      <div className="absolute top-2 right-2 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200 ">
        {index + 1}
      </div>
    </div>
  );

  return (
    <div className={`flex flex-col h-full bg-card ${className}`}>
      <div className="p-4 border-b border-border flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h3 className="text-sm font-medium text-foreground ">
              Query Parameters
            </h3>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground ">
              <span className="px-2 py-1 bg-accent text-accent-foreground rounded font-medium">
                {enabledCount} enabled
              </span>
              <span className="px-2 py-1 bg-muted text-muted-foreground rounded">
                {totalCount} total
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-2">{params.map(renderParamRow)}</div>
        </div>

        <div className="p-4 border-t border-border bg-muted flex-shrink-0">
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