import type React from "react";
import { forwardRef } from "react";
import { cn } from "@/utils";

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: "xs" | "sm" | "md";
  variant?: "default" | "transparent";
  error?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { size = "sm", variant = "default", error = false, className, ...props },
    ref,
  ) => {
    const sizeClasses = {
      xs: "px-2 py-1 text-xs h-6",
      sm: "px-2 py-1.5 text-xs h-7",
      md: "px-3 py-2 text-sm h-8",
    };

    const variantClasses = {
      default: [
        "bg-background border border-border rounded-md",
        "focus:border-primary focus:ring-2 focus:ring-primary/20",
      ],
      transparent: [
        "bg-transparent border-none rounded",
        "focus:bg-accent focus:ring-2 focus:ring-primary focus:ring-offset-1",
      ],
    };

    return (
      <input
        ref={ref}
        className={cn(
          "w-full text-foreground placeholder-muted-foreground outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50",
          sizeClasses[size],
          variantClasses[variant],
          error && [
            variant === "default" &&
              "border-red-500 focus:border-red-500 focus:ring-red-500/20",
            variant === "transparent" && "text-red-600 focus:ring-red-500",
          ],
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export default Input;
