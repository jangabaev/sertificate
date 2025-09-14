import React, { useEffect, useRef, useState } from "react";

/**
 * Photomath-style math input using MathLive's <math-field> web component.
 *
 * Requirements to run:
 *   npm i mathlive
 *   // If you use Vite/CRA/Next, also ensure CSS is available:
 *   import "mathlive/dist/mathlive-static.css"; // place this in your app entry (e.g., src/main.jsx or _app.tsx)
 *
 * Notes:
 * - Works out of the box in React because <math-field> is a web component.
 * - Provides: virtual keyboard (MathLive), custom quick buttons, LaTeX value, and read-only preview.
 * - You can control the field with ref methods: .getValue(), .setValue(), .insert(), .executeCommand()
 */

// Tell TS/JSX we accept the custom element (safe in JS too)
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "math-field": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          // Common MathLive attributes
          "virtual-keyboard-mode"?: "manual" | "onfocus" | "off";
          "virtual-keyboard-toggle"?: "auto" | "manual";
          "smart-fence"?: boolean | "true" | "false";
          "smart-superscript"?: boolean | "true" | "false";
          "smart-mode"?: boolean | "true" | "false";
          "use-shared-virtual-keyboard"?: boolean | "true" | "false";
          "spellcheck"?: boolean | "true" | "false";
          "default-mode"?: "math" | "text";
          "letter-shape-style"?: "tex" | "iso" | "french" | "upright";
          style?: React.CSSProperties;
        },
        HTMLElement
      >;
    }
  }
}

// Helper for a toolbar button
const KeyButton: React.FC<{
  label: string;
  onClick: () => void;
  title?: string;
}> = ({ label, onClick, title }) => (
  <button
    type="button"
    title={title || label}
    onClick={onClick}
    className="px-3 py-2 rounded-2xl shadow-sm border text-sm hover:shadow transition active:scale-95"
  >
    {label}
  </button>
);

export default function MathFormulaInput() {
  const fieldRef = useRef<HTMLElement | null>(null);
  const [latex, setLatex] = useState<string>("");

  // Bind events once the element is mounted
  useEffect(() => {
    // Dynamically import to ensure SSR safety if needed
    import("mathlive").then(() => {
      const el = fieldRef.current as any;
      if (!el) return;

      // initial value
      if (!el.getValue || !el.setValue) return;
      if (!latex) el.setValue("x^2 + y^2 = r^2", { format: "latex" });

      const handleInput = () => {
        try {
          const v = el.getValue("latex");
          setLatex(v);
        } catch (e) {
          // ignore
        }
      };

      el.addEventListener("input", handleInput);
      // set a few friendly options
      el.setOptions?.({
        smartFence: true,
        smartMode: true,
        removeExtraneousParentheses: true,
        virtualKeyboardMode: "onfocus",
        useSharedVirtualKeyboard: true,
      });

      // get initial
      handleInput();

      return () => el.removeEventListener("input", handleInput);
    });
  }, []);

  // Utilities to interact with math-field
  const insert = (snippet: string) => {
    const el = fieldRef.current as any;
    el?.insert?.(snippet);
    el?.focus?.();
  };

  const cmd = (name: string, arg?: any) => {
    const el = fieldRef.current as any;
    el?.executeCommand?.(name as any, arg);
    el?.focus?.();
  };

  const setValue = (value: string) => {
    const el = fieldRef.current as any;
    el?.setValue?.(value, { format: "latex" });
    el?.focus?.();
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 space-y-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Math Formula Input</h1>
        <p className="text-sm opacity-80">
          Photomath uslubida: virtual klaviatura + tezkor tugmalar + LaTeX qiymati.
        </p>
      </div>

      {/* Quick toolbar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        <KeyButton label="x^2" onClick={() => insert("x^2")} />
        <KeyButton label="x_{i}" onClick={() => insert("x_{i}")} />
        <KeyButton label="\\frac{}{}" title="Fraction" onClick={() => insert("\\frac{}{}")}/>
        <KeyButton label="\\sqrt{}" title="Square root" onClick={() => insert("\\sqrt{}")}/>
        <KeyButton label="\\int" title="Integral" onClick={() => insert("\\int ")} />
        <KeyButton label="\\sum" title="Summation" onClick={() => insert("\\sum_{i=1}^{n}")} />
        <KeyButton label="\\lim" title="Limit" onClick={() => insert("\\lim_{x\\to 0}")} />
        <KeyButton label="π" onClick={() => insert("\\pi")} />
        <KeyButton label="θ" onClick={() => insert("\\theta")} />
        <KeyButton label="≤" onClick={() => insert("\\le")} />
        <KeyButton label="≥" onClick={() => insert("\\ge")} />
        <KeyButton label="≠" onClick={() => insert("\\ne")} />
      </div>

      {/* The math field itself */}
      <div className="rounded-2xl border shadow-sm p-3 bg-white">
        <math-field
          ref={(el) => (fieldRef.current = el)}
          className="text-xl w-full min-h-[64px] outline-none"
          virtual-keyboard-mode="onfocus"
          smart-fence="true"
          smart-superscript="true"
          use-shared-virtual-keyboard="true"
          default-mode="math"
          spellcheck={false}
          style={{ padding: "0.5rem" }}
        />
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <KeyButton label="Undo" onClick={() => cmd("undo")} />
        <KeyButton label="Redo" onClick={() => cmd("redo")} />
        <KeyButton label="Clear" onClick={() => setValue("")} />
        <KeyButton label="Insert Matrix" onClick={() => insert("\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}")} />
        <KeyButton label="Insert Derivative" onClick={() => insert("\\frac{d}{dx}()") } />
        <KeyButton label="Insert Equation" onClick={() => setValue("ax^2+bx+c=0")} />
      </div>

      {/* Live output */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <h2 className="font-medium">LaTeX:</h2>
          <textarea
            className="w-full min-h-[120px] rounded-xl border p-2 text-sm"
            value={latex}
            readOnly
          />
          <div className="text-xs opacity-70">
            Bu qiymatni backendga yuborishingiz yoki saqlashingiz mumkin.
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="font-medium">Oldindan ko'rish (render):</h2>
          <div className="rounded-xl border p-3 bg-white">
            {/* A second read-only preview field */}
            <math-field readOnly value={latex} className="text-xl w-full" />
          </div>
        </div>
      </div>

      {/* Developer tips */}
      <details className="p-3 rounded-xl border bg-gray-50">
        <summary className="cursor-pointer font-medium">Integratsiya bo'yicha maslahatlar</summary>
        <ul className="list-disc pl-6 mt-2 text-sm space-y-1">
          <li>SSR (Next.js) da: komponentni dynamic import bilan {`{ ssr: false }`} qilib chaqiring.</li>
          <li>Formaga qo'shishda onSubmit ichida <code>latex</code> state'ni yuboring.</li>
          <li>Agar faqat LaTeX keraksiz bo'lsa, <code>react-mathquill</code> ham mos keladi, lekin MathLive virtual klaviatura/IME va buyruqlarni qulay beradi.</li>
          <li>Mobil qurilmalarda virtual klaviatura avtomatik chiqadi (onfocus). Desktopda ham qo'llab-quvvatlanadi.</li>
        </ul>
      </details>
    </div>
  );
}
