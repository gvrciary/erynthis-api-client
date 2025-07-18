import { CloudUpload, FileWarning, OctagonX, Trash2 } from "lucide-react";
import React, { useMemo, useState } from "react";
import { RESPONSE_TABS } from "../constants";
import { useHttpRequest } from "../hooks/http/useHttpRequest";
import { useHttpStore } from "../store/httpStore";
import type { RequestItem, ResponseHistoryItem } from "../types/data";
import type { HttpError, HttpResponse } from "../types/http";
import { formatFileSize, formatResponseTime, getStatusColor } from "../utils";
import CopyButton from "./CopyButton";
import Dropdown from "./Dropdown";
import SyntaxHighlighter from "./SyntaxHighlighter";

interface ResponsePanelProps {
  className?: string;
}

const VIEW_MODE_OPTIONS = [
  { value: "pretty", label: "Pretty" },
  { value: "raw", label: "Raw" },
];

const EmptyState = React.memo<{
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  subtitle?: string;
}>(({ icon: Icon, title, subtitle }) => (
  <div className="flex items-center justify-center h-full text-muted-foreground">
    <div className="text-center">
      <Icon className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
      <p className="text-lg mb-2">{title}</p>
      {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  </div>
));

const LoadingState = React.memo(() => (
  <div className="p-4 border-b border-border bg-accent">
    <div className="flex items-center space-x-3">
      <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      <span className="text-sm text-foreground">Sending request...</span>
    </div>
  </div>
));

const ResponseHeader = React.memo<{
  responseData: HttpResponse | null;
  errorData: HttpError | null;
  responseSize: number;
  onClearResponse: () => void;
}>(({ responseData, errorData, responseSize, onClearResponse }) => (
  <div className="p-4 border-b border-border bg-muted flex-shrink-0">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center space-x-4">
        <div
          className={`flex items-center space-x-2 px-2 py-1 rounded-md ${getStatusColor(
            responseData?.status || errorData?.status || 0,
          )}`}
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
          className="p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          title="Clear responses"
        >
          <OctagonX className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
));

const ResponseHistory = React.memo<{
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
      <div className="p-4 border-b border-border bg-muted flex-shrink-0">
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
              className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-red-600 transition-colors"
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

const ResponseTabs = React.memo<{
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
    <div className="flex border-b border-border bg-muted flex-shrink-0">
      {tabs.map((tab) => (
        <button
          type="button"
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === tab.id
              ? "text-foreground border-b-2 border-primary bg-card"
              : "text-muted-foreground hover:text-foreground hover:bg-accent"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
});

const BodyTab = React.memo<{
  responseData: HttpResponse | null;
  bodyViewMode: "pretty" | "raw";
  onViewModeChange: (mode: "pretty" | "raw") => void;
  onDeleteResponse: () => void;
  requestUrl: string;
}>(
  ({
    responseData,
    bodyViewMode,
    onViewModeChange,
    onDeleteResponse,
    requestUrl,
  }) => {
    const processHtmlContent = (htmlContent: string): string => {
      if (!requestUrl) return htmlContent;

      if (htmlContent.includes("<head>")) {
        return htmlContent.replace(
          /<head>/gi,
          `<head><base href="${requestUrl}"/>`,
        );
      }

      if (htmlContent.includes("<html>")) {
        return htmlContent.replace(
          /<html>/gi,
          `<html><head><base href="${requestUrl}"/></head>`,
        );
      }

      return htmlContent;
    };

    const getContentType = (): string => {
      if (!responseData?.headers["content-type"]) return "text/plain";
      const contentType: string = responseData.headers["content-type"];
      return contentType || "text/plain";
    };

    const isHtmlContent = (): boolean => {
      if (!responseData) return false;
      const contentType = getContentType();
      const body = responseData.body;
      return (
        contentType.includes("text/html") ||
        (body
          ? body.trim().toLowerCase().startsWith("<!doctype html>") ||
            body.trim().toLowerCase().startsWith("<html")
          : false)
      );
    };

    if (!responseData?.body) {
      return <EmptyState icon={FileWarning} title="No response body" />;
    }

    const isHtml = isHtmlContent();

    if (isHtml && bodyViewMode === "pretty") {
      return (
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-3 border-b border-border bg-muted flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-28">
                <Dropdown
                  options={VIEW_MODE_OPTIONS}
                  value={bodyViewMode}
                  onChange={(value) =>
                    onViewModeChange(value as "pretty" | "raw")
                  }
                  className="w-full"
                  buttonClassName="py-1 px-2 text-xs min-w-[60px]"
                  optionsClassName="z-[60]"
                  showCheck={false}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <CopyButton
                content={responseData?.body || ""}
                title="Copy response body"
                className="px-2 py-1"
              />
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <iframe
              srcDoc={processHtmlContent(responseData?.body || "")}
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin"
              title="HTML Preview"
            />
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-3 border-b border-border bg-muted flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-28">
              <Dropdown
                options={VIEW_MODE_OPTIONS}
                value={bodyViewMode}
                onChange={(value) =>
                  onViewModeChange(value as "pretty" | "raw")
                }
                className="w-full"
                buttonClassName="py-1 px-2 text-xs min-w-[60px]"
                optionsClassName="z-[60]"
                showCheck={false}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <CopyButton
              content={responseData?.body || ""}
              title="Copy response body"
              className="px-2 py-1"
            />
            <button
              type="button"
              onClick={onDeleteResponse}
              className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-red-600 transition-colors"
              title="Delete response"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="flex-1 min-h-0 overflow-hidden">
          <SyntaxHighlighter
            code={
              bodyViewMode === "pretty"
                ? responseData?.body_pretty
                : responseData?.body
            }
            language={
              isHtmlContent()
                ? "html"
                : getContentType().includes("json")
                  ? "json"
                  : "text"
            }
            className="h-full p-4"
          />
        </div>
      </div>
    );
  },
);

const HeadersTab = React.memo<{
  responseData: HttpResponse | null;
}>(({ responseData }) => {
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

const ResponsePanel: React.FC<ResponsePanelProps> = ({ className }) => {
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
          <BodyTab
            responseData={responseData}
            bodyViewMode={bodyViewMode}
            onViewModeChange={setBodyViewMode}
            onDeleteResponse={handleDeleteResponse}
            requestUrl={requestItem?.request.url || ""}
          />
        );
      case "headers":
        return <HeadersTab responseData={responseData} />;
      default:
        return (
          <BodyTab
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
    <div className={`flex flex-col bg-card h-full ${className}`}>
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
};

export default React.memo(ResponsePanel);
