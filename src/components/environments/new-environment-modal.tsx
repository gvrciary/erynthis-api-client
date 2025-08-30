import { useCallback, useEffect, useRef } from "react";
import Modal from "@/components/ui/modal";
import type { Environment } from "@/types/data";
import { cn } from "@/utils";

interface NewEnvironmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
  existingEnvironments: Environment[];
  environmentName: string;
  onNameChange: (name: string) => void;
  error: string;
  onErrorClear: () => void;
}

const NewEnvironmentModal = ({
  isOpen,
  onClose,
  onCreate,
  existingEnvironments,
  environmentName,
  onNameChange,
  error,
  onErrorClear,
}: NewEnvironmentModalProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleCreate = useCallback(() => {
    const trimmedName = environmentName.trim();

    if (!trimmedName) {
      return;
    }

    if (
      existingEnvironments.some(
        (env) => env.name.toLowerCase() === trimmedName.toLowerCase(),
      )
    ) {
      return;
    }

    onCreate(trimmedName);
  }, [environmentName, existingEnvironments, onCreate]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onNameChange(e.target.value);
      if (error) {
        onErrorClear();
      }
    },
    [onNameChange, error, onErrorClear],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleCreate();
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    },
    [handleCreate, onClose],
  );

  const isValidName = environmentName.trim().length > 0;
  const isDuplicate = existingEnvironments.some(
    (env) => env.name.toLowerCase() === environmentName.trim().toLowerCase(),
  );

  const modalFooter = (
    <div className="flex space-x-3">
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-accent text-sm font-medium transition-colors duration-150"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={handleCreate}
        disabled={!isValidName || isDuplicate}
        className={cn(
          "flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150",
          isValidName && !isDuplicate
            ? "btn-primary hover:opacity-90"
            : "bg-muted text-muted-foreground cursor-not-allowed opacity-50",
        )}
      >
        Create Environment
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="New Environment"
      size="md"
      footer={modalFooter}
    >
      <div className="space-y-4">
        <div>
          <label
            htmlFor="env-name"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Environment Name
          </label>
          <input
            id="env-name"
            ref={inputRef}
            type="text"
            value={environmentName}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Enter environment name"
            className={cn(
              "w-full px-3 py-2 text-sm border rounded-lg text-foreground placeholder-muted-foreground bg-background focus-ring transition-colors duration-150",
              error ? "border-red-500 bg-red-50 dark:bg-red-950" : "border-border",
            )}
            maxLength={50}
            autoComplete="off"
            spellCheck={false}
          />
          {error && (
            <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
              <span>{error}</span>
            </p>
          )}
          {!error && environmentName.trim() && (
            <p className="mt-1 text-xs text-muted-foreground">
              {isDuplicate
                ? "An environment with this name already exists"
                : `Environment "${environmentName.trim()}" will be created`}
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default NewEnvironmentModal;
