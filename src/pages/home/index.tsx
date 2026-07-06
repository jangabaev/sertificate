import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { TestListSkeleton } from "./loading_dashbord";
import { motion, AnimatePresence } from "framer-motion";
import { FaCalendarAlt } from "react-icons/fa";
import { IoMdRefresh } from "react-icons/io";
import { MdPeopleAlt } from "react-icons/md";
import { IoAlarm } from "react-icons/io5";
import CryptoJS from "crypto-js";
import confetti from "canvas-confetti";

export type TestSummary = {
  id: string;
  name: string;
  participantsCount?: number;
  startedAt?: string | null;
  endsAt?: string | null;
  isActive?: boolean;
  status?: string;
  type?: "FREE" | "PREMIUM";
  price?: number;
  userTest?: string[];
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
  const [premiumTest, setPremiumTest] = useState<TestSummary | null>(null);
  const [buying, setBuying] = useState(false);
  const [buyError, setBuyError] = useState<string | null>(null);
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const navigate = useNavigate();
  const telegramId =
    (window as any).Telegram?.WebApp.initDataUnsafe?.user?.id || "1";

  const fireConfetti = () => {
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.7 }, colors: ["#f59e0b", "#fbbf24", "#fde68a", "#ffffff"] });
    setTimeout(() => confetti({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0, y: 0.7 }, colors: ["#f59e0b", "#fbbf24", "#fff"] }), 150);
    setTimeout(() => confetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1, y: 0.7 }, colors: ["#f59e0b", "#fbbf24", "#fff"] }), 300);
  };

  const handleBuyPremium = async () => {
    if (!premiumTest) return;
    setBuyError(null);
    setBuying(true);
    const encryptedToken = CryptoJS.AES.encrypt(
      telegramId.toString(), 
      import.meta.env.VITE_JWT_SECRET,
    ).toString();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/test/buy`, {
        method: "POST",
        headers: { token: encryptedToken, "Content-Type": "application/json" },
        body: JSON.stringify({ id: premiumTest.id }),
      });
      if (res.status === 401) {
        setPremiumTest(null);
        setShowBalanceModal(true);
        return;
      }
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (data?.url) {
        fireConfetti();
        setTimeout(() => { window.location.href = data.url; }, 600);
      } else {
        fireConfetti();
        setTests((prev) =>
          prev.map((t) =>
            t.id === premiumTest.id
              ? { ...t, userTest: [...(t.userTest ?? []), String(telegramId)] }
              : t,
          ),
        );
        setPremiumTest(null);
      }
    } catch {
      setBuyError("Xatolik yuz berdi. Qayta urinib ko'ring.");
    } finally {
      setBuying(false);
    }
  };

  const activeTestsCount = useMemo(
    () => tests.filter((test) => test.isActive !== false).length,
    [tests],
  );

  const navigateClick = (testId: string, status: string) => {
    if (status === "INACTIVE") {
      navigate(`/results/${testId}`);
    } else {
      navigate(`/exam/${testId}`);
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        setTests([]);
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/test?sort_by=active`,
          {
            method: "GET",
            headers: {},
          },
        );
        const data = await response.json();
        setTests(data);
      } catch {
        setTests([]);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  return (
    <>
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
              <p className="mt-1 text-2xl font-bold">
                {loading ? "-" : tests.length}
              </p>
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
              <p className="text-base font-semibold">
                Hozircha faol testlar yo'q
              </p>
              <p className="mt-1 text-sm text-[rgb(var(--text-muted))]">
                Testlar qo'shilganda shu yerda ko'rinadi.
              </p>
            </motion.div>
          )}

          {!loading && tests.length > 0 && (
            <section className="flex flex-col gap-3">
              {tests.map((test, index) => {
                const isActive = test.isActive !== false;
                const isPremium = test.type === "PREMIUM";
                const isEnded = test.status === "INACTIVE";

                return (
                  <motion.article
                    key={test.id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04, duration: 0.25 }}
                    className={`rounded-2xl border bg-[rgb(var(--surface))] p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                      isPremium
                        ? "border-amber-400/40 hover:border-amber-400/70"
                        : "border-[rgb(var(--border))] hover:border-[rgb(var(--primary))]/30"
                    }`}
                  >
                    {/* TOP ROW */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        {/* Premium badge */}
                        {isPremium && (
                          <span className="mb-1.5 inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                            ⭐ PREMIUM
                          </span>
                        )}
                        <h2 className="line-clamp-2 text-base font-bold leading-snug text-[rgb(var(--text))]">
                          {test.name}
                        </h2>
                        <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-[rgb(var(--text-muted))]">
                          <FaCalendarAlt className="text-[rgb(var(--primary))]" />
                          {formatDate(test.startedAt)}
                        </p>
                      </div>

                      {/* Status badge */}
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                          isEnded
                            ? "bg-red-500/10 text-red-500 dark:text-red-400"
                            : "bg-green-500/10 text-green-600 dark:text-green-400"
                        }`}
                      >
                        {isEnded ? "Tugadi" : "Faol"}
                      </span>
                    </div>

                    {/* STATS ROW */}
                    <div className="mt-3 flex items-center gap-2 text-xs text-[rgb(var(--text-muted))]">
                      <div className="flex items-center gap-1.5 rounded-xl bg-[rgb(var(--background))] px-3 py-2">
                        <MdPeopleAlt className="text-sm text-[rgb(var(--primary))]" />
                        <span>{test?.students?.length ?? 0} kishi</span>
                      </div>
                      <div className="flex items-center gap-1.5 rounded-xl bg-[rgb(var(--background))] px-3 py-2">
                        <IoAlarm className="text-sm text-[rgb(var(--primary))]" />
                        <span>{formatTime(test.endsAt)}</span>
                      </div>
                      {isPremium && test.price != null && (
                        <div className="ml-auto flex items-center gap-1 rounded-xl bg-amber-500/10 px-3 py-2 font-bold text-amber-600 dark:text-amber-400">
                          <span>{test.price.toLocaleString("ru-RU")} so'm</span>
                        </div>
                      )}
                    </div>

                    {/* ACTION BUTTON */}
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        if (
                          isPremium &&
                          !isEnded &&
                          !test.userTest?.includes(String(telegramId))
                        ) {
                          setPremiumTest(test);
                        } else {
                          navigateClick(test.id, test?.status || "");
                        }
                      }}
                      disabled={!isActive}
                      className={`mt-3 inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60 ${
                        isEnded
                          ? "bg-[rgb(var(--primary))]/80 hover:bg-[rgb(var(--primary))]"
                          : test.userTest &&
                              test.userTest.includes(String(telegramId))
                            ? "bg-[rgb(var(--primary))] shadow-[rgb(var(--primary))]/20 hover:bg-[rgb(var(--secondary))]"
                            : isPremium
                              ? "bg-gradient-to-r from-amber-500 to-amber-400 shadow-amber-500/20 hover:from-amber-600 hover:to-amber-500"
                              : "bg-[rgb(var(--primary))] shadow-[rgb(var(--primary))]/20 hover:bg-[rgb(var(--secondary))]"
                      }`}
                    >
                      {isEnded ? (
                        "Natijalarni ko'rish"
                      ) : test.userTest &&
                        test.userTest.includes(String(telegramId)) ? (
                        "Test topshiringiz mumkin, sotib olgansiz"
                      ) : isPremium ? (
                        <>
                          <span>⭐</span>
                          <span>
                            {test.price != null
                              ? `${test.price.toLocaleString("ru-RU")} so'm to'lab topshirish`
                              : "Premium — Qatnashish"}
                          </span>
                        </>
                      ) : (
                        "Bepul topshirish"
                      )}
                    </motion.button>
                  </motion.article>
                );
              })}
            </section>
          )}
        </div>
      </main>

      {/* Premium bottom sheet */}
      <AnimatePresence>
        {premiumTest && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              onClick={() => {
                setPremiumTest(null);
                setBuyError(null);
              }}
            />

            {/* Sheet */}
            <motion.div
              key="sheet"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl bg-[rgb(var(--surface))] px-5 pb-10 pt-4 shadow-2xl"
            >
              {/* Handle */}
              <div className="mx-auto mb-5 h-1.5 w-10 rounded-full bg-[rgb(var(--border))]" />

              {/* Icon */}
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-amber-400 text-3xl shadow-lg shadow-amber-500/30">
                ⭐
              </div>

              <h2 className="text-center text-2xl font-extrabold text-[rgb(var(--text))]">
                {premiumTest?.name}
              </h2>
              <p className="mt-2 text-center text-sm text-[rgb(var(--text-muted))]">
                Bu imtihon premium hisoblanadi. To'lovdan so'ng darhol kirish
                imkoniyatiga ega bo'lasiz.
              </p>
              {premiumTest?.price != null && (
                <p className="mt-2 text-center text-xl font-extrabold text-amber-500">
                  {premiumTest.price.toLocaleString("ru-RU")} so'm
                </p>
              )}

              <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-amber-400/30 bg-amber-500/8 p-4">
                <div className="flex items-center gap-2 text-sm text-[rgb(var(--text))]">
                  <span className="text-amber-500">✓</span>
                  <span>Barcha premium testlarga kirish</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[rgb(var(--text))]">
                  <span className="text-amber-500">✓</span>
                  <span>Natijalarni darhol ko'rish</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[rgb(var(--text))]">
                  <span className="text-amber-500">✓</span>
                  <span>Xavfsiz to'lov tizimi</span>
                </div>
              </div>

              {buyError && (
                <p className="mt-4 rounded-xl bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-500">
                  {buyError}
                </p>
              )}

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleBuyPremium}
                disabled={buying}
                className="mt-5 h-13 w-full rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 text-base font-extrabold text-white shadow-lg shadow-amber-500/30 transition active:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {buying ? "Yuborilmoqda..." : "⭐ Sotib olish"}
              </motion.button>

              <button
                onClick={() => {
                  setPremiumTest(null);
                  setBuyError(null);
                }}
                className="mt-3 w-full rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--background))] py-3 text-sm font-semibold text-[rgb(var(--text-muted))] transition hover:text-[rgb(var(--text))]"
              >
                Bekor qilish
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Balance yetarli emas modal */}
      <AnimatePresence>
        {showBalanceModal && (
          <>
            <motion.div
              key="balance-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowBalanceModal(false)}
            />
            <motion.div
              key="balance-sheet"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl bg-[rgb(var(--surface))] px-5 pb-10 pt-4 shadow-2xl"
            >
              <div className="mx-auto mb-5 h-1.5 w-10 rounded-full bg-[rgb(var(--border))]" />

              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-4xl">
                💳
              </div>

              <h2 className="text-center text-xl font-extrabold text-[rgb(var(--text))]">
                Balans yetarli emas
              </h2>
              <p className="mt-2 text-center text-sm text-[rgb(var(--text-muted))]">
                Premium imtihonni sotib olish uchun balansni to'ldiring.
              </p>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setShowBalanceModal(false);
                  navigate("/balance");
                }}
                className="mt-6 h-13 w-full rounded-2xl bg-[rgb(var(--primary))] text-base font-extrabold text-white shadow-md shadow-[rgb(var(--primary))]/25 transition active:opacity-90"
              >
                Balansni to'ldirish
              </motion.button>

              <button
                onClick={() => setShowBalanceModal(false)}
                className="mt-3 w-full rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--background))] py-3 text-sm font-semibold text-[rgb(var(--text-muted))] transition hover:text-[rgb(var(--text))]"
              >
                Bekor qilish
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Dashboard;
