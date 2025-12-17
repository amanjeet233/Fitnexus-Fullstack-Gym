import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[120px] w-full rounded-lg border border-secondary-300 bg-white px-3.5 py-3 text-sm shadow-sm transition focus-visible:border-neo-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-neo-100 focus-visible:ring-offset-0 placeholder:text-secondary-400 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };


