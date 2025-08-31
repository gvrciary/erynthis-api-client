import { X } from "lucide-react";
import { useCallback, useEffect } from "react";
import Input from "@/components/ui/input";
import { useHttpHeaders } from "@/hooks/use-http-headers";
import type { HttpHeader } from "@/types/http";
import { cn } from "@/utils";
import Tooltip from "../ui/tooltip";

interface HeadersTabProps {
  className?: string;
}

const HeadersTab = ({ className }: HeadersTabProps) => {
  const {
    getSelectedRequest,
    addHeader,
    updateHeaderKey,
    updateHeaderValue,
    toggleHeader,
    removeHeader,
  } = useHttpHeaders();
  const request = getSelectedRequest();

  useEffect(() => {
    const headers = request?.request.headers || [];

    if (
      headers.length === 0 ||
      headers[headers.length - 1].key.trim() ||
      headers[headers.length - 1].value.trim()
    ) {
      addHeader();
    }
  }, [request, addHeader]);

  const handleHeaderKeyChange = useCallback(
    (id: string, key: string) => {
      const headers = request?.request.headers || [];
      updateHeaderKey(id, key);
      const header = headers.find((h) => h.id === id);
      if (header && !header.enabled && key.trim()) {
        toggleHeader(id);
      }
    },
    [request, updateHeaderKey, toggleHeader],
  );

  const handleHeaderValueChange = useCallback(
    (id: string, value: string) => {
      const headers = request?.request.headers || [];
      updateHeaderValue(id, value);
      const header = headers.find((h) => h.id === id);
      if (header && !header.enabled && value.trim()) {
        toggleHeader(id);
      }
    },
    [request, updateHeaderValue, toggleHeader],
  );

  const headers = request?.request.headers || [];

  const renderHeaderRow = useCallback(
    (header: HttpHeader, index: number) => (
      <tr
        key={header.id}
        className="border-b border-border hover:bg-accent transition-colors duration-150"
      >
        <td className="py-3 pr-4 w-1/12">
          <Tooltip
            content={`${header.enabled ? "Disable" : "Enable"} header`}
            side="right"
          >
            <button
              type="button"
              onClick={() => toggleHeader(header.id)}
              className={cn(
                "w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-150 focus:ring-2 focus:ring-primary focus:ring-offset-2",
                header.enabled
                  ? "bg-primary border-primary text-primary-foreground"
                  : "border-border hover:border-primary",
              )}
              title={`${header.enabled ? "Disable" : "Enable"} header`}
              aria-label={`${header.enabled ? "Disable" : "Enable"} header ${header.key || "unnamed"}`}
            >
              {header.enabled && (
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
            value={header.key}
            onChange={(e) => handleHeaderKeyChange(header.id, e.target.value)}
            placeholder="Header name"
            variant="transparent"
            aria-label="Header name"
            autoComplete="off"
            spellCheck={false}
          />
        </td>

        <td className="py-3 pr-4 w-1/12 text-center">
          <span className="text-muted-foreground font-medium">:</span>
        </td>

        <td className="py-3 pr-4 w-4/12">
          <Input
            type="text"
            value={header.value}
            onChange={(e) => handleHeaderValueChange(header.id, e.target.value)}
            placeholder="Header value"
            variant="transparent"
            aria-label="Header value"
            autoComplete="off"
          />
        </td>

        <td className="py-3 w-1/12">
          {index < headers.length - 1 && (
            <Tooltip content="Delete">
              <button
                type="button"
                onClick={() => removeHeader(header.id)}
                className="p-1 rounded text-muted-foreground hover:text-red-600 dark:hover:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-150 focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                title="Delete header"
                aria-label={`Delete header ${header.key || "unnamed"}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Tooltip>
          )}
        </td>
      </tr>
    ),
    [
      handleHeaderKeyChange,
      handleHeaderValueChange,
      toggleHeader,
      removeHeader,
      headers.length,
    ],
  );

  if (!request) return null;

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="p-4">
          <table className="w-full" aria-label="Headers table">
            <thead>
              <tr className="text-xs font-medium text-muted-foreground uppercase tracking-wider border-b border-border">
                <th
                  scope="col"
                  className="py-2 w-1/12 text-left"
                  aria-label="Enabled"
                ></th>
                <th scope="col" className="py-2 w-5/12 text-left pl-3">
                  Header Name
                </th>
                <th
                  scope="col"
                  className="py-2 w-1/12 text-left"
                  aria-label="Separator"
                ></th>
                <th scope="col" className="py-2 w-4/12 text-left pl-3">
                  Header Value
                </th>
                <th
                  scope="col"
                  className="py-2 w-1/12 text-left"
                  aria-label="Actions"
                ></th>
              </tr>
            </thead>
            <tbody>{request.request.headers.map(renderHeaderRow)}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HeadersTab;
