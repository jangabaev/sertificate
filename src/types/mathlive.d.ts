// src/types/mathlive.d.ts

import type { CSSProperties } from "react";

// MathLive web component tipi
export interface MathfieldElement extends HTMLElement {
  value: string;
  getValue(opts?: { format: "latex" | "ASCIIMath" }): string;
  setValue(v: string, opts?: { format: "latex" | "ASCIIMath" }): void;
  executeCommand(name: string, ...args: any[]): boolean;
}

// JSX’da <math-field> ni tanitish
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "math-field": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        style?: CSSProperties;
        // Quyidagi atributlar MathLive’ga tegishli:
        "smart-mode"?: boolean | "true" | "false";
        "virtual-keyboard-mode"?: "off" | "manual" | "onfocus";
        "virtual-keyboard-theme"?: string;
        // Hodisalar (kerak bo‘lsa yanada kengaytirish mumkin)
        onInput?: (e: Event) => void;
        onChange?: (e: Event) => void;
      };
    }
  }
}
