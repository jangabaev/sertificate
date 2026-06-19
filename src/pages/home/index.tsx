import { useEffect, useMemo, useState } from "react";
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
  status?:string
};

const formatDate = (date?: string | null) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString([], {
    day: "2-digit",
    month: "short",
  });
};

const formatTime = (date?: string | null) => {
  if (!date) return "-";

  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const Dashboard = () => {
  const [tests, setTests] = useState<TestSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const activeTestsCount = useMemo(
    () => tests.filter((test) => test.isActive !== false).length,
    [tests]
  );

  const navigateClick = (testId: string,status:string) => {
    if(status==="INACTIVE"){
navigate(`/results/${testId}`);
    }else{
navigate(`/exam/${testId}`)
    }
    
  };

  console.log(tests)

  useEffect(() => {
    const getData = async () => {
      try {
        setTests([]);
        const response = await fetch(`http://localhost:3000/test`, {
          method: "GET",
          headers: {},
        });
        const data = await response.json();
        setTests(data);
      } catch {
        setTests(mockExams);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  return (
    <main className="min-h-screen bg-[rgb(var(--background))] px-4 pb-24 pt-4 text-[rgb(var(--text))]">
      <div className="mx-auto flex w-full max-w-xl flex-col gap-5">
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between gap-4"
        >
          <div>
            <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[rgb(var(--primary))]/10 text-[rgb(var(--primary))] ring-1 ring-[rgb(var(--primary))]/15">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 198 139"
                preserveAspectRatio="xMidYMid meet"
                aria-hidden="true"
              >
                <g
                  transform="translate(-6,171) scale(.1,-.1)"
                  stroke="none"
                  fill="currentColor"
                >
                  <path d="M575 1323 c-332 -642 -515 -998 -515 -1000 0 -2 58 -3 129 -3 l129 0 76 150 77 150 98 0 98 0 54 81 c42 65 55 78 63 66 6 -8 32 -44 58 -80 l47 -66 97 -3 97 -3 76 -145 76 -145 129 -3 c120 -2 128 -1 122 15 -4 10 -146 286 -315 613 -170 327 -327 632 -350 678 -23 45 -42 82 -44 82 -1 0 -92 -174 -202 -387z m300 -309 c50 -96 91 -179 93 -185 2 -5 -73 -9 -192 -9 l-196 0 46 93 c75 148 145 277 152 277 4 0 48 -79 97 -176z" />
                  <path d="M1660 910 l0 -109 -112 -3 -113 -3 -3 -72 -3 -73 116 0 115 0 0 -110 0 -110 75 0 75 0 1 88 c1 48 2 96 3 107 1 19 9 20 114 23 l112 3 0 74 0 74 -112 3 -112 3 3 108 3 107 -81 0 -81 0 0 -110z" />
                  <path d="M722 547 c-51 -52 -52 -54 -52 -112 l0 -59 53 52 52 52 53 -52 52 -53 0 58 c0 55 -3 61 -47 113 -27 29 -50 54 -53 54 -3 0 -29 -24 -58 -53z" />
                </g>
              </svg>
            </div>
            <p className="text-sm font-medium text-[rgb(var(--text-muted))]">
              Dashboard
            </p>
            <h1 className="text-3xl font-bold tracking-normal">Testlar</h1>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3 text-sm font-semibold text-[rgb(var(--text))] shadow-sm transition hover:border-[rgb(var(--primary))]/40 hover:text-[rgb(var(--primary))] active:scale-95"
            aria-label="Testlarni yangilash"
          >
            <IoMdRefresh className="text-lg" />
            <span>Yangilash</span>
          </button>
        </motion.header>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-2 gap-3"
        >
          <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-4 shadow-sm">
            <p className="text-xs font-medium text-[rgb(var(--text-muted))]">
              Jami testlar
            </p>
            <p className="mt-1 text-2xl font-bold">{loading ? "-" : tests.length}</p>
          </div>
          <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-4 shadow-sm">
            <p className="text-xs font-medium text-[rgb(var(--text-muted))]">
              Faol testlar
            </p>
            <p className="mt-1 text-2xl font-bold">
              {loading ? "-" : activeTestsCount}
            </p>
          </div>
        </motion.section>

        {loading && <TestListSkeleton />}

        {!loading && tests.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border border-dashed border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-5 py-12 text-center shadow-sm"
          >
            <p className="text-base font-semibold">Hozircha faol testlar yo'q</p>
            <p className="mt-1 text-sm text-[rgb(var(--text-muted))]">
              Testlar qo'shilganda shu yerda ko'rinadi.
            </p>
          </motion.div>
        )}

        {!loading && tests.length > 0 && (
          <section className="flex flex-col gap-3">
            {tests.map((test, index) => {
              const isActive = test.isActive !== false;

              return (
                <motion.article
                  key={test.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04, duration: 0.25 }}
                  className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[rgb(var(--primary))]/30 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="line-clamp-2 text-lg font-bold leading-snug">
                        {test.name}
                      </h2>
                      <p className="mt-2 inline-flex items-center gap-2 text-sm text-[rgb(var(--text-muted))]">
                        <FaCalendarAlt className="text-[rgb(var(--primary))]" />
                        <span>Boshlangan: {formatDate(test.startedAt)}</span>
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        test?.status==="ACTIVE"
                          ? "bg-green-500/10 text-green-600 dark:text-green-400"
                          :test?.status==="INACTIVE"?"bg-red-500/10 text-red-600 dark:text-red-400":"bg-green-500/10 text-green-600 dark:text-green-400"
                      }`}
                    >
                      {test?.status==="ACTIVE" ? "Faol" : "Test Tugadi"}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2 rounded-xl bg-[rgb(var(--background))] px-3 py-2 text-[rgb(var(--text-muted))]">
                      <MdPeopleAlt className="text-base text-[rgb(var(--primary))]" />
                      <span>{test.participantsCount ?? 0} kishi</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl bg-[rgb(var(--background))] px-3 py-2 text-[rgb(var(--text-muted))]">
                      <IoAlarm className="text-base text-[rgb(var(--primary))]" />
                      <span>Tugash: {formatTime(test.endsAt)}</span>
                    </div>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigateClick(test.id,test?.status||"")}
                    className={`cursor-pointer mt-4 inline-flex h-11 w-full items-center justify-center rounded-xl bg-[rgb(var(--primary))] px-4 text-sm font-bold text-white shadow-sm shadow-[rgb(var(--primary))]/20 transition hover:bg-[rgb(var(--secondary))] disabled:cursor-not-allowed disabled:opacity-60 ${test?.status==="INACTIVE"&&"hover:bg-green-500/10 hover:text-green-600 bg-green-600"}`}
                    disabled={!isActive}
                  >
                   {test?.status==="ACTIVE"?"Qatnashish" :"Natiyjalarni ko'rish"}
                  </motion.button>
                </motion.article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
};

export default Dashboard;
