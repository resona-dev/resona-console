import { ButtonProps, buttonVariants } from "./ui/button";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export interface AsyncButtonProps extends ButtonProps {
    isLoading?: boolean;
}

export const AsyncButton = React.forwardRef<HTMLButtonElement, AsyncButtonProps>(
  ({ isLoading, className, variant, size, asChild = false, ...props }, ref) => {
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
      setLoading(isLoading ?? false);
    }, [isLoading]);

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
      setLoading(true);
      try {
        await props.onClick?.(e);
      } finally {
        setLoading(false);
      }
    };

    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }), "relative")}
        ref={ref}
        onClick={handleClick}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading && (
          <div className="absolute h-full w-full bg-inherit rounded-[inherit] flex ">
            <span className="loading loading-spinner loading-sm m-auto"></span>
          </div>
        )}
        {props.children}
      </Comp>
    );
  }
);
AsyncButton.displayName = "AsyncButton";
