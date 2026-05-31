import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Input, InputWithIcon } from "@/shared/ui/input";

export function AuthTextField({
  label,
  icon,
  action,
  className,
  inputClassName,
  ...props
}: ComponentProps<"input"> & {
  label: string;
  icon?: ReactNode;
  action?: ReactNode;
      inputClassName?: string;
}) {
  return (
    <div className={className}>
      <div className="auth-field-header">
        <label className="auth-field-label">{label}</label>
        {action}
      </div>
      <div className="auth-field-control">
        {icon ? (
          <InputWithIcon
            icon={icon}
            inputClassName={cn("auth-field-input", inputClassName)}
            {...props}
          />
        ) : (
          <Input
            className={cn("auth-field-input", inputClassName)}
            {...props}
          />
        )}
      </div>
    </div>
  );
}
