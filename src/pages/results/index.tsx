import { useEffect, useState } from "react";
import { mockExams } from "./mockdata";
export const Results = () => {
  const [data, setData] = useState<{ id: string; name: string }[]>([]);
  console.log(data);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://192.168.1.104:5000/api/exam");
        const result = await response.json();
        setData(result);
      } catch (error) {
        setData(mockExams);
        console.error("Xatolik yuz berdi:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 p-4">
      <h1 className="text-center text-2xl font-bold text-white mb-6">
        📚 Testlar ro‘yxati
      </h1>
      {data.map((test) => (
        <a
          key={test.id}
          href={`/results/${test.id}`}
          className="block bg-white rounded-xl shadow-lg p-4 mb-4 transform transition duration-300 hover:scale-105 hover:shadow-xl"
        >
          <h2 className="text-lg font-semibold">{test.name}</h2>
          <div className="flex justify-between items-center mt-2">
            <span
              className={`px-2 py-1 text-sm text-white rounded-full ${
                true ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {true ? "Faol" : "Faol emas"}
            </span>
            <span className="text-gray-500 text-sm">🕒 16:00</span>
          </div>
          <p className="mt-1 text-gray-500 text-sm">👥 {78} kishi</p>
          <div className="mt-4">
            <div className="bg-indigo-500 text-white py-3 rounded-lg text-center font-medium">
              🚀 Qatnashish
            </div>
          </div>
        </a>
      ))}
    </div>
  );
};
