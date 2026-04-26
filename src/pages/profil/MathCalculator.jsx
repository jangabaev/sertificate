import { useState, useRef, useEffect } from "react";

const FONT = "https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Exo+2:wght@300;400;600&display=swap";

const TABS = ["123", "∞≠∈", "abc", "αβγ"];

const KEYS_123 = [
  ["x", "n", "7", "8", "9", "÷", "e", "i", "π"],
  ["<", ">", "4", "5", "6", "×", "^", "□", "√"],
  ["(", ")", "1", "2", "3", "–", "∫", "∀", "⌫"],
  ["⇧", "0", ".", "=", "+", "‹", "›", "↵"],
];

const KEYS_SYM = [
  ["∞", "≠", "∈", "≤", "≥", "≈", "∑", "∏", "∂"],
  ["∧", "∨", "¬", "∀", "∃", "∅", "⊂", "⊃", "⊆"],
  ["α", "β", "γ", "δ", "ε", "ζ", "η", "θ", "⌫"],
  ["λ", "μ", "ξ", "π", "ρ", "σ", "τ", "↵"],
];

const KEYS_ABC = [
  ["a", "b", "c", "d", "e", "f", "g", "h", "i"],
  ["j", "k", "l", "m", "n", "o", "p", "q", "r"],
  ["s", "t", "u", "v", "w", "x", "y", "z", "⌫"],
  ["A", "B", "C", "D", "E", "F", "G", "↵"],
];

const KEYS_GRK = [
  ["α", "β", "γ", "δ", "ε", "ζ", "η", "θ", "ι"],
  ["κ", "λ", "μ", "ν", "ξ", "ο", "π", "ρ", "σ"],
  ["τ", "υ", "φ", "χ", "ψ", "ω", "Γ", "Δ", "⌫"],
  ["Θ", "Λ", "Ξ", "Π", "Σ", "Φ", "Ψ", "↵"],
];

const TAB_KEYS = [KEYS_123, KEYS_SYM, KEYS_ABC, KEYS_GRK];

const SPECIAL_WIDE = ["⇧", "↵", "‹", "›", "⌫"];

function evalExpression(expr) {
  try {
    let e = expr
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/–/g, "-")
      .replace(/π/g, "Math.PI")
      .replace(/e(?![a-zA-Z])/g, "Math.E")
      .replace(/√(\d+\.?\d*)/g, "Math.sqrt($1)")
      .replace(/\^/g, "**");
    // eslint-disable-next-line no-new-func
    const result = Function('"use strict"; return (' + e + ")")();
    if (typeof result === "number" && isFinite(result)) {
      return String(parseFloat(result.toFixed(10)));
    }
    return "Error";
  } catch {
    return "Error";
  }
}

