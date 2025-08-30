import { FileText, Upload } from "lucide-react";
import { useCallback, useRef } from "react";
import Dropdown from "@/components/ui/drop-down";
import { BODY_TYPES, FORM_SUBTYPES, TEXT_SUBTYPES } from "@/constants";
import { useHttpRequest } from "@/hooks/http/useHttpRequest";
import type {
  BodyType,
  DropdownOption,
  FormSubtype,
  TextSubtype,
} from "@/types/data";
import { cn } from "@/utils";

interface BodyTabProps {
  className?: string;
}

const BodyTab = ({ className }: BodyTabProps) => {
  const {
    getSelectedRequest,
    setBody,
    setBodyType,
    setTextSubtype,
    setFormSubtype,
    setBinaryFile,
  } = useHttpRequest();
  const request = getSelectedRequest();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { bodyType, textSubtype, formSubtype, binaryFile } =
    request?.request ?? {
      bodyType: "none" as BodyType,
      textSubtype: "json" as TextSubtype,
      formSubtype: "urlencoded" as FormSubtype,
      binaryFile: null,
    };

  const handleBodyChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setBody(e.target.value);
    },
    [setBody],
  );

  const handleTypeChange = useCallback(
    (type: string) => {
      setBodyType(type as BodyType);

      if (type === "none") {
        setBody("");
        setBinaryFile(null);
      }

      if (type !== "binary" && binaryFile) {
        setBinaryFile(null);
      }
    },
    [setBodyType, setBody, setBinaryFile, binaryFile],
  );

  const handleSubtypeChange = useCallback(
    (subtype: string) => {
      if (bodyType === "text") {
        setTextSubtype(subtype as TextSubtype);
      } else if (bodyType === "form") {
        setFormSubtype(subtype as FormSubtype);
      }
    },
    [bodyType, setTextSubtype, setFormSubtype],
  );

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setBinaryFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          const base64Content = result.split(",")[1] || result;
          setBody(base64Content);
        };
        reader.readAsDataURL(file);
      }
    },
    [setBinaryFile, setBody],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const textarea = e.currentTarget;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const value = textarea.value;

        setBody(`${value.substring(0, start)}  ${value.substring(end)}`);
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 2;
        }, 0);
      }
    },
    [setBody],
  );

  const getCurrentSubtype = () =>
    bodyType === "text" ? textSubtype : bodyType === "form" ? formSubtype : "";
  const getSubtypeOptions = () =>
    bodyType === "text"
      ? TEXT_SUBTYPES
      : bodyType === "form"
        ? FORM_SUBTYPES
        : [];
  const shouldShowSubtypeDropdown = () =>
    bodyType === "text" || bodyType === "form";

  if (!request) {
    return (
      <div className={cn("flex flex-col h-full", className)}>
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <p>No request selected</p>
        </div>
      </div>
    );
  }

  const renderTextArea = (placeholder: string) => (
    <textarea
      ref={textareaRef}
      value={request.request.body}
      onChange={handleBodyChange}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      className="w-full h-full min-h-[400px] p-4 bg-background border-0 text-foreground placeholder-muted-foreground text-sm resize-none outline-none"
      spellCheck={false}
    />
  );

  const getBodyTypeContent = () => {
    switch (bodyType) {
      case "none":
        return (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8">
            <FileText className="h-12 w-12 mb-3 text-muted-foreground opacity-50" />
            <p className="text-sm">No body content</p>
            <p className="text-xs text-center mt-1 text-muted-foreground ">
              This request will be sent without body
            </p>
          </div>
        );

      case "text":
        return (
          <div className="flex flex-col h-full">
            <div className="flex-1 min-h-0">
              {renderTextArea(
                textSubtype === "json"
                  ? '{\n  "key": "value"\n}'
                  : textSubtype === "xml"
                    ? '<?xml version="1.0"?>\n<root>\n  <element>value</element>\n</root>'
                    : textSubtype === "yaml"
                      ? "key: value\narray:\n  - item1\n  - item2"
                      : "Enter raw text content...",
              )}
            </div>
          </div>
        );

      case "form":
        return (
          <div className="flex flex-col h-full">
            <div className="flex-1 min-h-0">
              {renderTextArea(
                formSubtype === "urlencoded"
                  ? "key1=value1&key2=value2"
                  : "Use multipart form data format...",
              )}
            </div>
          </div>
        );

      case "binary":
        return (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8">
            <Upload className="h-12 w-12 mb-3 text-muted-foreground opacity-50" />
            <p className="text-sm mb-2 ">Binary Data</p>
            {binaryFile ? (
              <div className="mb-4 p-3 bg-accent border border-border rounded-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-accent-foreground ">
                      {binaryFile.name}
                    </p>
                    <p className="text-xs text-muted-foreground ">
                      {(binaryFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setBinaryFile(null);
                      setBody("");
                    }}
                    className="text-primary hover:text-foreground text-sm "
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-center mb-4 text-muted-foreground ">
                Select a file to upload
              </p>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 btn-primary rounded-md text-sm "
            >
              {binaryFile ? "Change File" : "Select File"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        );

      case "graphql":
        return (
          <div className="flex flex-col h-full">
            <div className="flex-1 min-h-0">
              {renderTextArea("Enter GraphQL query...")}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const subtypeOptions: DropdownOption[] = getSubtypeOptions().map(
    (subtype) => ({
      value: subtype.value,
      label: subtype.label,
      icon: subtype.icon,
    }),
  );

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="p-4 border-b border-border flex-shrink-0 relative z-20">
        <div className="flex items-center space-x-3">
          <div className="w-40">
            <Dropdown
              options={BODY_TYPES}
              value={bodyType}
              onChange={handleTypeChange}
              placeholder="Select Type"
              className="w-full"
              optionsClassName="z-[60]"
            />
          </div>

          {shouldShowSubtypeDropdown() && (
            <div className="w-40">
              <Dropdown
                options={subtypeOptions}
                value={getCurrentSubtype()}
                onChange={handleSubtypeChange}
                placeholder="Select Format"
                className="w-full"
                optionsClassName="z-[60]"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        {getBodyTypeContent()}
      </div>
    </div>
  );
};

export default BodyTab;
