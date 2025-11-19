import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { mockResult } from "./mockdata";

export const ResultId: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = React.useState<
    { name: string; total_ball: number }[]
  >([]);
  const [testTitle, setTestTitle] = React.useState<string>("");

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await fetch(
          `https://sertificate-backend12.onrender.com/api/rash/${id}`
        );
        const result = await response.json();
        setTestTitle(result?.name || "");
        setData(result?.new_students || []);
      } catch (error) {
        console.error("Maʼlumotni olishda xatolik:", error);
        setData(mockResult);
      }
    };
    fetchResult();
  }, [id]);

  return (
    <section className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-8">
          📚 Test natijalari —{" "}
          <span className="text-indigo-600">{testTitle}</span>
        </h1>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  #
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  F.I.O
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  Ball
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {data.length > 0 ? (
                data.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {item.name}
                    </td>
                    <td className="px-4 py-3 font-semibold text-indigo-600">
                      {Math.floor(item.total_ball * 100) / 100}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-6 text-gray-500">
                    Maʼlumot topilmadi
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
