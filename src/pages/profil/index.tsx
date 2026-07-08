import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiAward,
  FiCreditCard,
  FiPlusCircle,
  FiRefreshCw,
  FiTrendingUp,
  FiUser,
  FiX,
} from "react-icons/fi";
import CryptoJS from "crypto-js";

type ProfileUser = {
  allows_write_to_pm?: boolean;
  first_name?: string;
  id?: number;
  language_code?: string;
  last_name?: string;
  photo_url?: string;
  username?: string;
  balance?: number;
  tests?: ProfileResult[];
};

type ProfileResult = {
  id: number | string;
  name: string;
  score: number;
  degree: string;
  date: string;
  userAnswers?: string[];
  correctAnswers?: string[];
  checks?: number[];
};

type TelegramWebApp = {
  ready: () => void;
  expand: () => void;
  initDataUnsafe?: {
    user?: ProfileUser;
  };
};

const formatBalance = (value?: number) =>
  `${Math.max(0, Math.floor(value ?? 0)).toLocaleString("ru-RU")} so'm`;

type BackendResult = {
  id?: number | string;
  _id?: number | string;
  name?: string;
  testName?: string;
  title?: string;
  score?: number;
  total_ball?: number;
  ball?: number;
  degree?: string;
  level?: string;
  date?: string;
  createdAt?: string;
  finishedAt?: string;
  responce?: {
    responce?: string[];
  };
  stdResponce?: number[];
  testResponce?: string[];
};

type BackendUser = Omit<ProfileUser, "tests"> & {
  balance?: number;
  results?: BackendResult[];
  tests?: BackendResult[];
};

const mockResults: ProfileResult[] = [
  { id: 1, name: "Mock", score: 0, degree: " ", date: "2026-01-01" },
];

const defaultUser: ProfileUser = {
  allows_write_to_pm: true,
  first_name: "",
  id: 0,
  language_code: "en",
  last_name: "",
  photo_url: "",
  username: "",
  balance: 0,
  tests: [],
};

const degreeColors: Record<
  string,
  { text: string; bg: string; stroke: string }
> = {
  "A+": {
    text: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    stroke: "#10b981",
  },
  A: {
    text: "text-green-600 dark:text-green-400",
    bg: "bg-green-500/10",
    stroke: "#22c55e",
  },
  "B+": {
    text: "text-sky-600 dark:text-sky-400",
    bg: "bg-sky-500/10",
    stroke: "#0ea5e9",
  },
  B: {
    text: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10",
    stroke: "#3b82f6",
  },
  "C+": {
    text: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
    stroke: "#f59e0b",
  },
  C: {
    text: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-500/10",
    stroke: "#f97316",
  },
};

const getDegreeStyle = (degree: string) => {
  return (
    degreeColors[degree.toUpperCase()] || {
      text: "text-[rgb(var(--text-muted))]",
      bg: "bg-[rgb(var(--background))]",
      stroke: "#64748b",
    }
  );
};

const chartConfig = {
  width: 360,
  height: 150,
  left: 38,
  right: 350,
  top: 16,
  bottom: 128,
  minScore: 30,
  maxScore: 95,
};

const chartTicks = [30, 45, 60, 75, 95];

const normalizeResults = (tests?: BackendResult[]) => {
  if (!tests?.length) return mockResults;

  return tests.map((test, index) => ({
    id: test.id ?? test._id ?? index,
    name: test.name ?? test.testName ?? test.title ?? `Test ${index + 1}`,
    score: Number(test.score ?? test.total_ball ?? test.ball ?? 0),
    degree: String(test.degree ?? test.level ?? "-").toUpperCase(),
    date:
      test.date ??
      test.finishedAt ??
      test.createdAt ??
      new Date().toISOString(),
    userAnswers: test.responce?.responce ?? [],
    correctAnswers: test.testResponce ?? [],
    checks: test.stdResponce ?? [],
  }));
};

const getChartPoint = (
  result: ProfileResult,
  index: number,
  length: number,
) => {
  const plotWidth = chartConfig.right - chartConfig.left;
  const plotHeight = chartConfig.bottom - chartConfig.top;
  const safeScore = Math.min(
    chartConfig.maxScore,
    Math.max(chartConfig.minScore, result.score),
  );
  const progress =
    (safeScore - chartConfig.minScore) /
    (chartConfig.maxScore - chartConfig.minScore);
  const x =
    length === 1
      ? chartConfig.left + plotWidth / 2
      : chartConfig.left + (index / (length - 1)) * plotWidth;
  const y = chartConfig.bottom - progress * plotHeight;

  return { x, y };
};

const getTickY = (score: number) => {
  const plotHeight = chartConfig.bottom - chartConfig.top;
  const progress =
    (score - chartConfig.minScore) /
    (chartConfig.maxScore - chartConfig.minScore);

  return chartConfig.bottom - progress * plotHeight;
};

const getTooltipX = (x: number) => {
  return Math.min(chartConfig.right - 98, Math.max(chartConfig.left, x - 49));
};

const getChartPoints = (results: ProfileResult[]) => {
  return results
    .map((result, index) => {
      const { x, y } = getChartPoint(result, index, results.length);
      return `${x},${y}`;
    })
    .join(" ");
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString([], {
    day: "2-digit",
    month: "short",
  });
};

