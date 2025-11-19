import { useEffect, useState } from "react";
import CryptoJS from "crypto-js";

export const Profil = () => {
  const [user, setUser] = useState({
    allows_write_to_pm: true,
    first_name: "Jangabaev",
    id: 1849659907,
    language_code: "en",
    last_name: "M",
    photo_url:
      "https://t.me/i/userpic/320/mpEXrW80MoSdfI6FZ34PKSFxVgmF2s3WWwuIBEBl6w0.svg",
    username: "muxtar_dev",
    tests: [],
  });
  console.log(user);

  const results = [
    { id: 1, name: "Mock 26", score: 65, level: "B+" },
    { id: 2, name: "Mock 27", score: 72, level: "A" },
    { id: 3, name: "Mock 28", score: 90, level: "A+" },
  ];

  useEffect(() => {
    //@ts-ignore
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();
    console.log("Foydalanuvchi:", tg.initDataUnsafe?.user);
    setUser(tg.initDataUnsafe?.user);
    let token = CryptoJS.AES.encrypt(
      "1849659907",
      import.meta.env.VITE_SECRET
    ).toString();
    const getUserData = async () => {
      try {
        const response = await fetch(
          `https://sertificate-backend12.onrender.com/api/users/${1849659907}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              token,
            },
          }
        );
        const result = await response.json();
        // setUser(result);
        setUser({
          ...user,
          first_name: result.first_name,
          last_name: result.last_name,
          username: result.username,
          photo_url: result.photo_url,
          tests: result.tests || [],
        });
      } catch (error) {
        console.error("Maʼlumotni olishda xatolik:", error);
      }
    };
    getUserData();
  }, []);

  return (
    <div className="min-h-screen bg-[rgb(var(--background))] flex flex-col items-center p-4 text-[rgb(var(--text))] transition-colors duration-300">
      {/* Profil karta */}
      <div className="bg-[rgb(var(--surface))] rounded-2xl shadow-md p-6 w-full max-w-md text-center mb-6 border border-[rgb(var(--border))]">
        <img
          src={user?.photo_url || "https://via.placeholder.com/100"}
          alt="user"
          className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-[rgb(var(--primary))]"
        />
        <h1 className="text-xl font-bold text-[rgb(var(--text))]">
          {user?.first_name} {user?.last_name || ""}
        </h1>
        <p className="text-[rgb(var(--text-muted))]">
          @{user?.username || "username yo‘q"}
        </p>
        <p className="mt-2 text-sm text-[rgb(var(--text-muted))]">
          ID: {user?.id}
        </p>
      </div>

      {/* Test natijalari */}
      <div className="bg-[rgb(var(--surface))] rounded-2xl shadow-md p-4 w-full max-w-md flex-1 border border-[rgb(var(--border))]">
        <h2 className="text-lg font-bold text-[rgb(var(--text))] mb-3">
          📊 Qatnashgan testlar
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border border-[rgb(var(--border))] rounded-lg">
            <thead className="bg-[rgb(var(--gradient-from))]/10 text-[rgb(var(--text))]">
              <tr>
                <th className="px-3 py-2 border-b border-[rgb(var(--border))]">
                  #
                </th>
                <th className="px-3 py-2 border-b border-[rgb(var(--border))]">
                  Test nomi
                </th>
                <th className="px-3 py-2 border-b border-[rgb(var(--border))] text-center">
                  Ball
                </th>
                <th className="px-3 py-2 border-b border-[rgb(var(--border))] text-center">
                  Daraja
                </th>
              </tr>
            </thead>
            <tbody>
              {(user?.tests ?? results).map((test, index) => (
                <tr
                  key={test?.id}
                  className="hover:bg-[rgb(var(--gradient-from))]/5 transition-colors"
                >
                  <td className="px-3 py-2 border-b border-[rgb(var(--border))]">
                    {index + 1}
                  </td>
                  <td className="px-3 py-2 border-b border-[rgb(var(--border))]">
                    {test?.name}
                  </td>
                  <td
                    className={`px-3 py-2 border-b text-center font-bold ${
                      test.score >= 80
                        ? "text-[rgb(var(--success))]"
                        : test.score >= 60
                        ? "text-[rgb(var(--secondary))]"
                        : "text-[rgb(var(--error))]"
                    }`}
                  >
                    {Math.floor(test?.score || "")}
                  </td>
                  <td className="px-3 py-2 border-b border-[rgb(var(--border))] text-center">
                    {test?.degree}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tugma */}
      <button className="mt-6 w-full max-w-md bg-[rgb(var(--primary))] hover:bg-[rgb(var(--secondary))] text-white py-3 rounded-xl font-semibold shadow-md transition-colors">
        WebApp ni yopish
      </button>
    </div>
  );
};
