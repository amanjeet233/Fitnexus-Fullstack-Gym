import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-lg border border-secondary-300 bg-white px-3.5 py-2.5 text-sm shadow-sm transition focus-visible:border-primary-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-100 focus-visible:ring-offset-0 placeholder:text-secondary-400 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };

