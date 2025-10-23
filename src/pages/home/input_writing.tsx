"use client";
import React, { useEffect, useRef, useState } from "react";

// minimal tip — executeCommand va value kifoya
type MathfieldElement = HTMLElement & {
  value: string;
  executeCommand: (name: string, ...args: any[]) => boolean;
  insert?: (latex: string) => void; // eski versiyalar uchun
};

const BANNED_REGEX = /\\int|\\iint|\\iiint|\\oint|\||\(|\)|\[|\]|\{|\}/;

export default function RestrictedMathInput() {
  const [latex, setLatex] = useState("");
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
    // Raqamlar/+, -, /, ^ va biz insert qilgan narsa — OK.
    // Xavfsizlik uchun butun matnni ham tekshiramiz:
    if (isBanned(el.value)) {
      // Agar qandaydir yo‘l bilan kirib qolsa, oxirgi kiritishni bekor qilamiz
      mfRef.current?.executeCommand("undo");
      return;
    }
    setLatex(el.value);
  };

  // Faqat ruxsat etilgan tugmalar: raqamlar, + - * / ^, frac, sqrt, pi, e
  const insert = (code: string) => {
    if (isBanned(code)) return;
    // Yangi MathLive: executeCommand("insert", ...)
    if (mfRef.current?.executeCommand) {
      mfRef.current.executeCommand("insert", code);
      // placeholder ichiga o‘tish (frac/sqrt uchun qulay)
      mfRef.current.executeCommand("moveToNextPlaceholder");
    } else {
      // (fallback)
      mfRef.current?.insert?.(code);
    }
  };

  return (
    <div style={{ maxWidth: 640, margin: "24px auto", fontFamily: "sans-serif" }}>
      <h3>Matematik ifoda (integral, modul, qo‘shimcha qavslar — yo‘q)</h3>

      <math-field
        ref={mfRef}
        // 🔧 muhim opsiyalar
        smart-mode="true"                 // 2/3 → \frac{2}{3}
        smart-fence="false"               // avtomatik qavs qo‘ymaslikka intilamiz
        virtual-keyboard-mode="manual"    // faqat o‘z tugmalarimizdan foydalanamiz
        virtual-keyboard-theme="material"
        // ❌ foydalanuvchi kiritishini filtrlash
        onBeforeinput={handleBeforeInput as any}
        onInput={handleInput as any}
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

      {/* Bizning ruxsat etilgan tugmalar paneli */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(8, minmax(48px, 1fr))", gap: 8, marginTop: 12 }}>
        {/* sonlar */}
        {[..."1234567890"].map((d) => (
          <button key={d} onClick={() => insert(d)}>{d}</button>
        ))}
        {/* operatorlar */}
        <button onClick={() => insert("+")}>+</button>
        <button onClick={() => insert("-")}>−</button>
        <button onClick={() => insert("*")}>×</button>
        <button onClick={() => insert("/")}>÷</button>
        <button onClick={() => insert("^")}>^</button>
        {/* maxsus */}
        <button onClick={() => insert("\\frac{}{}")}>a/b</button>
        <button onClick={() => insert("\\sqrt{}")}>√</button>
        <button onClick={() => insert("\\pi")}>π</button>
        <button onClick={() => insert("e")}>e</button>
        {/* qulaylik: ^2 */}
        <button onClick={() => insert("^{2}")}>x²</button>
      </div>

      <div style={{ marginTop: 12 }}>
        <strong>LaTeX:</strong> <code>{latex || "—"}</code>
      </div>

      <p style={{ marginTop: 8, fontSize: 13, color: "#666" }}>
        Taqiqlangan: ∫, i∫, ∬, ∮, |x| va har qanday qo‘shimcha qavslar <code>() [] &#123;&#125;</code>.
        <br />
        Ruxsat: raqamlar, <code>+ - * / ^</code>, <code>\frac</code>, <code>\sqrt</code>, <code>\pi</code>, <code>e</code>.
      </p>
    </div>
  );
}
