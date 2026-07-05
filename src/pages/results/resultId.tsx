import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FiArrowLeft, FiAward, FiSearch, FiUsers } from "react-icons/fi";

type StudentResult = {
  id?: number | string;
  user_id?: number | string;
  name: string;
  total_ball: number;
  degree?: string | number;
};

type TelegramWebApp = {
  ready?: () => void;
  expand?: () => void;
  initDataUnsafe?: {
    user?: {
      id?: number | string;
    };
  };
};

const degreeTypes = ["A+", "A", "B+", "B", "C+", "C"];

const formatScore = (score: number) => {
  return Math.floor(score * 100) / 100;
};

export const ResultId = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<StudentResult[]>([]);
  const [testTitle, setTestTitle] = useState<string>("");
  const [search, setSearch] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const filteredData = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) return data;

    return data.filter((item) =>
      item.name.toLowerCase().includes(normalizedSearch)
    );
  }, [data, search]);

  const degreeStats = useMemo(() => {
    return degreeTypes.map((degree) => ({
      degree,
      count: data.filter(
        (item) => String(item.degree ?? "").trim().toUpperCase() === degree
      ).length,
    }));
  }, [data]);

  useEffect(() => {
    const tg = window?.Telegram?.WebApp as TelegramWebApp | undefined;
    const telegramUserId = tg?.initDataUnsafe?.user?.id;

    tg?.ready?.();
    tg?.expand?.();

    if (telegramUserId) {
      setCurrentUserId(String(telegramUserId));
    }

    const fetchResult = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/test/${id}`);
        const result = await response.json();
        setTestTitle(result?.name || "");
        setData(result?.rash?.new_students || []);
      } catch (error) {
        console.error("Ma'lumotni olishda xatolik:", error);
        setData(mockResult);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id]);

  return (
    <main className="min-h-screen bg-[rgb(var(--background))] px-4 pb-24 pt-4 text-[rgb(var(--text))]">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-5">
        <header className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Link
              to="/results"
              className="mb-4 inline-flex h-10 items-center gap-2 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3 text-sm font-semibold text-[rgb(var(--text-muted))] shadow-sm transition hover:border-[rgb(var(--primary))]/40 hover:text-[rgb(var(--primary))]"
            >
              <FiArrowLeft className="text-lg" />
              <span>Orqaga</span>
            </Link>

            <p className="text-sm font-medium text-[rgb(var(--text-muted))]">
              Test natijalari
            </p>
            <h1 className="mt-1 truncate text-3xl font-bold tracking-normal">
              {testTitle || "Natijalar"}
            </h1>
          </div>

          <div className="shrink-0 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3 py-2 text-right shadow-sm">
            <p className="text-xs font-medium text-[rgb(var(--text-muted))]">
              Jami
            </p>
            <p className="text-2xl font-bold">{loading ? "-" : data.length}</p>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-3">
          <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-4 shadow-sm">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-[rgb(var(--primary))]/10 text-[rgb(var(--primary))]">
              <FiUsers className="text-lg" />
            </div>
            <p className="text-xs font-medium text-[rgb(var(--text-muted))]">
              Ishtirokchilar
            </p>
            <p className="mt-1 text-2xl font-bold">{loading ? "-" : data.length}</p>
          </div>

          <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-4 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-500/10 text-green-600 dark:text-green-400">
                <FiAward className="text-lg" />
              </div>
              <div>
                <p className="text-xs font-medium text-[rgb(var(--text-muted))]">
                  Darajalar statistikasi
                </p>
                <p className="text-sm font-semibold text-[rgb(var(--text))]">
                  Sertifikat taqsimoti
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {degreeStats.map((item) => (
                <div
                  key={item.degree}
                  className="rounded-xl bg-[rgb(var(--background))] px-3 py-2 text-center"
                >
                  <p className="text-xs font-bold text-[rgb(var(--text-muted))]">
                    {item.degree}
                  </p>
                  <p className="mt-1 text-xl font-bold text-[rgb(var(--text))]">
                    {loading ? "-" : item.count}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <label className="relative block">
          <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-[rgb(var(--text-muted))]" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Ism bo'yicha qidirish"
            className="h-12 w-full rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] pl-11 pr-4 text-sm font-medium text-[rgb(var(--text))] shadow-sm outline-none transition placeholder:text-[rgb(var(--text-muted))] focus:border-[rgb(var(--primary))]/50 focus:ring-4 focus:ring-[rgb(var(--primary))]/10"
          />
        </label>

        <section className="overflow-hidden rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] shadow-sm">
          <div className="grid grid-cols-[38px_minmax(0,1fr)_70px_76px] gap-2 border-b border-[rgb(var(--border))] bg-[rgb(var(--background))] px-4 py-3 text-xs font-bold uppercase text-[rgb(var(--text-muted))]">
            <span>#</span>
            <span>F.I.O</span>
            <span className="text-right">Daraja</span>
            <span className="text-right">Ball</span>
          </div>

          {loading && (
            <div className="flex flex-col divide-y divide-[rgb(var(--border))]">
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="grid grid-cols-[38px_minmax(0,1fr)_70px_76px] items-center gap-2 px-4 py-4"
                >
                  <div className="h-4 w-5 animate-pulse rounded-full bg-[rgb(var(--background))]" />
                  <div className="h-4 w-4/5 animate-pulse rounded-full bg-[rgb(var(--background))]" />
                  <div className="ml-auto h-4 w-10 animate-pulse rounded-full bg-[rgb(var(--background))]" />
                  <div className="ml-auto h-4 w-12 animate-pulse rounded-full bg-[rgb(var(--background))]" />
                </div>
              ))}
            </div>
          )}

          {!loading && filteredData.length === 0 && (
            <div className="px-5 py-12 text-center">
              <p className="font-semibold">Ma'lumot topilmadi</p>
              <p className="mt-1 text-sm text-[rgb(var(--text-muted))]">
                Qidiruv so'zini o'zgartirib ko'ring.
              </p>
            </div>
          )}

          {!loading && filteredData.length > 0 && (
            <div className="flex flex-col divide-y divide-[rgb(var(--border))]">
              {filteredData.map((item, index) => {
                const studentUserId = item.user_id ?? item.id;
                const isCurrentUser =
                  currentUserId !== null && String(studentUserId) === currentUserId;

                return (
                  <div
                    key={`${studentUserId ?? item.name}-${index}`}
                    className={`grid grid-cols-[38px_minmax(0,1fr)_70px_76px] items-center gap-2 px-4 py-3 transition ${
                      isCurrentUser
                        ? "bg-green-500/10 ring-1 ring-inset ring-green-500/30"
                        : "hover:bg-[rgb(var(--background))]"
                    }`}
                  >
                    <span
                      className={`text-sm font-semibold ${
                        isCurrentUser
                          ? "text-green-700 dark:text-green-300"
                          : "text-[rgb(var(--text-muted))]"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <div className="min-w-0 pr-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <p
                          className={`truncate text-sm font-bold ${
                            isCurrentUser
                              ? "text-green-800 dark:text-green-200"
                              : "text-[rgb(var(--text))]"
                          }`}
                          title={item.name}
                        >
                          {item.name}
                        </p>
                        {isCurrentUser && (
                          <span className="shrink-0 rounded-full bg-green-600 px-2 py-0.5 text-[10px] font-bold text-white">
                            Siz
                          </span>
                        )}
                      </div>
                    </div>
                    <span
                      className={`truncate text-right text-sm font-bold ${
                        isCurrentUser
                          ? "text-green-700 dark:text-green-300"
                          : "text-[rgb(var(--text-muted))]"
                      }`}
                    >
                      {item.degree ?? "-"}
                    </span>
                    <span
                      className={`text-right text-sm font-bold ${
                        isCurrentUser
                          ? "text-green-700 dark:text-green-300"
                          : "text-[rgb(var(--primary))]"
                      }`}
                    >
                      {formatScore(item.total_ball)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};
