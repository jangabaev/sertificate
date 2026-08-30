"use client";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

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

// Bir vaqtning o'zida faqat bitta math-field fokusda bo'lishi mumkin.
// Telegram WebApp'ning orqaga tugmasi (BackButton) shu yagona faol
// fieldni yopish uchun markazlashtirilgan holda boshqariladi — aks holda
// orqaga bosilganda butun Mini App yopilib ketadi.
let activeMathField: MathfieldElement | null = null;
let backButtonHandlerBound = false;

function getTelegramWebApp(): any {
  return (window as any)?.Telegram?.WebApp;
}

function closeActiveKeyboard() {
  const field = activeMathField;
  activeMathField = null;
  if (field) {
    try {
      field.executeCommand("hideVirtualKeyboard");
    } catch {
      // ignore
    }
    field.blur();
  }
  getTelegramWebApp()?.BackButton?.hide();
}

function ensureBackButtonHandlerBound() {
  if (backButtonHandlerBound) return;
  const tg = getTelegramWebApp();
  if (!tg?.BackButton) return;
  backButtonHandlerBound = true;
  tg.BackButton.onClick(() => {
    if (activeMathField) {
      closeActiveKeyboard();
    }
  });
}

// MathLive virtual klaviaturasi alohida panel sifatida document.body'ga
// joylashtiriladi (".ML__keyboard"). Yopish tugmasini klaviatura ICHIDA,
// "orqaga o'chirish" (⌫, backspace) tugmasi yoniga joylashtiramiz — xuddi
// MathLive'ning o'zi "compact"/"minimalist" bazaviy tartiblarida
// [hide-keyboard] tugmasini [backspace] yoniga qo'ygani kabi.
function findBackspaceKeycap(panel: HTMLElement): HTMLElement | null {
  const uses = panel.querySelectorAll("use");
  for (const use of Array.from(uses)) {
    const href = use.getAttribute("xlink:href") || use.getAttribute("href");
    if (href !== "#svg-delete-backward") continue;
    const keycap = use.closest("div[id]") as HTMLElement | null;
    if (keycap) {
      const r = keycap.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) return keycap;
    }
  }
  return null;
}

function KeyboardCloseBar({ onClose }: { onClose: () => void }) {
  const [rect, setRect] = useState<{ top: number; right: number } | null>(
    null,
  );

  useEffect(() => {
    let raf = 0;

    const update = () => {
      const panel = document.querySelector(
        ".ML__keyboard",
      ) as HTMLElement | null;
      const backspaceKey = panel ? findBackspaceKeycap(panel) : null;
      if (backspaceKey) {
        const r = backspaceKey.getBoundingClientRect();
        setRect({ top: r.top, right: window.innerWidth - r.right });
      } else {
        raf = requestAnimationFrame(update);
      }
    };

    update();

    const observer = new MutationObserver(update);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class"],
    });
    window.addEventListener("resize", update);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  if (!rect) return null;

  return createPortal(
    <button
      type="button"
      aria-label="Klaviaturani yopish"
      onMouseDown={(e) => {
        e.preventDefault();
        onClose();
      }}
      style={{
        position: "fixed",
        top: rect.top - 16,
        right: Math.max(rect.right - 12, 4),
        width: 32,
        height: 32,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "2px solid rgb(var(--surface))",
        borderRadius: "50%",
        background: "rgb(var(--primary))",
        color: "#fff",
        fontSize: 16,
        lineHeight: 1,
        cursor: "pointer",
        padding: 0,
        zIndex: 2147483000,
        boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
      }}
    >
      ✕
    </button>,
    document.body,
  );
}

export default function RestrictedMathInput({
  value,
  onChange,
}: RestrictedMathInputProps) {
  const mfRef = useRef<MathfieldElement | null>(null);
  const isFocusedRef = useRef(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("mathlive");
    }

    ensureBackButtonHandlerBound();

    const handlePopState = () => {
      if (isFocusedRef.current) {
        closeActiveKeyboard();
        isFocusedRef.current = false;
        setIsFocused(false);
        // ortga qaytishni "qopqonga olamiz" — aks holda navbatdagi
        // orqaga bosish butun sahifani/Mini App'ni yopib yuboradi
        history.pushState(null, "", window.location.href);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      if (activeMathField === mfRef.current) {
        closeActiveKeyboard();
      }
    };
  }, []);

  const handleFocus = () => {
    isFocusedRef.current = true;
    setIsFocused(true);
    activeMathField = mfRef.current;
    ensureBackButtonHandlerBound();
    getTelegramWebApp()?.BackButton?.show();
    history.pushState(null, "", window.location.href);
  };

  const handleBlur = () => {
    isFocusedRef.current = false;
    setIsFocused(false);
    if (activeMathField === mfRef.current) {
      activeMathField = null;
      getTelegramWebApp()?.BackButton?.hide();
    }
  };

  const handleCloseClick = () => {
    closeActiveKeyboard();
    isFocusedRef.current = false;
    setIsFocused(false);
  };

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
        position: "relative",
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
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={{
          display: "block",
          border: isFocused
            ? "1px solid rgb(var(--primary))"
            : "1px solid rgba(var(--border))",
          borderRadius: 8,
          padding: 0,
          minHeight: 30,
          fontSize: 20,
          background: "rgb(var(--surface))",
          color: "rgb(var(--text))",
        }}
      />
      {isFocused && <KeyboardCloseBar onClose={handleCloseClick} />}
    </div>
  );
}
