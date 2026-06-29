import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { answersResponce } from "../../utils/responce";
import MathFormulaInput from "../home/input_writing";
import { dataMock } from "../home/mockdata";

export const ExamSend: React.FC = () => {
  const [answers, setAnswers] = useState(Array(55).fill(null));
  const [oneExam, setOneExam] = useState<any>(null);
  const [modal, setModal] = useState<{ show: boolean; success: boolean }>({ show: false, success: false });
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
        `https://sertificatebackend-production.up.railway.app/test/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: telegramUser?.id, responce: answers }),
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
    <section className="min-h-screen bg-[rgb(var(--background))] flex justify-center py-10 px-3 mb-10 transition-colors duration-500">
      <div className="w-full max-w-2xl bg-[rgb(var(--surface))]/90 backdrop-blur-md shadow-xl rounded-3xl border border-[rgb(var(--border))]/50 p-5 transition-all duration-300">
        {/* HEADER */}
        <header className="text-center font-extrabold text-3xl uppercase tracking-wide text-[rgb(var(--primary))] drop-shadow-sm">
          {oneExam?.name || "Imtihon testi"}
        </header>

        <div className="pt-8">
          <>
            {/* SAVOLLAR */}
            {dataMock.map((q, qIndex) => (
              <div
                key={qIndex}
                className="mb-10 flex items-center gap-3 justify-start"
              >
                <h3 className="text-xl font-bold text-[rgb(var(--text))] w-6">
                  {qIndex + 1}.
                </h3>

                <div className="flex gap-2">
                  {Array(q.options)
                    .fill(null)
                    .map((_, index) => (
                      <label
                        key={index}
                        className={`flex items-center justify-center w-[40px] h-[40px] rounded-full font-bold text-lg border-2 transition-all duration-300 ease-in-out cursor-pointer select-none shadow-sm
                    ${
                      answers[qIndex] === answersResponce(index)
                        ? "bg-[rgb(var(--green))] text-white border-[rgb(var(--success))] shadow-lg scale-110"
                        : "bg-[rgb(var(--surface))] text-[rgb(var(--text))] border-[rgb(var(--border))] hover:border-[rgb(var(--primary))]/50 hover:shadow-md hover:scale-105"
                    }`}
                      >
                        <input
                          type="radio"
                          name={`question-${qIndex}`}
                          value={answersResponce(index)}
                          checked={answers[qIndex] === answersResponce(index)}
                          onChange={() => handleOptionChange(qIndex, index)}
                          className="hidden"
                        />
                        <span
                          className={`transition-transform duration-200 ${
                            answers[qIndex] === answersResponce(index)
                              ? "scale-110"
                              : "scale-100"
                          }`}
                        >
                          {answersResponce(index)}
                        </span>
                      </label>
                    ))}
                </div>
              </div>
            ))}

            {/* FORMULA INPUTLAR */}
            {Array(20)
              .fill(null)
              .map((_, qIndex) => (
                <div
                  key={qIndex}
                  className="flex gap-3 justify-center items-center mb-6"
                >
                  <p className="text-xl font-bold text-[rgb(var(--text))] w-8 text-right">
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

            {/* SUBMIT BUTTON */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="mt-8 w-full py-4 rounded-2xl font-semibold text-lg text-white bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] hover:from-[rgb(var(--secondary))] hover:to-[rgb(var(--primary))] shadow-md hover:shadow-lg transition-all duration-300 active:scale-95 disabled:opacity-50"
            >
              {loading ? "Yuborilmoqda..." : "✅ Yakunlash"}
            </button>
          </>
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
              className="w-full py-3 rounded-2xl font-semibold text-white bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] hover:opacity-90 transition-all duration-300 active:scale-95"
            >
              Bosh sahifaga o'tish
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
