import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { answersResponce } from "../../utils/responce";
import MathFormulaInput from "../home/input_writing";
import { dataMock } from "../home/mockdata";

export const ExamSend: React.FC = () => {
  const [answers, setAnswers] = useState(Array(55).fill(null));
  const [modal, setModal] = useState<{ show: boolean; success: boolean }>({
    show: false,
    success: false,
  });
  const [loading, setLoading] = useState(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleOptionChange = (qIndex: any, optionIndex: any) => {
    const newAnswers = [...answers];
    newAnswers[qIndex] = answersResponce(optionIndex);
    setAnswers(newAnswers);
  };

  const handleLatexChange = (index: number, newLatex: string) => {
    const updated = [...answers];
    updated[index] = newLatex;
    setAnswers(updated);
  };

  const handleSubmit = async () => {
    const tg = window.Telegram?.WebApp;
    tg?.ready();
    tg?.expand();
    const telegramUser = tg?.initDataUnsafe?.user;
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/test/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: telegramUser?.id || 12,
            responce: answers,
          }),
        },
      );
      if (!res.ok) throw new Error("Server xatosi");
      await res.json();
      setModal({ show: true, success: true });
    } catch {
      setModal({ show: true, success: false });
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setModal({ show: false, success: false });
    navigate("/");
  };

  return (
    <section className="min-h-screen bg-[rgb(var(--background))] justify-center pb-24 pt-6 px-3 transition-colors duration-500">
      <div className="w-full max-w-2xl m-auto">
        <h1 className="text-center text-2xl font-extrabold tracking-wide text-[rgb(var(--primary))] px-5 py-4">
          {"Imtihon testi"}
        </h1>
        <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] shadow-sm overflow-hidden">
          {dataMock.map((q, qIndex) => {
            const selected = answers[qIndex];
            return (
              <div
                key={qIndex}
                className="flex items-center gap-3 px-4 py-2.5 border-b border-[rgb(var(--border))] last:border-b-0"
              >
                <span className="w-7 shrink-0 text-sm font-bold text-[rgb(var(--text-muted))]">
                  {qIndex + 1}.
                </span>
                <div className="flex gap-1.5 flex-wrap">
                  {Array(q.options)
                    .fill(null)
                    .map((_, index) => {
                      const letter = answersResponce(index);
                      const isSelected = selected === letter;
                      return (
                        <label
                          key={index}
                          className={`flex items-center justify-center w-9 h-9 rounded-xl font-bold text-sm border-2 cursor-pointer select-none transition-all duration-200
                            ${
                              isSelected
                                ? "bg-[rgb(var(--primary))] text-white border-[rgb(var(--primary))] shadow-md shadow-[rgb(var(--primary))]/30 scale-105"
                                : "bg-[rgb(var(--background))] text-[rgb(var(--text))] border-[rgb(var(--border))] hover:border-[rgb(var(--primary))]/60 hover:text-[rgb(var(--primary))]"
                            }`}
                        >
                          <input
                            type="radio"
                            name={`question-${qIndex}`}
                            value={letter}
                            checked={isSelected}
                            onChange={() => handleOptionChange(qIndex, index)}
                            className="hidden"
                          />
                          {letter}
                        </label>
                      );
                    })}
                </div>
              </div>
            );
          })}
        </div>

        {/* FORMULA INPUTLAR */}
        <div className="mt-4 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] shadow-sm overflow-hidden">
          {Array(20)
            .fill(null)
            .map((_, qIndex) => (
              <div
                key={qIndex}
                className="flex gap-3 items-center px-4 py-2.5 border-b border-[rgb(var(--border))] last:border-b-0"
              >
                <p className="text-sm font-bold text-[rgb(var(--text-muted))] w-10 shrink-0 text-right">
                  {qIndex % 2 === 1
                    ? `${Math.floor(qIndex / 2) + 36}b`
                    : `${Math.round(qIndex / 2) + 36}a`}
                </p>
                <div className="w-full mathInputContainer">
                  <MathFormulaInput
                    value={answers[qIndex + 35]}
                    onChange={(newLatex) =>
                      handleLatexChange(qIndex + 35, newLatex)
                    }
                  />
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* SUBMIT — sticky pastki panel */}
      <div className=" bottom-10 left-0 right-0 z-40 border-t border-[rgb(var(--border))]  px-2 py-2">
        <div className="mx-auto w-full max-w-2xl">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full h-13 rounded-2xl font-bold text-base text-white bg-[rgb(var(--primary))] hover:bg-[rgb(var(--secondary))] shadow-md shadow-[rgb(var(--primary))]/25 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Yuborilmoqda...
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Testni yakunlash
              </>
            )}
          </button>
        </div>
      </div>

      {/* MODAL */}
      {modal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[rgb(var(--surface))] rounded-3xl shadow-2xl p-8 mx-4 max-w-sm w-full text-center border border-[rgb(var(--border))]/50 animate-fade-in">
            <div className="text-5xl mb-4">{modal.success ? "✅" : "❌"}</div>
            <h2 className="text-2xl font-bold text-[rgb(var(--text))] mb-2">
              {modal.success ? "Muvaffaqiyatli!" : "Hatolik!"}
            </h2>
            <p className="text-[rgb(var(--text))]/70 mb-6">
              {modal.success
                ? "Javobingiz muvaffaqiyatli yuborildi."
                : "Javob yuborishda xatolik yuz berdi. Qayta urinib ko'ring."}
            </p>
            <button
              onClick={handleModalClose}
              className="w-full py-3 rounded-2xl font-semibold text-white from-[rgb(var(--primary))] to-[rgb(var(--secondary))] hover:opacity-90 transition-all duration-300 active:scale-95"
            >
              Bosh sahifaga o'tish
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
