import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Results = () => {
  const navigate = useNavigate();

  // Demo uchun testlar ro‘yxati
  const [tests] = useState([
    { id: 1, name: "1-Test", status: "Davom etmoqda" },
    { id: 2, name: "2-Test", status: "Tugadi" },
    { id: 3, name: "3-Test", status: "Davom etmoqda" },
    { id: 4, name: "4-Test", status: "Tugadi" },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br bg-gray-100p-4">
      <h1 className="text-2xl font-bold text-white text-center mb-6">
        📚 Testlar ro‘yxati
      </h1>

      <div className="space-y-4 max-w-md mx-auto">
        {tests.map((test) => (
          <div
            key={test.id}
            onClick={() => navigate(`/tests/${test.id}`)}
            className="cursor-pointer bg-white rounded-2xl shadow-lg p-4 flex items-center justify-between hover:scale-[1.02] transition-transform"
          >
            <span className="text-lg font-semibold text-gray-800">
              {test.name}
            </span>
            <span
              className={`px-3 py-1 text-sm font-bold rounded-full ${
                test.status === "Davom etmoqda"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {test.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
