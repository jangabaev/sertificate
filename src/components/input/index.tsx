import * as React from "react";

type InputVariant = "default" | "filled";

export interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  label?: string;
  helperText?: string;
  error?: string;
  success?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: InputVariant;
}

const baseInput =
  "peer h-11 w-full rounded-lg border px-3 text-sm outline-none transition-all duration-200 " +
  "placeholder:text-[rgb(var(--text-muted))] " +
  "disabled:cursor-not-allowed disabled:opacity-60";

const variantClasses: Record<InputVariant, string> = {
  default: [
    "border-[rgb(var(--border))]",
    "bg-[rgb(var(--surface))]",
    "text-[rgb(var(--text))]",
    "shadow-sm",
    "hover:border-[rgb(var(--border-strong))]",
    "focus:border-[rgb(var(--primary))]",
    "focus:ring-4",
    "focus:ring-[rgb(var(--primary)/0.12)]",
  ].join(" "),

  filled: [
    "border-[rgb(var(--border-subtle))]",
    "bg-[rgb(var(--surface-secondary))]",
    "text-[rgb(var(--text))]",
    "hover:bg-[rgb(var(--surface))]",
    "hover:border-[rgb(var(--border))]",
    "focus:border-[rgb(var(--primary))]",
    "focus:bg-[rgb(var(--surface))]",
    "focus:ring-4",
    "focus:ring-[rgb(var(--primary)/0.12)]",
  ].join(" "),
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      label,
      helperText,
      error,
      success = false,
      leftIcon,
      rightIcon,
      variant = "default",
      className = "",
      required,
      ...props
    },
    ref,
  ) => {
    const reactId = React.useId();
    const inputId = id ?? reactId;

    const message = error ?? helperText;
    const hasError = Boolean(error);

    const statusClass = hasError
      ? [
          "border-[rgb(var(--error))]",
          "text-[rgb(var(--text))]",
          "focus:border-[rgb(var(--error))]",
          "focus:ring-4",
          "focus:ring-[rgb(var(--error)/0.12)]",
        ].join(" ")
      : success
        ? [
            "border-[rgb(var(--success))]",
            "text-[rgb(var(--text))]",
            "focus:border-[rgb(var(--success))]",
            "focus:ring-4",
            "focus:ring-[rgb(var(--success)/0.12)]",
          ].join(" ")
        : variantClasses[variant];

    return (
      <div className="w-full">
        {label ? (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-[rgb(var(--text))]"
          >
            {label}

            {required ? (
              <span
                className="ml-1 text-[rgb(var(--error))]"
                aria-hidden="true"
              >
                *
              </span>
            ) : null}
          </label>
        ) : null}

        <div className="relative">
          {leftIcon ? (
            <span
              className={[
                "pointer-events-none absolute inset-y-0 left-3",
                "flex items-center",
                "text-[rgb(var(--text-muted))]",
                hasError
                  ? "text-[rgb(var(--error))]"
                  : success
                    ? "text-[rgb(var(--success))]"
                    : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {leftIcon}
            </span>
          ) : null}

          <input
            id={inputId}
            ref={ref}
            required={required}
            aria-invalid={hasError}
            aria-describedby={message ? `${inputId}-message` : undefined}
            className={[
              baseInput,
              statusClass,
              leftIcon ? "pl-10" : "",
              rightIcon ? "pr-10" : "",
              className,
            ]
              .filter(Boolean)
              .join(" ")}
            {...props}
          />

          {rightIcon ? (
            <span
              className={[
                "absolute inset-y-0 right-3",
                "flex items-center",
                "text-[rgb(var(--text-muted))]",
                hasError
                  ? "text-[rgb(var(--error))]"
                  : success
                    ? "text-[rgb(var(--success))]"
                    : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {rightIcon}
            </span>
          ) : null}
        </div>

        {message ? (
          <p
            id={`${inputId}-message`}
            className={[
              "mt-1.5 text-xs",
              hasError
                ? "text-[rgb(var(--error))]"
                : "text-[rgb(var(--text-muted))]",
            ].join(" ")}
          >
            {message}
          </p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";
