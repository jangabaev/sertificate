import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { answersResponce } from "../../utils/responce";
import { dataMock } from "../home/mockdata";
import MathFormulaInput from "../home/input_writing";
import { Input } from "../../components/input";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Anwers = () => {
  const { id } = useParams<{ id: string }>();

  const [answers, setAnswers] = useState<(string | null)[]>(
    Array(55).fill(null),
  );
  const [modalData, setModalData] = useState<any>(null);
  const [name, setName] = useState("");
  const [testType, setTestType] = useState<"FREE" | "PREMIUM">("FREE");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    if (!id) return;

    const fetchTest = async () => {
      try {
        const res = await fetch(`${BASE_URL}/test/${id}`);
        if (!res.ok) throw new Error("Test topilmadi");
        const data = await res.json();

        if (data.name) setName(data.name);
        if (Array.isArray(data.responce)) {
          const filled = Array(55).fill(null);
          data.responce.forEach((val: string | null, i: number) => {
            if (i < filled.length) filled[i] = val;
          });
          setAnswers(filled);
        }
      } catch (error) {
        console.error("Test ma'lumotlarini olishda xatolik:", error);
        alert("Test ma'lumotlarini yuklab bo'lmadi");
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [id]);

  const handleOptionChange = (qIndex: number, optionIndex: number) => {
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
    const body: Record<string, any> = {
      name,
      responce: answers,
      status: "ACTIVE",
      user_id: 1849659907,
      type: testType,
      ...(testType === "PREMIUM" && { price: Number(price) }),
    };

    try {
      const isUpdate = !!id;
      const url = isUpdate ? `${BASE_URL}/test/${id}` : `${BASE_URL}/test`;
      const method = isUpdate ? "PUT" : "POST";

      console.log({ method, url, body });

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Backendga yuborishda xatolik");

      const data = await res.json();
      setModalData(data);
    } catch (error) {
      console.error("Xatolik:", error);
      alert("Hammasini toltir");
    }
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-[rgb(var(--background))] flex items-center justify-center">
        <p className="text-[rgb(var(--text))] text-xl font-semibold animate-pulse">
          Yuklanmoqda...
        </p>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[rgb(var(--background))] flex justify-center py-10 px-3 mb-10 transition-colors duration-500">
      <div className="w-full max-w-2xl bg-[rgb(var(--surface))]/90 backdrop-blur-md shadow-xl rounded-3xl border border-[rgb(var(--border))]/50 p-5 transition-all duration-300">
        {/* HEADER */}
        <header className="text-center font-extrabold text-3xl uppercase tracking-wide text-[rgb(var(--primary))] drop-shadow-sm">
          {id ? "Testni Tahrirlash" : "Yangi test Tayorlash"}
        </header>

        <div className="">
          <h1 className="text-center text-[rgb(var(--text))] text-2xl font-bold mt-4 mb-2">
            Test Nomi
          </h1>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            label=""
            type="text"
            placeholder="Test nomini kirgizing"
            required
          />
        </div>

        <div className="pt-8">
          <h1 className="text-center text-[rgb(var(--text))] text-2xl font-bold mb-2">
            Test Javoblari
          </h1>
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
                      value={answers[qIndex + 35] ?? ""}
                      onChange={(newLatex) =>
                        handleLatexChange(qIndex + 35, newLatex)
                      }
                    />
                  </div>
                </div>
              ))}

            {/* TEST TURI */}
            <div className="mt-8">
              <h2 className="text-center text-[rgb(var(--text))] text-xl font-bold mb-3">
                Test Turi
              </h2>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setTestType("FREE")}
                  className={`flex-1 py-3 rounded-2xl font-bold text-base border-2 transition-all duration-200 ${
                    testType === "FREE"
                      ? "border-[rgb(var(--primary))] bg-[rgb(var(--primary))]/10 text-[rgb(var(--primary))]"
                      : "border-[rgb(var(--border))] bg-[rgb(var(--surface))] text-[rgb(var(--text))] hover:border-[rgb(var(--primary))]/40"
                  }`}
                >
                  🆓 FREE
                </button>
                <button
                  type="button"
                  onClick={() => setTestType("PREMIUM")}
                  className={`flex-1 py-3 rounded-2xl font-bold text-base border-2 transition-all duration-200 ${
                    testType === "PREMIUM"
                      ? "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      : "border-[rgb(var(--border))] bg-[rgb(var(--surface))] text-[rgb(var(--text))] hover:border-amber-400/40"
                  }`}
                >
                  ⭐ PREMIUM
                </button>
              </div>

              {testType === "PREMIUM" && (
                <div className="mt-3">
                  <label className="block text-sm font-medium text-[rgb(var(--text-muted))] mb-1.5">
                    Narxi (so'm)
                  </label>
                  <input
                    type="number"
                    min={0}
                    inputMode="numeric"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Masalan: 50000"
                    className="h-12 w-full rounded-xl border border-amber-400/50 bg-[rgb(var(--background))] px-4 text-sm font-medium text-[rgb(var(--text))] outline-none transition placeholder:text-[rgb(var(--text-muted))] focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10"
                  />
                </div>
              )}
            </div>

            {/* SUBMIT BUTTON */}
            <button
              onClick={handleSubmit}
              className="mt-6 w-full py-4 rounded-2xl font-semibold text-lg text-white bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] hover:from-[rgb(var(--secondary))] hover:to-[rgb(var(--primary))] shadow-md hover:shadow-lg transition-all duration-300 active:scale-95 disabled:opacity-50"
            >
              {id ? "Testni Yangilash" : "Yangi Test Yaratish"}
            </button>
          </>
        </div>
      </div>

      {modalData && (
        <div className="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm p-6 text-center shadow-2xl bg-[rgb(var(--surface))] border border-[rgb(var(--border))]/80 rounded-2xl scale-in-animation">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full dark:bg-green-900/30">
              <svg
                className="w-6 h-6 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h2 className="text-xl font-bold text-[rgb(var(--text))] mb-2">
              {id
                ? "Test muvaffaqiyatli yangilandi!"
                : "Test muvaffaqiyatli yaratildi!"}
            </h2>

            <div className="p-3 my-4 text-left text-sm rounded-xl bg-[rgb(var(--background))] border border-[rgb(var(--border))]/50">
              <p className="text-[rgb(var(--text))]/70">
                <strong className="text-[rgb(var(--text))]">ID:</strong>{" "}
                {modalData.id || modalData._id || id || "Mavjud emas"}
              </p>
              <p className="text-[rgb(var(--text))]/70 mt-1">
                <strong className="text-[rgb(var(--text))]">Nomi:</strong>{" "}
                {modalData.name || name}
              </p>
              <p className="text-[rgb(var(--text))]/70 mt-1">
                <strong className="text-[rgb(var(--text))]">Holati:</strong>{" "}
                {modalData.status || "ACTIVE"}
              </p>
            </div>

            <button
              onClick={() => (window.location.href = "/")}
              className="w-full py-3 font-semibold text-white rounded-xl bg-[rgb(var(--primary))] hover:opacity-90 shadow-md transition-all active:scale-95"
            >
              Bosh sahifaga oʻtish
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Anwers;
