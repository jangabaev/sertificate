import { useEffect, useMemo, useState } from "react";
import {
  FaTrash,
  FaSearch,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaExclamationTriangle,
} from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";
import CryptoJS from "crypto-js";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

type Exam = {
  id: number;
  name: string;
  createdAt: string;
  status: string;
};

const DeleteExams = () => {
  const [data, setData] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [telegramId, setTelegramId] = useState("");
  const [secretKey, setSecretKey] = useState("");

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${BASE_URL}/test`);

        if (!response.ok) {
          throw new Error("Testlar topilmadi");
        }

        const res = await response.json();

        if (res) {
          setData(res);
        }
      } catch (error) {
        console.error("Test ma'lumotlarini olishda xatolik:", error);
        alert("Test ma'lumotlarini yuklab bo'lmadi");
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((exam) =>
      exam.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [data, search]);

  const selectedExam = data.find((exam) => exam.id === deleteId);

  const getStatusStyle = (status: string) => {
    switch (status.toUpperCase()) {
      case "ACTIVE":
        return {
          icon: <FaCheckCircle />,
          className:
            "bg-green-500/10 text-[rgb(var(--success))] border-green-500/20",
          text: "Active",
        };

      case "PENDING":
        return {
          icon: <FaClock />,
          className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
          text: "Pending",
        };

      case "INACTIVE":
        return {
          icon: <FaTimesCircle />,
          className: "bg-red-500/10 text-[rgb(var(--error))] border-red-500/20",
          text: "Inactive",
        };

      default:
        return {
          icon: <FaClock />,
          className:
            "bg-[rgb(var(--background))] text-[rgb(var(--text-muted))] border-[rgb(var(--border))]",
          text: status,
        };
    }
  };

  const formatDate = (date: string) => {
    if (!date) return "-";

    return new Intl.DateTimeFormat("uz-UZ", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    if (!telegramId.trim()) {
      alert("Telegram ID kiriting");
      return;
    }

    if (!secretKey.trim()) {
      alert("Secret key kiriting");
      return;
    }

    try {
      setDeleteLoading(true);
      const encryptedToken = CryptoJS.AES.encrypt(
        String(telegramId),
        secretKey,
      ).toString();

      console.log(encryptedToken);

      const response = await fetch(`${BASE_URL}/test/${deleteId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          token: encryptedToken,
        },
      });

      const res = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(res?.message || "Testni o'chirib bo'lmadi");
      }

      setData((prev) => prev.filter((exam) => exam.id !== deleteId));

      setDeleteId(null);
      setSecretKey("");

      alert(res?.message || "Test muvaffaqiyatli o'chirildi");
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Testni o'chirishda xatolik yuz berdi");
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--background))] text-[rgb(var(--text))] px-3 sm:px-5 py-7">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-7">
          <h1 className="text-2xl sm:text-3xl font-bold">Exam Admin Page</h1>

          <p className="mt-2 text-sm sm:text-base text-[rgb(var(--text-muted))]">
            Testlarni ko‘rish va kerak bo‘lmagan testlarni o‘chirish.
          </p>
        </div>

        {/* Admin credentials */}
        <div className="bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-3xl p-4 sm:p-6 mb-5">
          <h2 className="font-semibold text-lg mb-4">Admin tasdiqlash</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={telegramId}
              onChange={(e) => setTelegramId(e.target.value)}
              placeholder="Telegram ID"
              className="h-12 px-4 rounded-2xl bg-[rgb(var(--background))] border border-[rgb(var(--border))] outline-none focus:border-[rgb(var(--primary))] focus:ring-4 focus:ring-[rgb(var(--primary))]/10"
            />

            <input
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="Secret key"
              className="h-12 px-4 rounded-2xl bg-[rgb(var(--background))] border border-[rgb(var(--border))] outline-none focus:border-[rgb(var(--primary))] focus:ring-4 focus:ring-[rgb(var(--primary))]/10"
            />
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[rgb(var(--text-muted))]" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Test nomi bo‘yicha qidirish..."
            className="w-full h-13 pl-11 pr-4 rounded-2xl bg-[rgb(var(--surface))] border border-[rgb(var(--border))] outline-none focus:border-[rgb(var(--primary))] focus:ring-4 focus:ring-[rgb(var(--primary))]/10"
          />
        </div>

        {/* Statistics */}
        <div className="flex items-center justify-between mb-3 px-1">
          <p className="text-sm text-[rgb(var(--text-muted))]">
            Jami testlar:
            <span className="ml-2 font-semibold text-[rgb(var(--text))]">
              {filteredData.length}
            </span>
          </p>
        </div>

        {/* Exams */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-[rgb(var(--text-muted))]">
            <ImSpinner2 className="animate-spin text-3xl mb-3 text-[rgb(var(--primary))]" />

            <p>Testlar yuklanmoqda...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-3xl py-16 text-center">
            <p className="text-lg font-semibold">Test topilmadi</p>

            <p className="text-sm text-[rgb(var(--text-muted))] mt-2">
              Qidiruv bo‘yicha hech qanday natija yo‘q.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredData.map((exam) => {
              const status = getStatusStyle(exam.status);

              return (
                <div
                  key={exam.id}
                  className="group bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-3xl p-4 sm:p-5 transition hover:border-[rgb(var(--primary))]/40 hover:shadow-lg hover:shadow-black/5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-xs px-2.5 py-1 rounded-lg bg-[rgb(var(--primary))]/10 text-[rgb(var(--primary))] font-semibold">
                          #{exam.id}
                        </span>

                        <span
                          className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border ${status.className}`}
                        >
                          {status.icon}
                          {status.text}
                        </span>
                      </div>

                      <h3 className="font-semibold text-base sm:text-lg break-words">
                        {exam.name}
                      </h3>

                      <div className="flex items-center gap-2 mt-2 text-sm text-[rgb(var(--text-muted))]">
                        <FaCalendarAlt size={13} />

                        <span>{formatDate(exam.createdAt)}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setDeleteId(exam.id)}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 h-11 px-4 rounded-2xl border border-red-500/20 bg-red-500/10 text-[rgb(var(--error))] font-medium hover:bg-[rgb(var(--error))] hover:text-white transition"
                    >
                      <FaTrash size={14} />
                      O‘chirish
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4">
          <div className="w-full sm:max-w-md bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-t-[30px] sm:rounded-[30px] p-6 shadow-2xl">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-red-500/10 flex items-center justify-center text-[rgb(var(--error))]">
              <FaExclamationTriangle size={24} />
            </div>

            <h2 className="text-xl font-bold text-center mt-5">
              Testni o‘chirasizmi?
            </h2>

            <p className="text-center text-sm leading-6 text-[rgb(var(--text-muted))] mt-2">
              <span className="text-[rgb(var(--text))] font-semibold">
                {selectedExam?.name}
              </span>{" "}
              butunlay o‘chiriladi.
            </p>

            <p className="text-center text-xs text-[rgb(var(--error))] mt-2">
              Bu amalni ortga qaytarib bo‘lmaydi.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
              <button
                type="button"
                disabled={deleteLoading}
                onClick={() => setDeleteId(null)}
                className="h-12 rounded-2xl bg-[rgb(var(--background))] border border-[rgb(var(--border))] font-semibold hover:opacity-80 transition"
              >
                Bekor qilish
              </button>

              <button
                type="button"
                disabled={deleteLoading}
                onClick={handleDelete}
                className="h-12 rounded-2xl bg-[rgb(var(--error))] text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50"
              >
                {deleteLoading ? (
                  <>
                    <ImSpinner2 className="animate-spin" />
                    O‘chirilmoqda
                  </>
                ) : (
                  <>
                    <FaTrash size={14} />
                    Ha, o‘chirish
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteExams;
