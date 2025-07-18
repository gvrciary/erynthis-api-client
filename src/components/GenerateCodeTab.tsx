import { Code2 } from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";
import { useHttpRequest } from "../hooks/http/useHttpRequest";
import { codeTemplates } from "../utils/codeTemplates";
import CopyButton from "./CopyButton";
import Dropdown from "./Dropdown";
import SyntaxHighlighter from "./SyntaxHighlighter";

interface GenerateCodeTabProps {
  className?: string;
}

const GenerateCodeTab: React.FC<GenerateCodeTabProps> = ({ className }) => {
  const { getSelectedRequest } = useHttpRequest();
  const [selectedTemplateId, setSelectedTemplateId] = useState("curl");

  const request = getSelectedRequest();

  const templateOptions = useMemo(() => {
    return codeTemplates.map((template) => ({
      value: template.id,
      label: template.name,
    }));
  }, []);

  const generatedCode = useMemo(() => {
    if (!request) return "";

    const template = codeTemplates.find((t) => t.id === selectedTemplateId);
    if (!template) return "";

    return template.generate(request.request);
  }, [request, selectedTemplateId]);

  const currentTemplate = codeTemplates.find(
    (t) => t.id === selectedTemplateId,
  );

  if (!request) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="text-center">
          <Code2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-sm">No request selected</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full bg-card ${className}`}>
      <div className="p-4 border-b border-border bg-muted flex-shrink-0 relative z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Code2 className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                Generate Code
              </span>
            </div>
            <div className="w-48">
              <Dropdown
                options={templateOptions}
                value={selectedTemplateId}
                onChange={setSelectedTemplateId}
                className="w-full"
                buttonClassName="py-1 px-3 text-sm"
                optionsClassName="z-[60]"
                showCheck={false}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <CopyButton
              content={generatedCode}
              title="Copy code"
              className="px-3 py-1"
            />
          </div>
        </div>

        {currentTemplate && (
          <div className="mt-2 text-xs text-muted-foreground">
            Code to execute this request in {currentTemplate.name}
          </div>
        )}
      </div>

      <div className="flex-1 min-h-0">
        {!request.request.url.trim() ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <Code2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">NO URL AVAILABLE</p>
              <p className="text-sm">
                Enter a URL in the request to generate code
              </p>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col">
            <SyntaxHighlighter
              code={generatedCode}
              language={currentTemplate?.language || "text"}
              className="flex-1 min-h-0"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateCodeTab;
