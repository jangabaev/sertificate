import React, { use, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { TestListSkeleton } from "./loading_dashbord";
import { mockExams } from "../results/mockdata";
import { motion } from "framer-motion";
export type TestSummary = {
  id: string;
  name: string;
  participantsCount?: number;
  startedAt?: string | null;
  endsAt?: string | null;
  isActive?: boolean;
};
const Dashboard = () => {
  const [tests, setTests] = useState<TestSummary[]>([]);
  console.log(tests);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const navigateClick = (testId: string) => {
    navigate(`/exam/${testId}`);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        setTests([]);
        const responce = await fetch("http://192.168.1.104:5000/api/exam/", {
          method: "GET",
          headers: {},
        });
        const data = await responce.json();
        setLoading(false);
        setTests(data);
      } catch (error) {
        setTests(mockExams);
        setLoading(false);
      }
    };
    getData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0E1A] to-[#141E30] text-white px-3 py-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <h1 className="text-2xl font-extrabold tracking-tight">
          🎯{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Faol testlar
          </span>
        </h1>
        <button
          onClick={() => window.location.reload()}
          className="bg-white/10 backdrop-blur-lg px-3 py-1.5 rounded-full text-sm hover:bg-white/20 transition"
        >
          🔄 Yangilash
        </button>
      </motion.div>

      {loading && <TestListSkeleton />}

      {!loading && tests.length === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-400 mt-20"
        >
          Hozircha faol testlar yo‘q 😴
        </motion.p>
      )}

      {/* Test cards */}
      <div className="flex flex-col gap-5 mb-15">
        {tests.map((test, index) => (
          <motion.div
            key={test.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.07, type: "spring", stiffness: 80 }}
            className="relative rounded-3xl p-5 bg-white/10 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.4)] overflow-hidden border border-white/10"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/15 via-blue-500/10 to-indigo-600/10 pointer-events-none" />

            <div className="relative z-10 flex flex-col mb-4">
              <h2 className="text-xl font-extrabold leading-snug text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400 drop-shadow-md">
                {test.name}
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                📅 Boshlangan:{" "}
                {test.startedAt
                  ? new Date(test.startedAt).toLocaleDateString([], {
                      day: "2-digit",
                      month: "short",
                    })
                  : "—"}
              </p>
            </div>

            <div className="relative z-10 flex items-center justify-between text-sm text-gray-300 mb-4">
              <div className="flex items-center gap-2">
                <span className="bg-white/10 px-2 py-1 rounded-full">
                  👥 {test.participantsCount} kishi
                </span>
                {test.isActive ? (
                  <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded-full">
                    Active
                  </span>
                ) : (
                  <span className="bg-red-500/20 text-red-300 px-2 py-1 rounded-full">
                    Inactive
                  </span>
                )}
              </div>
              <span className="text-xs">
                ⏰{" "}
                {test.endsAt
                  ? new Date(test.endsAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "—"}
              </span>
            </div>

            {/* Qatnashish tugmasi */}
            <div className="relative z-10">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => navigateClick(test.id)}
                className="w-full py-2.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full font-semibold text-sm shadow-lg hover:shadow-cyan-500/30 transition-all duration-200"
              >
                🚀 Qatnashish
              </motion.button>
            </div>

            {/* Dekorativ “shine” effekt */}
            <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-r from-white/10 via-transparent to-transparent animate-[shine_4s_linear_infinite]" />
          </motion.div>
        ))}
      </div>

      {/* Shine animation */}
      <style>{`
        @keyframes shine {
          0% { transform: rotate(45deg) translate(-100%, -100%); opacity: 0.3; }
          50% { transform: rotate(45deg) translate(100%, 100%); opacity: 0.1; }
          100% { transform: rotate(45deg) translate(200%, 200%); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
