import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { answersResponce } from "../../utils/responce";
import MathFormulaInput from "../home/input_writing";
import { getRandomName } from "../../utils/responce";
import { dataMock } from "../home/mockdata";

export const ExamSend: React.FC = () => {
  const [answers, setAnswers] = useState(Array(55).fill(null));
  const [oneExam, setOneExam] = useState<any>(null);
  const { id } = useParams<{ id: string }>();
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

  useEffect(() => {
    const oneGetExam = async () => {
      try {
        const responce = await fetch(
          `http://192.168.1.104:5000/api/exam/${id}`,
          {
            method: "GET",
            headers: {},
          }
        );
        const data = await responce.json();
        setOneExam(data);
      } catch (error) {
        setOneExam(null);
        console.error("Xatolik yuz berdi:", error);
      }
    };

    oneGetExam();
    const createUser = async () => {
      try {
        const user = {
          user_id: 1324213224,
          first_name: "Jan2gab2aev1",
          username: "@muxt3ar_dev2",
        };

        const res = await fetch(
          "http://192.168.1.104:5000/api/users/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
          }
        );

        const data = await res.json();
        console.log("✅ Serverdan javob:", data);
      } catch (error: any) {
        console.error("❌ Xatolik:", error.message);
      }
    };

    const testCheck = async () => {
      try {
        const test = {
          name: "Muxta221rqq",
          id: Math.floor(Math.random() * 10000),
          test: [
            "a",
            "a",
            "a",
            "a",
            "b",
            "b",
            "b",
            "b",
            "b",
            "b",
            "b",
            "b",
            "b",
            "b",
            "b",
            "b",
            "b",
            "c",
            "b",
            "a",
            "a",
            "a",
            "a",
            "a",
            "a",
            "a",
            "a",
            "a",
            "a",
            "a",
          ],
        };

        const res = await fetch("http://localhost:5000/api/tests", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(test),
        });

        const data = await res.json();
        console.log("✅ Serverdan javob:", data);
      } catch (error) {}
    };

    const getUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users", {
          method: "GET",
        });
        console.log(res);
      } catch (error) {}
    };

    const getTests = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/tests", {
          method: "GET",
        });
        console.log(res);
      } catch (error) {}
    };

    const createExam = async () => {
      try {
        const newUser = {
          name: "Mock Test 35",
          currect_answer: [
            "C",
            "B",
            "B",
            "B",
            "C",
            "D",
            "D",
            "B",
            "C",
            "D",
            "A",
            "B",
            "C",
            "B",
            "D",
            "A",
            "B",
            "D",
            "C",
            "A",
            "C",
            "D",
            "C",
            "B",
            "A",
            "D",
            "D",
            "D",
            "B",
            "C",
            "C",
            "C",
            "E",
            "C",
            "B",
            "2",
            "-2",
            "\\frac{\\pi}{14}",
            "17",
            "\\frac23",
            "-\\frac56",
            "y=x-3",
            "-1",
            "-\\sqrt3",
            "\\frac52",
            "20",
            "96",
            "169",
            "504",
            "6",
            "15\\sqrt3",
            "36\\pi",
            "36\\pi",
            "50",
            "30\\sqrt{26}",
          ],
        };

        const res = await fetch("http://localhost:5000/api/exam", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
        });

        const data = await res.json();
        console.log("✅ Serverdan javob:", data);
      } catch (error: any) {
        console.error("❌ Xatolik:", error.message);
      }
    };

    // getUser();
    // createExamTest();
    // createExam()
    // createExam();
    // createUser();
  }, []);

  const handleSubmit = () => {
    // setFinished(true);
    const testCheck = async () => {
      try {
        const test = {
          user_id: Math.floor(Math.random() * 10000),
          test: answers,
          name: getRandomName(),
        };

        const res = await fetch(`http://localhost:5000/api/exam/${id}/test`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(test),
        });

        const data = await res.json();
        console.log("✅ Serverdan javob:", data);
      } catch (error) {}
    };
    testCheck();
  };
  return (
    <section className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex justify-center py-10 px-2 mb-10">
      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl border border-green-100 p-2">
        {/* HEADER */}
        <header className="text-center font-extrabold text-3xl uppercase tracking-wide text-green-700 drop-shadow-sm">
          {oneExam?.name}
        </header>

        <div className="pt-6">
          <>
            {dataMock.map((q, qIndex) => (
              <div
                key={qIndex}
                className="mb-10 flex items-center gap-6 justify-start"
              >
                <h3 className="text-xl font-bold text-gray-800 w-5">
                  {qIndex + 1}.
                </h3>

                <div className="flex gap-3">
                  {Array(q.options)
                    .fill(null)
                    .map((_, index) => (
                      <label
                        key={index}
                        className={`flex items-center justify-center w-[40px] h-[40px] rounded-full font-bold text-lg border-2 transition-all duration-300 ease-in-out cursor-pointer select-none shadow-sm
                        ${
                          answers[qIndex] === answersResponce(index)
                            ? "bg-gradient-to-br from-green-500 to-green-600 text-white border-green-600 shadow-lg scale-110"
                            : "bg-white text-gray-700 border-gray-300 hover:border-green-400 hover:shadow-md hover:scale-105"
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

            {Array(20)
              .fill(null)
              .map((_, qIndex) => (
                <div className="flex gap-3 justify-center items-center">
                  <p className="text-xl font-bold text-gray-800 w-8">
                    {qIndex % 2 === 1
                      ? `${Math.floor(qIndex / 2) + 36}b`
                      : `${Math.round(qIndex / 2) + 36}a`}
                  </p>
                  <div className="w-full">
                    <MathFormulaInput
                      value={answers[qIndex + 35]}
                      onChange={(newLatex) =>
                        handleLatexChange(qIndex + 35, newLatex)
                      }
                    />
                  </div>
                </div>
              ))}

            {/* FORMULA INPUT */}

            {/* SUBMIT BUTTON */}
            <button
              onClick={handleSubmit}
              className="mt-6 w-full py-3 rounded-xl font-semibold text-lg text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50"
            >
              Yakunlash
            </button>
          </>
        </div>
      </div>
    </section>
  );
};
