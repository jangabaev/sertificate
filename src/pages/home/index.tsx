import React, { useState } from "react";
import { answersResponce } from "../../utils/responce";
import MathFormulaInput from "./input_writing";


import {dataMock} from "./mockdata"

export const Dashborad: React.FC = () => {
  const [answers, setAnswers] = useState(Array(dataMock.length).fill(null));
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);

  const handleOptionChange = (qIndex: any, optionIndex: any) => {
    const newAnswers = [...answers];
    newAnswers[qIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    let points = 0;
    dataMock.forEach((q, i) => { 
      if (answers[i] === q.correct) points++;
    });
    setScore(points);
    setFinished(true);
  };
  return (
    <section className="main">
      <div className="container">
        <header className='text-center font-bold text-2xl'>Mock Test 1</header>
        <div className="pt-3">
          {finished ? (
            <div className="text-center">
              <h2 className="text-xl font-bold">Natija: {score} / {dataMock.length}</h2>
            </div>
          ) : (
            <>
              {dataMock.map((q, qIndex) => (
                <div key={qIndex} className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">
                    {qIndex + 1}. {q.question}
                  </h3>
                  <div className="flex gap-6">
                    {Array(q.options).fill(null).map((_,index) => (
                       <label
                        key={index}
                        className={`flex items-center gap-2 rounded-full font-semibold text-xl bg-gray-200 hover:bg-green-200 cursor-pointer relative w-[40px] h-[40px] border justify-center ${index === answers[qIndex] && "bg-green-400 hover:bg-green-400"}`}
                      >
                        <input
                          type="radio"
                          name={`question-${qIndex}`}
                          value={index}
                          checked={answers[qIndex] === index}
                          onChange={() => handleOptionChange(qIndex, index)}
                          className="absolute opacity-0 w-[100%] h-[100%] text-blue-600 cursor-pointer"
                        />
                        {answersResponce(index)}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <MathFormulaInput/>

              <button
                onClick={handleSubmit}
                disabled={answers.includes(null)}
                className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
              >
                Yakunlash
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

