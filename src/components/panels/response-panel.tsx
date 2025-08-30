import { CloudUpload, OctagonX, Trash2 } from "lucide-react";
import { memo, useMemo, useState } from "react";
import ResponseBodyTab from "@/components/tabs/response-body-tab";
import ResponseHeadersTab from "@/components/tabs/response-headers-tab";
import Dropdown from "@/components/ui/drop-down";
import EmptyState from "@/components/ui/empty-state";
import { RESPONSE_TABS } from "@/constants";
import { useHttpRequest } from "@/hooks/http/useHttpRequest";
import { useHttpStore } from "@/store/http-store";
import type { RequestItem, ResponseHistoryItem } from "@/types/data";
import type { HttpError, HttpResponse } from "@/types/http";
import {
  cn,
  formatFileSize,
  formatResponseTime,
  getStatusColor,
} from "@/utils";

interface ResponsePanelProps {
  className?: string;
}

const LoadingState = () => (
  <div className="p-4 border-b border-border bg-accent">
    <div className="flex items-center space-x-3">
      <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      <span className="text-sm text-foreground">Sending request...</span>
    </div>
  </div>
);

const ResponseHeader = memo<{
  responseData: HttpResponse | null;
  errorData: HttpError | null;
  responseSize: number;
  onClearResponse: () => void;
}>(({ responseData, errorData, responseSize, onClearResponse }) => (
  <div className="px-3 pt-4 pb-2 border-b border-border flex-shrink-0">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center space-x-4">
        <div
          className={cn(
            "flex items-center space-x-2 px-2 py-1 rounded-md",
            getStatusColor(responseData?.status || errorData?.status || 0),
          )}
        >
          <span className="font-medium">
            {responseData?.status || errorData?.status}
          </span>
          <span className="text-sm">
            {responseData?.status_text || errorData?.error}
          </span>
        </div>
        {responseData && (
          <div className="flex items-center space-x-3 text-sm text-muted-foreground">
            <span>{formatResponseTime(responseData.response_time)}</span>
            <span>•</span>
            <span>{formatFileSize(responseSize)}</span>
          </div>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={onClearResponse}
          className="p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground"
          title="Clear responses"
        >
          <OctagonX className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
));

const ResponseHistory = memo<{
  requestItem: RequestItem;
  selectedResponseId: string;
  selectedResponse: RequestItem["responses"][number] | undefined;
  onResponseSelect: (id: string) => void;
  onDeleteResponse: (requestId: string, responseId: string) => void;
}>(
  ({
    requestItem,
    selectedResponseId,
    selectedResponse,
    onResponseSelect,
    onDeleteResponse,
  }) => {
    const historyOptions = useMemo(() => {
      if (!requestItem?.responses || requestItem.responses.length === 0)
        return [];

      return requestItem.responses.map((response: ResponseHistoryItem) => ({
        value: response.id,
        label: `${response.response?.status || response.error?.status || 404} - ${formatResponseTime(response.response?.response_time ?? 0)}`,
      }));
    }, [requestItem?.responses]);

    if (!requestItem || requestItem.responses.length <= 1) return null;

    return (
      <div className="p-4 border-b border-border bg-background flex-shrink-0">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">History:</span>
          <div className="w-48">
            <Dropdown
              options={historyOptions}
              value={selectedResponseId || requestItem.responses[0].id}
              onChange={onResponseSelect}
              className="w-full"
              buttonClassName="py-1 px-2 text-xs"
              optionsClassName="z-[60]"
              showCheck={false}
            />
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => {
                if (requestItem && selectedResponse) {
                  onDeleteResponse(requestItem.id, selectedResponse.id);
                }
              }}
              className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-red-600"
              title="Delete response"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  },
);

const ResponseTabs = memo<{
  responseData: HttpResponse | null;
  activeTab: string;
  onTabChange: (tabId: string) => void;
}>(({ responseData, activeTab, onTabChange }) => {
  const tabs = useMemo(() => {
    if (!responseData) return [];
    const headerCount = responseData?.headers
      ? Object.keys(responseData.headers).length
      : 0;
    return RESPONSE_TABS(headerCount);
  }, [responseData]);

  if (!responseData) return null;

  return (
    <div className="flex border-b border-border flex-shrink-0">
      {tabs.map((tab) => (
        <button
          type="button"
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "px-4 py-2 text-sm font-medium",
            activeTab === tab.id
              ? "text-foreground border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground hover:bg-accent",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
});

const ResponsePanel = memo(({ className }: ResponsePanelProps) => {
  const {
    getSelectedRequest,
    isLoading,
    clearResponse,
    deleteResponse,
    setActiveResponseTab,
  } = useHttpRequest();
  const { selectResponse } = useHttpStore();
  const [bodyViewMode, setBodyViewMode] = useState<"pretty" | "raw">("pretty");

  const requestItem = getSelectedRequest();
  const selectedResponseId = requestItem?.selectedResponseId;
  const selectedResponse = useMemo(
    () =>
      requestItem?.responses?.find((r) => r.id === selectedResponseId) ||
      requestItem?.responses?.[0],
    [requestItem?.responses, selectedResponseId],
  );

  const responseData = selectedResponse?.response || null;
  const errorData = selectedResponse?.error || null;

  const responseSize = useMemo(() => {
    return responseData?.body ? new Blob([responseData.body]).size : 0;
  }, [responseData?.body]);

  const handleResponseSelect = (responseId: string) => {
    if (requestItem) {
      selectResponse(requestItem.id, responseId);
    }
  };

  const handleDeleteResponse = () => {
    if (requestItem && selectedResponse) {
      deleteResponse(requestItem.id, selectedResponse.id);
    }
  };

  const renderTabContent = () => {
    switch (requestItem?.request.activeResponseTab) {
      case "body":
        return (
          <ResponseBodyTab
            responseData={responseData}
            bodyViewMode={bodyViewMode}
            onViewModeChange={setBodyViewMode}
            onDeleteResponse={handleDeleteResponse}
            requestUrl={requestItem?.request.url || ""}
          />
        );
      case "headers":
        return <ResponseHeadersTab responseData={responseData} />;
      default:
        return (
          <ResponseBodyTab
            responseData={responseData}
            bodyViewMode={bodyViewMode}
            onViewModeChange={setBodyViewMode}
            onDeleteResponse={handleDeleteResponse}
            requestUrl={requestItem?.request.url || ""}
          />
        );
    }
  };

  if (!requestItem) return null;

  if (isLoading) {
    return <LoadingState />;
  }

  if (!responseData && !errorData && requestItem.responses.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground p-8">
        <EmptyState
          icon={CloudUpload}
          title="No response yet"
          subtitle="Send a request to see the response"
        />
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {(responseData || errorData) && (
        <>
          <ResponseHeader
            responseData={responseData}
            errorData={errorData}
            responseSize={responseSize}
            onClearResponse={clearResponse}
          />
          {requestItem && requestItem.responses.length > 1 && (
            <ResponseHistory
              requestItem={requestItem}
              selectedResponseId={selectedResponseId || ""}
              selectedResponse={selectedResponse}
              onResponseSelect={handleResponseSelect}
              onDeleteResponse={deleteResponse}
            />
          )}
        </>
      )}

      {responseData && (
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          <ResponseTabs
            responseData={responseData}
            activeTab={requestItem.request.activeResponseTab}
            onTabChange={setActiveResponseTab}
          />
          <div className="flex-1 min-h-0 overflow-hidden">
            {renderTabContent()}
          </div>
        </div>
      )}
    </div>
  );
});

export default ResponsePanel;
