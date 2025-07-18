import { FileWarning } from "lucide-react";
import { memo } from "react";
import CopyButton from "@/components/ui/copy-button";
import EmptyState from "@/components/ui/empty-state";
import type { HttpResponse } from "@/types/http";

interface ResponseHeadersTabProps {
  responseData: HttpResponse | null;
}

const ResponseHeadersTab = memo(({ responseData } : ResponseHeadersTabProps) => {
  if (!responseData?.headers) {
    return <EmptyState icon={FileWarning} title="No response headers" />;
  }

  return (
    <div className="p-4 space-y-2 h-full overflow-auto">
      {Object.entries(responseData?.headers || {}).map(([key, value]) => (
        <div
          key={key}
          className="flex items-center justify-between p-3 bg-muted rounded-md hover:bg-accent group transition-colors border border-border"
        >
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <span className="text-sm font-medium text-foreground flex-shrink-0">
              {key}
            </span>
            <span className="text-muted-foreground">:</span>
            <span className="text-sm text-muted-foreground truncate">
              {value}
            </span>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <CopyButton
              content={`${key}: ${value}`}
              title="Copy header"
              size="sm"
              variant="ghost"
            />
          </div>
        </div>
      ))}
    </div>
  );
});

ResponseHeadersTab.displayName = "ResponseHeadersTab";
export default ResponseHeadersTab;
