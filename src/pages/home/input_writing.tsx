"use client";
import React, { useEffect, useRef } from "react";

type MathfieldElement = HTMLElement & {
  value: string;
  executeCommand: (name: string, ...args: any[]) => boolean;
  insert?: (latex: string) => void;
};

interface RestrictedMathInputProps {
  value: string;
  onChange: (latex: string) => void;
}

// ❌ Ta’qiqlangan belgilar
// Bu regex integral, qavslar, < > va boshqa kerakmas belgilarni bloklaydi
const BANNED_REGEX =
  /\\int|\\iint|\\iiint|\\oint|\\lt|\\gt|<|>|\(|\)|\[|\]|\|∞|∫|≤|≥|≠|∈/;

export default function RestrictedMathInput({
  value,
  onChange,
}: RestrictedMathInputProps) {
  const mfRef = useRef<MathfieldElement | null>(null);
  const isFocusedRef = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("mathlive");
    }

    const handlePopState = () => {
      if (isFocusedRef.current) {
        mfRef.current?.blur();
        isFocusedRef.current = false;
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const isBanned = (s: string) => BANNED_REGEX.test(s);

  const handleBeforeInput = (e: any) => {
    const data: string = e.data ?? "";
    if (!data) return;
    if (isBanned(data)) {
      e.preventDefault();
    }
  };

  const handleInput = (e: Event) => {
    const el = e.target as MathfieldElement;
    if (isBanned(el.value)) {
      mfRef.current?.executeCommand("undo");
      return;
    }
    onChange(el.value);
  };

  const insert = (code: string) => {
    if (isBanned(code)) return;
    if (mfRef.current?.executeCommand) {
      mfRef.current.executeCommand("insert", code);
      mfRef.current.executeCommand("moveToNextPlaceholder");
    } else {
      mfRef.current?.insert?.(code);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        margin: 0,
        padding: 0,
        fontFamily: "sans-serif",
      }}
    >
      <math-field
        ref={mfRef}
        smart-mode="true"
        smart-fence="false"
        virtual-keyboard-mode="manual"
        virtual-keyboard-layout="custom"
        virtual-keyboard-theme="material"
        data-virtual-keyboard-toolbar="none"
        data-toolbar="none"
        data-menu="false"
        onBeforeinput={handleBeforeInput as any}
        onInput={handleInput as any}
        onFocus={() => {
          isFocusedRef.current = true;
          history.pushState(null, "", window.location.href);
        }}
        onBlur={() => {
          isFocusedRef.current = false;
        }}
        style={{
          display: "block",
          border: "1px solid #ccc",
          borderRadius: 8,
          padding: 0,
          minHeight: 30,
          fontSize: 20,
          background: "#fff",
        }}
      />
    </div>
  );
}