export default function MathCalculator() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [showKb, setShowKb] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef(null);
  const kbRef = useRef(null);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = FONT;
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    if (input && input !== "Error") {
      const r = evalExpression(input);
      setResult(r !== input ? r : "");
    } else {
      setResult("");
    }
  }, [input]);

  const handleKey = (key) => {
    if (key === "⌫") {
      setInput((v) => v.slice(0, -1));
      setCursor((c) => Math.max(0, c - 1));
    } else if (key === "↵" || key === "=") {
      const r = evalExpression(input);
      setInput(r);
      setResult("");
    } else if (key === "‹") {
      setCursor((c) => Math.max(0, c - 1));
    } else if (key === "›") {
      setCursor((c) => Math.min(input.length, c + 1));
    } else if (key === "⇧") {
      // shift - noop for now
    } else {
      const sym = key === "□" ? "□" : key;
      setInput((v) => v + sym);
      setCursor((c) => c + 1);
    }
  };

  const handleInputFocus = () => setShowKb(true);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    setCursor(e.target.selectionStart || 0);
  };

  const keys = TAB_KEYS[activeTab];

  return (
    <div
      style={{
        fontFamily: "'Share Tech Mono', monospace",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a0e1a 0%, #0d1628 60%, #091220 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "0",
        color: "#c8d8f0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background grid */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none",
        backgroundImage: "linear-gradient(rgba(30,80,160,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(30,80,160,0.07) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        zIndex: 0,
      }} />

      {/* Glow orbs */}
      <div style={{ position: "fixed", top: "10%", left: "10%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(30,120,255,0.07) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: "20%", right: "5%", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,200,180,0.06) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>

        {/* Header */}
        <div style={{ padding: "24px 20px 8px", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#1e88ff", boxShadow: "0 0 8px #1e88ff" }} />
          <span style={{ fontFamily: "'Exo 2', sans-serif", fontWeight: 300, fontSize: 12, letterSpacing: "0.2em", color: "#5a80b0", textTransform: "uppercase" }}>Math Input System</span>
        </div>

        {/* Input Area */}
        <div style={{ padding: "12px 16px", flex: 1 }}>
          <div style={{
            background: "rgba(10,20,40,0.8)",
            border: "1px solid rgba(30,80,160,0.4)",
            borderRadius: 8,
            padding: "0 12px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            boxShadow: showKb ? "0 0 0 1px rgba(30,136,255,0.5), inset 0 0 20px rgba(0,20,60,0.5)" : "inset 0 0 20px rgba(0,10,30,0.5)",
            transition: "box-shadow 0.3s",
            position: "relative",
          }}>
            {/* Line number indicator */}
            <span style={{ color: "#2a5090", fontSize: 13, minWidth: 28, fontFamily: "'Share Tech Mono', monospace" }}>
              {input.length > 0 ? input.length + "b" : "0b"}
            </span>

            <input
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              placeholder="Enter expression..."
              readOnly={false}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#e0f0ff",
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: 18,
                padding: "14px 0",
                caretColor: "#1e88ff",
              }}
            />

            {/* Keyboard toggle icon */}
            <button
              onClick={() => setShowKb((v) => !v)}
              style={{
                background: showKb ? "rgba(30,136,255,0.15)" : "transparent",
                border: "1px solid",
                borderColor: showKb ? "rgba(30,136,255,0.5)" : "rgba(30,80,160,0.3)",
                borderRadius: 6,
                padding: "5px 8px",
                cursor: "pointer",
                color: showKb ? "#1e88ff" : "#3a5a90",
                fontSize: 14,
                transition: "all 0.2s",
              }}
              title="Toggle keyboard"
            >
              ⌨
            </button>
          </div>

          {/* Result preview */}
          {result && result !== "Error" && (
            <div style={{
              marginTop: 8,
              padding: "8px 16px",
              background: "rgba(0,30,80,0.4)",
              border: "1px solid rgba(0,200,150,0.2)",
              borderRadius: 6,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              animation: "fadeIn 0.2s ease",
            }}>
              <span style={{ color: "#5a80b0", fontSize: 12, letterSpacing: "0.1em" }}>= </span>
              <span style={{ color: "#00d4aa", fontFamily: "'Share Tech Mono', monospace", fontSize: 20, letterSpacing: "0.05em" }}>{result}</span>
            </div>
          )}
          {result === "Error" && (
            <div style={{ marginTop: 8, padding: "6px 14px", background: "rgba(80,0,0,0.4)", border: "1px solid rgba(255,60,60,0.2)", borderRadius: 6, color: "#ff6060", fontSize: 13 }}>
              Syntax error
            </div>
          )}
        </div>

        {/* Keyboard Panel */}
        {showKb && (
          <div
            ref={kbRef}
            style={{
              background: "linear-gradient(180deg, #0d1628 0%, #0a1220 100%)",
              borderTop: "1px solid rgba(30,80,160,0.3)",
              padding: "10px 8px 16px",
              animation: "slideUp 0.25s cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            {/* Tabs */}
            <div style={{ display: "flex", gap: 4, marginBottom: 10, padding: "0 4px" }}>
              {TABS.map((tab, i) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(i)}
                  style={{
                    flex: 1,
                    background: activeTab === i ? "rgba(30,136,255,0.15)" : "transparent",
                    border: "none",
                    borderBottom: `2px solid ${activeTab === i ? "#1e88ff" : "transparent"}`,
                    color: activeTab === i ? "#1e88ff" : "#4a6a90",
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: 13,
                    padding: "6px 4px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    borderRadius: "4px 4px 0 0",
                  }}
                >
                  {tab}
                </button>
              ))}

              {/* Undo/Redo placeholders */}
              <div style={{ display: "flex", gap: 2, marginLeft: "auto" }}>
                {["↩", "↪"].map((s) => (
                  <button key={s} style={{ background: "transparent", border: "1px solid rgba(30,80,160,0.3)", borderRadius: 6, color: "#3a5a90", fontSize: 14, width: 32, height: 32, cursor: "pointer" }}>
                    {s}
                  </button>
                ))}
                <button style={{ background: "transparent", border: "1px solid rgba(30,80,160,0.3)", borderRadius: 6, color: "#3a5a90", fontSize: 14, width: 32, height: 32, cursor: "pointer" }}>
                  ⧉
                </button>
              </div>
            </div>

            {/* Keys */}
            {keys.map((row, ri) => (
              <div key={ri} style={{ display: "flex", gap: 4, marginBottom: 4, justifyContent: "center" }}>
                {row.map((key, ki) => {
                  const isWide = SPECIAL_WIDE.includes(key);
                  const isAction = ["↵", "="].includes(key);
                  const isDelete = key === "⌫";
                  const isNav = ["‹", "›"].includes(key);
                  const isNum = /^[0-9]$/.test(key);

                  return (
                    <button
                      key={ki}
                      onClick={() => handleKey(key)}
                      style={{
                        flex: isWide ? 1.4 : 1,
                        minWidth: 0,
                        height: 42,
                        background: isAction
                          ? "rgba(30,136,255,0.2)"
                          : isDelete
                          ? "rgba(180,40,40,0.15)"
                          : isNum
                          ? "rgba(255,255,255,0.06)"
                          : "rgba(255,255,255,0.04)",
                        border: `1px solid ${
                          isAction
                            ? "rgba(30,136,255,0.4)"
                            : isDelete
                            ? "rgba(180,40,40,0.3)"
                            : "rgba(30,80,160,0.2)"
                        }`,
                        borderRadius: 8,
                        color: isAction
                          ? "#5aaeff"
                          : isDelete
                          ? "#ff7070"
                          : isNav
                          ? "#1e88ff"
                          : isNum
                          ? "#e8f4ff"
                          : "#a0c0e0",
                        fontFamily: "'Share Tech Mono', monospace",
                        fontSize: key.length > 1 ? 13 : 16,
                        cursor: "pointer",
                        transition: "all 0.1s",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onMouseDown={(e) => {
                        e.currentTarget.style.background = isAction
                          ? "rgba(30,136,255,0.35)"
                          : isDelete
                          ? "rgba(180,40,40,0.3)"
                          : "rgba(255,255,255,0.12)";
                        e.currentTarget.style.transform = "scale(0.95)";
                      }}
                      onMouseUp={(e) => {
                        e.currentTarget.style.background = isAction
                          ? "rgba(30,136,255,0.2)"
                          : isDelete
                          ? "rgba(180,40,40,0.15)"
                          : isNum
                          ? "rgba(255,255,255,0.06)"
                          : "rgba(255,255,255,0.04)";
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      {key}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        * { box-sizing: border-box; }
        body { margin: 0; }
        button:focus { outline: none; }
      `}</style>
    </div>
  );
}
