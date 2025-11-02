"use client";
import React, { useEffect, useRef, useState } from "react";

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
  const [isFocused, setIsFocused] = useState(false);
  const mfRef = useRef<MathfieldElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("mathlive");
    }
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

  // ✅ Faqat ruxsat etilgan belgilarni qo‘shish
  const insert = (code: string) => {
    if (isBanned(code)) return;
    if (mfRef.current?.executeCommand) {
      mfRef.current.executeCommand("insert", code);
      mfRef.current.executeCommand("moveToNextPlaceholder");
    } else {
      mfRef.current?.insert?.(code);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("mathlive");
    }

    const handleBackButton = (event: PopStateEvent) => {
      if (isFocused) {
        // klaviaturani yopish
        mfRef.current?.blur();
        setIsFocused(false);
        // sahifani orqaga qaytmasin
        history.pushState(null, "", window.location.href);
      }
    };

    // mobil brauzerlar uchun "back" hodisasini kuzatamiz
    window.addEventListener("popstate", handleBackButton);
    // bir marta push qilib qo‘yamiz, shunda back ishlaydi
    history.pushState(null, "", window.location.href);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [isFocused]);

  return (
    <div
      style={{
        maxWidth: 640,
        margin: "24px auto",
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
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{
          display: "block",
          border: "1px solid #ccc",
          borderRadius: 8,
          padding: 10,
          minHeight: 50,
          fontSize: 20,
          background: "#fff",
        }}
      />
    </div>
  );
}
