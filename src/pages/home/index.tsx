import React, { useEffect, useState } from "react";
import { answersResponce } from "../../utils/responce";
import MathFormulaInput from "./input_writing";
import { getRandomName } from "../../utils/responce";
import { dataMock } from "./mockdata";

export const Dashborad: React.FC = () => {
  const [answers, setAnswers] = useState(Array(dataMock.length).fill(null));
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);

  const handleOptionChange = (qIndex: any, optionIndex: any) => {
    const newAnswers = [...answers];
    newAnswers[qIndex] = answersResponce(optionIndex);
    setAnswers(newAnswers);
  };

  useEffect(() => {
    const createUser = async () => {
      try {
        const newUser = {
          username: "Ali Vliyev",
          email: "ali@exa",
          password: "123416",
        };

        const res = await fetch("http://localhost:5000/api/users/register", {
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
          name: "mock test 1",
          currect_answer: [
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

    const createExamTest = async () => {
      try {
        const newUser = {
          user_id: 121312,
          test: [
            "a",
            "b",
            "b",
            "a",
            "b",
            "a",
            "a",
            "a",
            "a",
            "a",
            "a",
            "a",
            "b",
            "a",
            "a",
            "b",
            "a",
            "a",
            "a",
            "a",
            "b",
            "a",
            "a",
            "a",
            "b",
            "b",
            "a",
            "a",
            "b",
            "a",
          ],
          name: "{ type: String, required: true }",
        };

        const res = await fetch(
          "http://localhost:5000/api/exam/68fd2bed1f8e83b707c6269d/test",
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newUser),
          }
        );

        const data = await res.json();
        console.log("✅ Serverdan javob:", data);
      } catch (error: any) {
        console.error("❌ Xatolik:", error.message);
      }
    };

    // getUser();
    createExamTest();
    // createExam()
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

        const res = await fetch(
          "http://localhost:5000/api/exam/68fd2bed1f8e83b707c6269d/test",
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(test),
          }
        );

        const data = await res.json();
        console.log("✅ Serverdan javob:", data);
      } catch (error) {}
    };
    testCheck();
  };
  return (
    <section className="main">
      <div className="container">
        <header className="text-center font-bold text-2xl">Mock Test 1</header>
        <div className="pt-3">
          {finished ? (
            <div className="text-center">
              <h2 className="text-xl font-bold">
                Natija: {score} / {dataMock.length}
              </h2>
            </div>
          ) : (
            <>
              {dataMock.map((q, qIndex) => (
                <div
                  key={qIndex}
                  className="mb-8 flex align-center gap-6 justify-start"
                >
                  <h3 className="text-2xl font-bold w-6">{qIndex + 1}.</h3>
                  <div className="flex gap-6">
                    {Array(q.options)
                      .fill(null)
                      .map((_, index) => (
                        <label
                          key={index}
                          className={`flex items-center gap-2 rounded-full font-semibold text-xl bg-gray-200 hover:bg-green-200 cursor-pointer relative w-[40px] h-[40px] border justify-center ${
                            answers[qIndex] === answersResponce(index) &&
                            "bg-green-400 hover:bg-green-400"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${qIndex}`}
                            value={answersResponce(index)}
                            checked={answers[qIndex] === answersResponce(index)}
                            onChange={() => handleOptionChange(qIndex, index)}
                            className="absolute opacity-0 w-[100%] h-[100%] text-blue-600 cursor-pointer"
                          />
                          {answersResponce(index)}
                        </label>
                      ))}
                  </div>
                </div>
              ))}
              <MathFormulaInput />

              <button
                onClick={handleSubmit}
                disabled={answers.includes(null)}
                className="mt-4 mb-[100px] w-full py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 "
              >
                Yakunlash
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};
