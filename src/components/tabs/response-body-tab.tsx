import { FileWarning, Trash2 } from "lucide-react";
import { memo } from "react";
import SyntaxHighlighter from "@/components/syntax-highlighter";
import CopyButton from "@/components/ui/copy-button";
import Dropdown from "@/components/ui/Dropdown";
import EmptyState from "@/components/ui/empty-state";
import { VIEW_MODE_OPTIONS } from "@/constants/index";
import type { HttpResponse } from "@/types/http";

interface ResponseBodyTabProps {
  responseData: HttpResponse | null;
  bodyViewMode: "pretty" | "raw";
  onViewModeChange: (mode: "pretty" | "raw") => void;
  onDeleteResponse: () => void;
  requestUrl: string;
}

const ResponseBodyTab = memo(
  ({
    responseData,
    bodyViewMode,
    onViewModeChange,
    onDeleteResponse,
    requestUrl,
  }: ResponseBodyTabProps) => {
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
                  onChange={(value: string) =>
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
                onChange={(value: string) =>
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

ResponseBodyTab.displayName = "ResponseBodyTab";
export default ResponseBodyTab;
