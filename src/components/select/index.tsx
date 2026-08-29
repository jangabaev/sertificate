import * as React from "react";

export interface SelectOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

export interface SelectProps {
  label?: string;
  value?: string;
  options: SelectOption[];
  placeholder?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  className?: string;
  onChange?: (value: string) => void;
}

export const Select = ({
  label,
  value,
  options,
  placeholder = "Tanlang",
  helperText,
  error,
  required = false,
  disabled = false,
  leftIcon,
  className = "",
  onChange,
}: SelectProps) => {
  const [open, setOpen] = React.useState(false);
  const selectRef = React.useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (option: SelectOption) => {
    onChange?.(option.value);
    setOpen(false);
  };

  return (
    <div ref={selectRef} className={`relative ${className}`}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-[rgb(var(--text))]">
          {label}

          {required && <span className="ml-1 text-[rgb(var(--error))]">*</span>}
        </label>
      )}

      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        className={[
          "group flex h-11 w-[170px] items-center gap-2 rounded-lg px-3",
          "text-left text-sm outline-none",
          "transition-all duration-200",
          "bg-transparent",
          "hover:bg-[rgb(var(--background))]",
          "focus:bg-[rgb(var(--background))]",
          "disabled:cursor-not-allowed disabled:opacity-60",
          open
            ? "bg-[rgb(var(--background))] ring-4 ring-[rgb(var(--primary)/0.10)]"
            : "",
          error ? "text-[rgb(var(--error))]" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {leftIcon && (
          <span className="flex shrink-0 items-center text-[rgb(var(--text-muted))]">
            {leftIcon}
          </span>
        )}

        <span className="min-w-0 flex-1">
          {selectedOption ? (
            <span className="flex items-center gap-2 font-medium text-[rgb(var(--text))]">
              {selectedOption.icon && (
                <span className="shrink-0">{selectedOption.icon}</span>
              )}

              <span className="truncate">{selectedOption.label}</span>
            </span>
          ) : (
            <span className="text-[rgb(var(--text-muted))]">{placeholder}</span>
          )}
        </span>

        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={[
            "shrink-0 text-[rgb(var(--text-muted))]",
            "transition-transform duration-200",
            open ? "rotate-180 text-[rgb(var(--primary))]" : "",
          ].join(" ")}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          className="
            absolute left-0 top-full z-50 mt-2
            w-full min-w-[180px]
            overflow-hidden rounded-xl
            bg-[rgb(var(--surface))]
            p-1.5
            shadow-[0_10px_40px_rgba(15,23,42,0.12)]
            ring-1 ring-black/[0.06]
          "
        >
          {options.map((option) => {
            const active = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option)}
                className={[
                  "flex w-full items-center gap-2.5 rounded-lg",
                  "px-3 py-2.5 text-left text-sm",
                  "transition-colors duration-150",
                  active
                    ? "bg-[rgb(var(--primary)/0.10)] text-[rgb(var(--text-active))]"
                    : "text-[rgb(var(--text))] hover:bg-[rgb(var(--background))]",
                ].join(" ")}
              >
                {option.icon && (
                  <span className="flex shrink-0 items-center">
                    {option.icon}
                  </span>
                )}

                <span className="flex-1 font-medium">{option.label}</span>

                {active && (
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-[rgb(var(--primary))]"
                  >
                    <path d="m5 12 4 4L19 6" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}

      {(error || helperText) && (
        <p
          className={[
            "mt-1.5 text-xs",
            error
              ? "text-[rgb(var(--error))]"
              : "text-[rgb(var(--text-muted))]",
          ].join(" ")}
        >
          {error ?? helperText}
        </p>
      )}
    </div>
  );
};
