import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

export type ButtonVariant = "primary" | "greenOutline" | "grayOutline" | "grayFilled";
export type ButtonSize = "xs" | "sm" | "md" | "lg";

type LegacyButtonVariant = "secondary" | "ghost";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant | LegacyButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white hover:bg-primary-hover",
  greenOutline: "border-primary bg-transparent text-primary hover:bg-primary/10",
  grayOutline: "border-gray-400 bg-transparent text-off hover:bg-gray-50",
  grayFilled: "bg-black-700 text-gray-400 hover:bg-black-800",
};

const legacyVariantMap: Record<LegacyButtonVariant, ButtonVariant> = {
  secondary: "grayOutline",
  ghost: "grayFilled",
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: "min-h-7 px-3 text-xs leading-5 font-normal",
  sm: "min-h-9 px-4 text-sm leading-normal font-normal",
  md: "min-h-11 px-5 text-base leading-none font-medium",
  lg: "min-h-12 px-6 text-xl leading-[22.5px] font-semibold",
};

export default function Button({
  className,
  variant = "primary",
  size = "md",
  fullWidth = false,
  leftIcon,
  rightIcon,
  children,
  ...props
}: ButtonProps) {
  const resolvedVariant: ButtonVariant =
    variant === "secondary" || variant === "ghost" ? legacyVariantMap[variant] : variant;

  return (
    <button
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-transparent font-semibold whitespace-nowrap transition-colors",
        "disabled:pointer-events-none disabled:border-gray-200 disabled:bg-black-800 disabled:text-black-700",
        variantStyles[resolvedVariant],
        sizeStyles[size],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {leftIcon ? (
        <span className="inline-flex shrink-0" aria-hidden="true">
          {leftIcon}
        </span>
      ) : null}
      {children}
      {rightIcon ? (
        <span className="inline-flex shrink-0" aria-hidden="true">
          {rightIcon}
        </span>
      ) : null}
    </button>
  );
}
