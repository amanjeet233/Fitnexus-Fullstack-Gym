import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neo-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transform hover:scale-105 hover:-translate-y-0.5 active:scale-95 active:translate-y-0",
  {
    variants: {
      variant: {
        default: "bg-neo-500 text-white hover:bg-neo-600 hover:shadow-neo-lg active:shadow-neo-xl",
        destructive: "bg-neo-600 text-white hover:bg-neo-700 hover:shadow-neo-lg active:shadow-neo-xl",
        outline: "border-2 border-neo-400 bg-background text-neo-600 hover:bg-neo-50 hover:border-neo-500 hover:shadow-neo-md active:shadow-neo-lg",
        secondary: "bg-secondary-200 text-secondary-foreground hover:bg-secondary-300 hover:shadow-neo-md active:shadow-neo-lg",
        ghost: "hover:bg-neo-50 hover:text-neo-600 hover:shadow-neo-sm",
        link: "text-neo-600 underline-offset-4 hover:underline hover:text-neo-700",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

