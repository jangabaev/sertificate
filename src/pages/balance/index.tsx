import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiCreditCard } from "react-icons/fi";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const PRESET_AMOUNTS = [10000, 25000, 50000, 100000, 200000];

type PaymentMethod = "click" | "payme";

const formatSom = (value: number) =>
  `${Math.max(0, Math.floor(value)).toLocaleString("ru-RU")} so'm`;

const paymentMethods: {
  id: PaymentMethod;
  title: string;
  description: string;
  gradient: string;
}[] = [
  {
    id: "click",
    title: "Click",
    description: "Click ilovasi yoki kartasi orqali to'lash",
    gradient: "from-sky-500 to-blue-600",
  },
  {
    id: "payme",
    title: "Payme",
    description: "Payme ilovasi yoki kartasi orqali to'lash",
    gradient: "from-teal-400 to-cyan-600",
  },
];

const BalancePage = () => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState<number>(PRESET_AMOUNTS[0]);
  const [customAmount, setCustomAmount] = useState("");
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    tg?.ready();
    tg?.expand();

    const telegramUser = tg?.initDataUnsafe?.user;

    const getBalance = async () => {
      try {
        const response = await fetch(`${BASE_URL}/users`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const result = await response.json();
        setBalance(Number(result?.balance ?? 0));
      } catch (err) {
        console.error("Balansni olishda xatolik:", err);
      } finally {
        setLoading(false);
      }
    };

    getBalance();
  }, []);

  const selectedAmount = customAmount ? Number(customAmount) : amount;

  const handlePickPreset = (value: number) => {
    setAmount(value);
    setCustomAmount("");
  };

  const handleSubmit = async () => {
    setError(null);

    if (!selectedAmount || selectedAmount <= 0) {
      setError("To'ldirish summasini kiriting");
      return;
    }
    if (!method) {
      setError("To'lov usulini tanlang");
      return;
    }

    const tg = window.Telegram?.WebApp;
    const telegramUser = tg?.initDataUnsafe?.user;

    setSubmitting(true);
    try {
      const response = await fetch(`${BASE_URL}/users/balance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "1",
          // telegramUser?.id, waqtinsha
          amount: selectedAmount,
        }),
      });

      if (!response.ok) throw new Error("To'lov so'rovi rad etildi");

      const data = await response.json();
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("To'lov havolasi topilmadi");
      }
    } catch (err) {
      console.error("To'lov xatoligi:", err);
      setError(
        "To'lov tizimi hali ulanmagan. Birozdan so'ng qayta urinib ko'ring.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[rgb(var(--background))] px-4 pb-24 pt-4 text-[rgb(var(--text))]">
      <div className="mx-auto flex w-full max-w-xl flex-col gap-5">
        <header>
          <Link
            to="/profil"
            className="mb-4 inline-flex h-10 items-center gap-2 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3 text-sm font-semibold text-[rgb(var(--text-muted))] shadow-sm transition hover:border-[rgb(var(--primary))]/40 hover:text-[rgb(var(--primary))]"
          >
            <FiArrowLeft className="text-lg" />
            <span>Orqaga</span>
          </Link>

          <p className="text-sm font-medium text-[rgb(var(--text-muted))]">
            Profil
          </p>
          <h1 className="text-3xl font-bold tracking-normal">
            Balansni to'ldirish
          </h1>
        </header>

        <section className="rounded-2xl border border-[rgb(var(--border))] bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] p-5 text-white shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-white/80">Joriy balans</p>
              <p className="mt-1 text-3xl font-extrabold tracking-tight">
                {loading ? "-" : formatSom(balance)}
              </p>
            </div>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15">
              <FiCreditCard className="text-2xl" />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-5 shadow-sm">
          <h2 className="mb-3 text-lg font-bold">Summani tanlang</h2>

          <div className="grid grid-cols-3 gap-2">
            {PRESET_AMOUNTS.map((value) => {
              const isSelected = !customAmount && amount === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => handlePickPreset(value)}
                  className={`rounded-xl border-2 px-2 py-3 text-sm font-bold transition ${
                    isSelected
                      ? "border-[rgb(var(--primary))] bg-[rgb(var(--primary))]/10 text-[rgb(var(--primary))]"
                      : "border-[rgb(var(--border))] bg-[rgb(var(--background))] text-[rgb(var(--text))] hover:border-[rgb(var(--primary))]/40"
                  }`}
                >
                  {value.toLocaleString("ru-RU")}
                </button>
              );
            })}
          </div>

          <div className="mt-3">
            <label className="mb-1.5 block text-sm font-medium text-[rgb(var(--text-muted))]">
              Boshqa summa
            </label>
            <input
              type="number"
              min={0}
              inputMode="numeric"
              value={customAmount}
              onChange={(event) => setCustomAmount(event.target.value)}
              placeholder="Masalan: 75000"
              className="h-12 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--background))] px-4 text-sm font-medium text-[rgb(var(--text))] outline-none transition placeholder:text-[rgb(var(--text-muted))] focus:border-[rgb(var(--primary))]/50 focus:ring-4 focus:ring-[rgb(var(--primary))]/10"
            />
          </div>
        </section>

        <section className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-5 shadow-sm">
          <h2 className="mb-3 text-lg font-bold">To'lov usuli</h2>

          <div className="flex flex-col gap-3">
            {paymentMethods.map((item) => {
              const isSelected = method === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setMethod(item.id)}
                  className={`flex items-center gap-3 rounded-2xl border-2 p-3 text-left transition ${
                    isSelected
                      ? "border-[rgb(var(--primary))] shadow-sm"
                      : "border-[rgb(var(--border))] hover:border-[rgb(var(--primary))]/40"
                  }`}
                >
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient} text-sm font-extrabold text-white`}
                  >
                    {item.title.slice(0, 1)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold">{item.title}</p>
                    <p className="text-xs text-[rgb(var(--text-muted))]">
                      {item.description}
                    </p>
                  </div>
                  <div
                    className={`ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                      isSelected
                        ? "border-[rgb(var(--primary))] bg-[rgb(var(--primary))]"
                        : "border-[rgb(var(--border))]"
                    }`}
                  >
                    {isSelected && (
                      <span className="h-2 w-2 rounded-full bg-white" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {error && (
          <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="h-13 w-full rounded-2xl bg-[rgb(var(--primary))] text-base font-bold text-white shadow-md shadow-[rgb(var(--primary))]/25 transition-all duration-200 hover:bg-[rgb(var(--secondary))] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting
            ? "Yuborilmoqda..."
            : `${selectedAmount > 0 ? formatSom(selectedAmount) : ""} to'lash`}
        </button>
      </div>
    </main>
  );
};

export default BalancePage;
