import { Send } from "lucide-react";
import { memo, useCallback, useMemo, useRef, useState } from "react";
import AuthTab from "@/components/tabs/auth-tab";
import BodyTab from "@/components/tabs/body-tab";
import HeadersTab from "@/components/tabs/headers-tab";
import ParamsTab from "@/components/tabs/params-tab";
import Dropdown from "@/components/ui/drop-down";
import Modal from "@/components/ui/modal";
import { httpMethods, TABS } from "@/constants";
import { useHttpRequest } from "@/hooks/http/useHttpRequest";
import { useModal } from "@/hooks/ui/useModal";
import { cn } from "@/utils";

interface RequestPanelProps {
  className?: string;
}

const RequestPanel = memo(({ className }: RequestPanelProps) => {
  const {
    getSelectedRequest,
    isValidRequest,
    setMethod,
    setUrl,
    executeRequest,
    setActiveRequestTab,
  } = useHttpRequest();
  const [customMethod, setCustomMethod] = useState("");
  const [isCustomMethodActive, setIsCustomMethodActive] = useState(false);
  const urlInputRef = useRef<HTMLInputElement>(null);
  const request = getSelectedRequest();
  const handleCustomMethodSaveCallback = useCallback(
    (value: string) => {
      setCustomMethod(value);
      setMethod(value);
      setIsCustomMethodActive(true);
    },
    [setMethod],
  );

  const customMethodValidator = useCallback((value: string) => {
    return value.trim().length > 0 && value.trim().length <= 15;
  }, []);

  const {
    isOpen: isCustomModalOpen,
    tempValue: tempCustomMethod,
    isValid: isCustomMethodValid,
    openModal: openCustomModal,
    closeModal: closeCustomModal,
    handleValueChange: handleCustomMethodChange,
    handleSave: handleCustomMethodSave,
    handleCancel: handleCustomMethodCancel,
    handleKeyDown: handleCustomMethodKeyDown,
  } = useModal({
    onSave: handleCustomMethodSaveCallback,
    initialValue: customMethod,
    validator: customMethodValidator,
  });

  const handleMethodChange = useCallback(
    (method: string) => {
      if (method === "CUSTOM") {
        openCustomModal();
      } else {
        setIsCustomMethodActive(false);
        setMethod(method);
      }
    },
    [openCustomModal, setMethod],
  );

  const getCurrentDisplayMethod = useMemo(() => {
    if (isCustomMethodActive && customMethod) {
      return customMethod;
    }
    return request?.request.method;
  }, [isCustomMethodActive, customMethod, request?.request.method]);

  const handleUrlChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setUrl(e.target.value);
    },
    [setUrl],
  );

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (isValidRequest()) {
          executeRequest();
        }
      }
    },
    [isValidRequest, executeRequest],
  );

  const handleExecuteRequest = useCallback(() => {
    executeRequest();
  }, [executeRequest]);

  const renderActiveTab = useMemo(() => {
    switch (request?.request.activeRequestTab) {
      case "headers":
        return <HeadersTab className="h-full" />;
      case "body":
        return <BodyTab className="h-full" />;
      case "auth":
        return <AuthTab className="h-full" />;
      case "params":
        return <ParamsTab className="h-full" />;
      default:
        return <HeadersTab className="h-full" />;
    }
  }, [request?.request.activeRequestTab]);

  if (!request) return null;

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="p-4 border-b border-border relative z-80">
        <div className="flex items-center space-x-3">
          <div className="w-32">
            <Dropdown
              options={httpMethods}
              value={request.request.method}
              onChange={handleMethodChange}
              customDisplay={getCurrentDisplayMethod}
              className="w-full"
            />
          </div>

          <div className="flex-1 relative">
            <input
              ref={urlInputRef}
              type="text"
              value={request.request.url}
              onChange={handleUrlChange}
              onKeyDown={handleKeyPress}
              placeholder="Enter request URL..."
              className="w-full px-3 py-2 bg-background border rounded-md text-foreground placeholder-muted-foreground  outline-none  border-border focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-2"
            />
          </div>

          <button
            type="button"
            onClick={handleExecuteRequest}
            className="px-4 py-2 rounded-md font-medium min-w-[40px] flex items-center justify-center space-x-2 btn-primary hover:opacity-90"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
        <div className="flex border-b border-border flex-shrink-0">
          {TABS.map((tab) => (
            <button
              type="button"
              key={tab.id}
              onClick={() => setActiveRequestTab(tab.id)}
              className={cn(
                "px-4 py-3 text-sm font-medium relative",
                request.request.activeRequestTab === tab.id
                  ? "text-foreground border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 min-h-0 overflow-visible">{renderActiveTab}</div>
      </div>

      <Modal
        isOpen={isCustomModalOpen}
        onClose={closeCustomModal}
        title="Configurar Método Custom"
        footer={
          <>
            <button
              type="button"
              onClick={handleCustomMethodCancel}
              className="px-4 py-2 text-sm font-medium btn-secondary rounded-md"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleCustomMethodSave}
              disabled={!isCustomMethodValid}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md",
                isCustomMethodValid
                  ? "btn-primary hover:opacity-90"
                  : "bg-muted text-muted-foreground cursor-not-allowed opacity-50",
              )}
            >
              Guardar
            </button>
          </>
        }
      >
        <div className="mb-4">
          <label
            htmlFor="customMethod"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Nombre del método
          </label>
          <input
            id="customMethod"
            type="text"
            value={tempCustomMethod}
            onChange={(e) =>
              handleCustomMethodChange(e.target.value.toUpperCase())
            }
            placeholder="Ej: TRACE, CONNECT, etc."
            className="w-full px-3 py-2 border border-border rounded-md focus-ring text-sm input"
            maxLength={15}
            onKeyDown={handleCustomMethodKeyDown}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Máximo 15 caracteres. Se convertirá a mayúsculas.
          </p>
        </div>
      </Modal>
    </div>
  );
});

RequestPanel.displayName = "RequestPanel";

export default RequestPanel;
