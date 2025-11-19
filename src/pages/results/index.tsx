import { useEffect, useState } from "react";
import { mockExams } from "./mockdata";
import { SkeletonCard } from "./loading";

export const Results = () => {
  const [data, setData] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  console.log(data);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://sertificate-backend12.onrender.com/api/exam"
        );
        const result = await response.json();
        setData(result);
      } catch (error) {
        setData(mockExams);
        console.error("Xatolik yuz berdi:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[rgb(var(--background))] text-[rgb(var(--text))] p-4 transition-colors duration-300">
      {/* Sarlavha */}
      <h1 className="text-center text-2xl font-bold mb-6 text-[rgb(var(--primary))]">
        📚 Testlar ro‘yxati
      </h1>

      {loading && (
        <>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </>
      )}
      {/* Test kartalari */}
      {data.map((test, index) => (
        <a
          key={test.id}
          href={`/results/${test.id}`}
          className="block bg-[rgb(var(--surface))] rounded-2xl shadow-md border border-[rgb(var(--border))] p-5 mb-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-[rgb(var(--primary))]/40"
        >
          <h2 className="text-lg font-semibold text-[rgb(var(--text))]">
            {test.name}
          </h2>

          {/* Status va vaqt */}
          <div className="flex justify-between items-center mt-2">
            <span
              className={`px-2 py-1 text-xs font-medium text-white rounded-full ${
                true ? "bg-[rgb(var(--success))]" : "bg-[rgb(var(--error))]"
              }`}
            >
              {true ? "Faol" : "Faol emas"}
            </span>
            <span className="text-[rgb(var(--text-muted))] text-sm">
              🕒 16:00
            </span>
          </div>

          {/* Ishtirokchilar soni */}
          <p className="mt-1 text-[rgb(var(--text-muted))] text-sm">
            👥 {78} kishi
          </p>

          {/* Tugma */}
          <div className="mt-4">
            <div className="bg-[rgb(var(--primary))] hover:bg-[rgb(var(--secondary))] text-white py-3 rounded-xl text-center font-medium shadow-sm transition-colors">
              🚀 Qatnashish
            </div>
          </div>
        </a>
      ))}

      {/* Pastda dekorativ gradient */}
      <div className="h-20 mt-8 rounded-3xl bg-gradient-to-r from-[rgb(var(--gradient-from))] to-[rgb(var(--gradient-to))] opacity-30 blur-lg"></div>
    </div>
  );
};