const LatexValue = ({ value }: { value?: string }) => {
  useEffect(() => {
    if (typeof window !== "undefined" && value?.includes("\\")) {
      import("mathlive");
    }
  }, [value]);

  if (!value) {
    return <span className="text-[rgb(var(--text-muted))]">-</span>;
  }

  if (!value.includes("\\")) {
    return <span>{value}</span>;
  }

  return (
    <math-field
      read-only
      value={value}
      virtual-keyboard-mode="off"
      data-menu="false"
      style={{
        display: "inline-block",
        minWidth: 0,
        border: 0,
        padding: 0,
        background: "transparent",
        fontSize: 16,
      }}
    />
  );
};

export const Profil = () => {
  const [user, setUser] = useState<ProfileUser>(defaultUser);

  const [selectedTest, setSelectedTest] = useState<ProfileResult | null>(null);
  const [hoveredResultId, setHoveredResultId] = useState<
    ProfileResult["id"] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const results = user.tests?.length ? user.tests : mockResults;
  const sortedResults = useMemo(
    () =>
      [...results].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      ),
    [results],
  );
  const latestResults = sortedResults.slice(-3).reverse();
  const chartPoints = useMemo(
    () => getChartPoints(sortedResults),
    [sortedResults],
  );

  const latestResult = sortedResults[sortedResults.length - 1];
  const bestScore = Math.max(...sortedResults.map((result) => result.score));
  const growth =
    sortedResults.length > 1
      ? latestResult.score - sortedResults[0].score
      : (latestResult?.score ?? 0);
  const selectedQuestions = selectedTest
    ? Array.from({
        length: Math.max(
          selectedTest.userAnswers?.length ?? 0,
          selectedTest.correctAnswers?.length ?? 0,
          selectedTest.checks?.length ?? 0,
        ),
      })
    : [];

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    tg?.ready();
    tg?.expand();

    const telegramUser = tg?.initDataUnsafe?.user;

    if (telegramUser) {
      setUser((currentUser) => ({
        ...currentUser,
        ...telegramUser,
        tests: currentUser.tests,
      }));
    }

    const encryptedToken = CryptoJS.AES.encrypt(
      telegramUser?.id.toString()||"1",
      import.meta.env.VITE_JWT_SECRET,
    ).toString();
    const getUserData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/users/12`,
          {
            method: "GET",
            headers: {
              token: encryptedToken,
              "Content-Type": "application/json",
            },
          },
        );

        const result: BackendUser = await response.json();
        console.log(result);
        const backendTests = result.results ?? result.tests;
        console.log(backendTests);
        setUser((currentUser) => ({
          ...currentUser,
          first_name: (result.first_name || telegramUser?.first_name) ?? "",
          last_name: (result.last_name || telegramUser?.last_name) ?? "",
          username: (result.username || telegramUser?.username) ?? "",
          photo_url: (result.photo_url || telegramUser?.photo_url) ?? "",
          id: (result.id || telegramUser?.id) ?? "",
          balance: Number(result.balance ?? 0),
          tests: normalizeResults(backendTests),
        }));
      } catch (error) {
        console.error("Ma'lumotni olishda xatolik:", error);
        setUser((currentUser) => ({
          ...currentUser,
          tests: mockResults,
        }));
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, []);

  return (
    <main className="min-h-screen bg-[rgb(var(--background))] px-4 pb-24 pt-4 text-[rgb(var(--text))]">
      <div className="mx-auto flex w-full max-w-xl flex-col gap-5">
        <section className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <img
              src={user.photo_url || "https://via.placeholder.com/100"}
              alt="Profil rasmi"
              className="h-20 w-20 rounded-2xl border border-[rgb(var(--border))] object-cover"
            />
            <div className="min-w-0">
              <p className="text-sm font-medium text-[rgb(var(--text-muted))]">
                Profil
              </p>
              <h1 className="truncate text-2xl font-bold">
                {user.first_name} {user.last_name || ""}
              </h1>
              <p className="truncate text-sm text-[rgb(var(--text-muted))]">
                @{user.username || "username yo'q"}
              </p>
            </div>
          </div>
        </section>

        {/* <section className="relative overflow-hidden rounded-2xl border border-[rgb(var(--border))] bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] p-5 shadow-sm text-white">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-medium text-white/80">Balans</p>
              <p className="mt-1 truncate text-3xl font-extrabold tracking-tight">
                {loading ? "-" : formatBalance(user.balance)}
              </p>
            </div>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15">
              <FiCreditCard className="text-2xl" />
            </div>
          </div>

          <Link
            to="/balance"
            className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white/15 px-4 text-sm font-bold text-white shadow-sm backdrop-blur transition hover:bg-white/25 active:scale-[0.98]"
          >
            <FiPlusCircle className="text-lg" />
            Balansni to'ldirish
          </Link>
        </section>

        <section className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-3 shadow-sm">
            <FiUser className="mb-2 text-lg text-[rgb(var(--primary))]" />
            <p className="text-xs text-[rgb(var(--text-muted))]">Testlar</p>
            <p className="text-xl font-bold">
              {loading ? "-" : sortedResults.length}
            </p>
          </div>
          <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-3 shadow-sm">
            <FiAward className="mb-2 text-lg text-green-600 dark:text-green-400" />
            <p className="text-xs text-[rgb(var(--text-muted))]">Eng yaxshi</p>
            <p className="text-xl font-bold">{loading ? "-" : bestScore}</p>
          </div>
          <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-3 shadow-sm">
            <FiTrendingUp className="mb-2 text-lg text-[rgb(var(--primary))]" />
            <p className="text-xs text-[rgb(var(--text-muted))]">O'sish</p>
            <p className="text-xl font-bold">
              {loading
                ? "-"
                : `${growth >= 0 ? "+" : ""}${Math.floor(growth ? growth * 100 : 0) / 100}`}
            </p>
          </div>
        </section> */}


      </div>

      
    </main>
  );
};
