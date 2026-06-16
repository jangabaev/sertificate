import React, { use, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { TestListSkeleton } from "./loading_dashbord";
import { mockExams } from "../results/mockdata";
import { motion } from "framer-motion";
import { FaCalendarAlt } from "react-icons/fa";
import { IoMdRefresh } from "react-icons/io";
import { MdPeopleAlt } from "react-icons/md";
import { IoAlarm } from "react-icons/io5";
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
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const navigateClick = (testId: string) => {
    navigate(`/exam/${testId}`);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        setTests([]);
        const responce = await fetch(`http://localhost:3000/test`, {
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
    <div className="min-h-screen bg-[rgb(var(--background))] px-3 py-4 text-[rgb(var(--text))]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex gap-3 items-center text-[rgb(var(--text))]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.0"
            width="30.000000pt"
            height="28.996312pt"
            viewBox="0 0 198.000000 138.996312"
            preserveAspectRatio="xMidYMid meet"
          >
            <metadata>
              Created by potrace 1.12, written by Peter Selinger 2001-2015
            </metadata>
            <g
              transform="translate(-6.000000,170.996312) scale(0.100000,-0.100000)"
              stroke="none"
              fill="currentColor"
              className="text-[rgb(var(--text))]"
            >
              <path d="M575 1323 c-332 -642 -515 -998 -515 -1000 0 -2 58 -3 129 -3 l129 0 76 150 77 150 98 0 98 0 54 81 c42 65 55 78 63 66 6 -8 32 -44 58 -80 l47 -66 97 -3 97 -3 76 -145 76 -145 129 -3 c120 -2 128 -1 122 15 -4 10 -146 286 -315 613 -170 327 -327 632 -350 678 -23 45 -42 82 -44 82 -1 0 -92 -174 -202 -387z m300 -309 c50 -96 91 -179 93 -185 2 -5 -73 -9 -192 -9 l-196 0 46 93 c75 148 145 277 152 277 4 0 48 -79 97 -176z" />
              <path d="M1660 910 l0 -109 -112 -3 -113 -3 -3 -72 -3 -73 116 0 115 0 0 -110 0 -110 75 0 75 0 1 88 c1 48 2 96 3 107 1 19 9 20 114 23 l112 3 0 74 0 74 -112 3 -112 3 3 108 3 107 -81 0 -81 0 0 -110z" />
              <path d="M722 547 c-51 -52 -52 -54 -52 -112 l0 -59 53 52 52 52 53 -52 52 -53 0 58 c0 55 -3 61 -47 113 -27 29 -50 54 -53 54 -3 0 -29 -24 -58 -53z" />
            </g>
          </svg>
          <h1 className="text-2xl font-extrabold tracking-tight">
            {" "}
            <span className="bg-clip-text">Testlar</span>
          </h1>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="bg-[rgb(var(--border))] cursor-pointer flex gap-1 justify-center items-center backdrop-blur-lg px-3 py-1.5 rounded-full text-sm hover:bg-white/20 transition"
        >
          <IoMdRefresh /> Yangilash
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
            className="relative rounded-3xl p-5 bg-white/10 backdrop-blur-xl shadow-[0_4px_30px_rgba(--border)] overflow-hidden border border-white/10"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/15 via-blue-500/10 to-indigo-600/10 pointer-events-none" />

            <div className="relative z-10 flex flex-col mb-4">
              <h2 className="text-xl font-extrabold leading-snug text-[rgb(var(--primary))] drop-shadow-md">
                {test.name}
              </h2>
              <p className="flex items-center gap-2 text-xs text-[rgb(var(--text))] mt-1">
                <FaCalendarAlt /> Boshlangan:{" "}
                {test.startedAt
                  ? new Date(test.startedAt).toLocaleDateString([], {
                    day: "2-digit",
                    month: "short",
                  })
                  : "—"}
              </p>
            </div>

            <div className="relative z-10 flex items-center justify-between text-sm text-[rgb(var(--text))] mb-4">
              <div className="flex items-center gap-2">
                <span className="flex gap-2 items-center bg-white/10 px-2 py-1 rounded-full">
                  <MdPeopleAlt /> {test.participantsCount} kishi
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
              <span className="text-xs flex items-center gap-1">
                <IoAlarm />{" "}
                {test.endsAt
                  ? new Date(test.endsAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                  : "—"}
              </span>
            </div>

            {/* Qatnashish tugmasi */}
            <div className="relative z-10">            <motion.button
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
