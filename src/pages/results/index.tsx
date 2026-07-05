import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { FiArrowRight, FiBarChart2, FiClock, FiFileText } from "react-icons/fi";
import { MdPeopleAlt } from "react-icons/md";
import { SkeletonCard } from "./loading";

type ResultTest = {
  id: string;
  name: string;
  participantsCount?: number;
  endsAt?: string | null;
  isActive?: boolean;
  status?: string;
};

const formatTime = (date?: string | null) => {
  if (!date) return "-";

  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const Results = () => {
  const [data, setData] = useState<ResultTest[]>([]);
  const [loading, setLoading] = useState(true);

  const activeCount = useMemo(
    () => data.filter((test) => test.isActive !== false).length,
    [data]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/test?sort_by=noactive`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        setData([]);
        console.error("Xatolik yuz berdi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="min-h-screen bg-[rgb(var(--background))] px-4 pb-24 pt-4 text-[rgb(var(--text))]">
      <div className="mx-auto flex w-full max-w-xl flex-col gap-5">
        <header className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[rgb(var(--primary))]/10 text-[rgb(var(--primary))] ring-1 ring-[rgb(var(--primary))]/15">
              <FiBarChart2 className="text-xl" />
            </div>
            <p className="text-sm font-medium text-[rgb(var(--text-muted))]">
              Results
            </p>
            <h1 className="text-3xl font-bold tracking-normal">
              Test natijalari
            </h1>
          </div>

          
        </header>

        <section className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-4 shadow-sm">
            <p className="text-xs font-medium text-[rgb(var(--text-muted))]">
              Mavjud testlar
            </p>
            <p className="mt-1 text-2xl font-bold">{loading ? "-" : data.length}</p>
          </div>
          <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-4 shadow-sm">
            <p className="text-xs font-medium text-[rgb(var(--text-muted))]">
              Faol testlar
            </p>
            <p className="mt-1 text-2xl font-bold">
              {loading ? "-" : activeCount}
            </p>
          </div>
        </section>

        {loading && (
          <section className="flex flex-col">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </section>
        )}

        {!loading && data.length === 0 && (
          <section className="rounded-2xl border border-dashed border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-5 py-12 text-center shadow-sm">
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgb(var(--primary))]/10 text-[rgb(var(--primary))]">
              <FiFileText className="text-xl" />
            </div>
            <p className="text-base font-semibold">Hozircha natijalar yo'q</p>
            <p className="mt-1 text-sm text-[rgb(var(--text-muted))]">
              Test natijalari tayyor bo'lganda shu yerda ko'rinadi.
            </p>
          </section>
        )}

        {!loading && data.length > 0 && (
          <section className="flex flex-col gap-3">
            {data.map((test) => {
              const isActive = test.isActive !== false;

              return (
                <Link
                  key={test.id}
                  to={`/results/${test.id}`}
                  className="group rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[rgb(var(--primary))]/30 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="line-clamp-2 text-lg font-bold leading-snug text-[rgb(var(--text))]">
                        {test.name}
                      </h2>
                      <p className="mt-2 text-sm text-[rgb(var(--text-muted))]">
                        Natijalar va ishtirokchilar reytingi
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        isActive
                          ? "bg-green-500/10 text-green-600 dark:text-green-400"
                          : "bg-red-500/10 text-red-600 dark:text-red-400"
                      }`}
                    >
                      {isActive ? "Faol" : "Yopiq"}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2 rounded-xl bg-[rgb(var(--background))] px-3 py-2 text-[rgb(var(--text-muted))]">
                      <MdPeopleAlt className="text-base text-[rgb(var(--primary))]" />
                      <span>{test?.students?.length ?? 0} kishi</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl bg-[rgb(var(--background))] px-3 py-2 text-[rgb(var(--text-muted))]">
                      <FiClock className="text-base text-[rgb(var(--primary))]" />
                      <span>{formatTime(test.endsAt)}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex h-11 items-center justify-between rounded-xl bg-[rgb(var(--primary))] px-4 text-sm font-bold text-white shadow-sm shadow-[rgb(var(--primary))]/20 transition group-hover:bg-[rgb(var(--secondary))]">
                    <span>Natijani ko'rish</span>
                    <FiArrowRight className="text-lg transition group-hover:translate-x-0.5" />
                  </div>
                </Link>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
};
