import { Check, ChevronDown } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { DropdownOption } from "@/types/data";

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  optionsClassName?: string;
  disabled?: boolean;
  showCheck?: boolean;
  showIcon?: boolean;
  customDisplay?: React.ReactNode;
}

const Dropdown = memo(
  ({
    options,
    value,
    onChange,
    placeholder = "Select option",
    className = "",
    buttonClassName = "",
    optionsClassName = "",
    disabled = false,
    showCheck = true,
    showIcon = true,
    customDisplay,
  } : DropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = useCallback((event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }, []);

    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, [handleClickOutside]);

    const selectedOption = useMemo(
      () => options.find((option) => option.value === value),
      [options, value],
    );

    const displayText = useMemo(
      () =>
        customDisplay !== undefined
          ? customDisplay
          : selectedOption?.label || placeholder,
      [customDisplay, selectedOption?.label, placeholder],
    );

    const handleOptionClick = useCallback(
      (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
      },
      [onChange],
    );

    const toggleDropdown = useCallback(() => {
      if (!disabled) {
        setIsOpen(!isOpen);
      }
    }, [disabled, isOpen]);

    const buttonColorClass = useMemo(() => {
      if (selectedOption?.color) {
        return selectedOption.color;
      }
      return "text-foreground bg-card border-border hover:bg-muted";
    }, [selectedOption?.color]);

    return (
      <div className={`relative ${className}`} ref={dropdownRef}>
        <button
          type="button"
          onClick={toggleDropdown}
          disabled={disabled}
          className={`
          px-3 py-2 rounded-md border text-sm font-medium 
          cursor-pointer focus-ring hover:bg-accent hover:text-accent-foreground hover:border-primary/50 flex items-center w-full
          ${customDisplay && typeof customDisplay !== "string" ? "justify-center" : "justify-between"}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${buttonColorClass}
          ${buttonClassName}
        `}
        >
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            {showIcon && selectedOption?.icon && (
              <selectedOption.icon className="h-4 w-4 flex-shrink-0" />
            )}
            {typeof displayText === "string" ? (
              <span className="truncate">{displayText}</span>
            ) : (
              displayText
            )}
          </div>
          {!(customDisplay && typeof customDisplay !== "string") && (
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground flex-shrink-0 ml-2 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          )}
        </button>

        {isOpen && !disabled && (
          <div
            className={`
          absolute top-full mt-1 bg-card border border-border rounded-md
          shadow-lg z-50 max-h-80 overflow-y-auto min-w-[160px]
          ${optionsClassName}
        `}
          >
            {options.map((option) => (
              <button
                type="button"
                key={option.value}
                onClick={() => handleOptionClick(option.value)}
                className={`
                w-full px-3 py-2 text-left text-sm font-medium  hover:bg-muted hover:text-foreground hover:shadow-sm hover:bg-zinc-300/50 dark:hover:bg-zinc-600/50
                 flex items-center justify-between
                ${value === option.value ? "bg-accent text-accent-foreground" : "text-foreground"}
              `}
              >
                <div className="flex items-center space-x-2 min-w-0 flex-1">
                  {showIcon && option.icon && (
                    <option.icon className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                  )}
                  <span className="truncate">{option.label}</span>
                </div>
                {showCheck && value === option.value && (
                  <Check className="h-4 w-4 text-primary flex-shrink-0 ml-2" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  },
);

Dropdown.displayName = "Dropdown";

export default Dropdown;
