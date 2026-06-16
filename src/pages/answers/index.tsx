import React, { useState } from "react";
import { answersResponce } from "../../utils/responce";
import { dataMock } from "../home/mockdata";
import MathFormulaInput from "../home/input_writing";
import { Input } from "../../components/input";
const Anwers = () => {
    const [answers, setAnswers] = useState(Array(55).fill(null));
    const [modalData, setModalData] = useState<any>(null);
    console.log(answers)
    const [name, setName] = useState("")
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
  try {
    console.log({
        name,
        responce: answers,
        status:"ACTIVE"
      })
    const res = await fetch("http://localhost:3000/test", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        responce: answers,
        status:"ACTIVE"
      }),
    });

    if (!res.ok) {
      throw new Error("Backendga yuborishda xatolik");
    }

    const data = await res.json();
    setModalData(data);
  } catch (error) {
    console.error("Xatolik:", error);
    alert("Hammasini toltir")
  }
};
    return (<section className="min-h-screen bg-[rgb(var(--background))] flex justify-center py-10 px-3 mb-10 transition-colors duration-500">
        <div className="w-full max-w-2xl bg-[rgb(var(--surface))]/90 backdrop-blur-md shadow-xl rounded-3xl border border-[rgb(var(--border))]/50 p-5 transition-all duration-300">
            {/* HEADER */}
            <header className="text-center font-extrabold text-3xl uppercase tracking-wide text-[rgb(var(--primary))] drop-shadow-sm">
                Yangi test Tayorlash
            </header>

            <div className="">
                <h1 className="text-center text-[rgb(var(--text))] text-2xl font-bold mt-4 mb-2">Test Nomi</h1>
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
                  <h1 className="text-center text-[rgb(var(--text))] text-2xl font-bold mb-2">Test Javoblari</h1>
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
                        ${answers[qIndex] === answersResponce(index)
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
                                                className={`transition-transform duration-200 ${answers[qIndex] === answersResponce(index)
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
                        className="mt-8 w-full py-4 rounded-2xl font-semibold text-lg text-white bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] hover:from-[rgb(var(--secondary))] hover:to-[rgb(var(--primary))] shadow-md hover:shadow-lg transition-all duration-300 active:scale-95 disabled:opacity-50"
                    >
                        Yangi Test Yaratish
                    </button>
                </>
            </div>

             
        </div>
        {modalData && (
                <div className="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="w-full max-w-sm p-6 text-center shadow-2xl bg-[rgb(var(--surface))] border border-[rgb(var(--border))]/80 rounded-2xl scale-in-animation">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full dark:bg-green-900/30">
                            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        
                        <h2 className="text-xl font-bold text-[rgb(var(--text))] mb-2">
                            Test muvaffaqiyatli yaratildi!
                        </h2>
                        
                        <div className="p-3 my-4 text-left text-sm rounded-xl bg-[rgb(var(--background))] border border-[rgb(var(--border))]/50">
                            <p className="text-[rgb(var(--text))]/70">
                                <strong className="text-[rgb(var(--text))]">ID:</strong> {modalData.id || modalData._id || "Mavjud emas"}
                            </p>
                            <p className="text-[rgb(var(--text))]/70 mt-1">
                                <strong className="text-[rgb(var(--text))]">Nomi:</strong> {modalData.name || name}
                            </p>
                            <p className="text-[rgb(var(--text))]/70 mt-1">
                                <strong className="text-[rgb(var(--text))]">Holati:</strong> {modalData.status || "ACTIVE"}
                            </p>
                        </div>

                        <button
                            onClick={() => window.location.href = "/"}
                            className="w-full py-3 font-semibold text-white rounded-xl bg-[rgb(var(--primary))] hover:opacity-90 shadow-md transition-all active:scale-95"
                        >
                            Bosh sahifaga oʻtish
                        </button>
                    </div>
                </div>
            )}
    </section>)
}

export default Anwers