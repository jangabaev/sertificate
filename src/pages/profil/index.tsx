import { useEffect, useState } from 'react'

export const Profil = () => {
    const [user,setUser] = useState({
        allows_write_to_pm
            :
            true,
        first_name
            :
            "Jangabaev",
        id
            :
            1849659907,
        language_code
            :
            "en",
        last_name
            :
            "M",
        photo_url
            :
            "https://t.me/i/userpic/320/mpEXrW80MoSdfI6FZ34PKSFxVgmF2s3WWwuIBEBl6w0.svg"
        , username
            :
            "muxtar_dev"
    })


    console.log(user)

    const results = [
    { id: 1, name: "Mock 26", score: 65, level:"B+" },
    { id: 2, name: "Mock 27", score: 72,level:"A" },
    { id: 3, name: "Mock 28", score: 90,level:"A+" },
  ]

    useEffect(() => {
    //@ts-ignore
    const tg = window.Telegram.WebApp;

    tg.ready(); // WebApp tayyorligini bildiradi
    tg.expand(); // Ilova baland qilib ochiladi

    console.log("Foydalanuvchi:", tg.initDataUnsafe?.user);
    setUser(tg.initDataUnsafe?.user)
  }, []);
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      {/* Profil karta */}
      <div className="bg-white text-gray-800 rounded-2xl shadow-md p-6 w-full max-w-md text-center mb-6">
        <img
          src={user?.photo_url || "https://via.placeholder.com/100"}
          alt="user"
          className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-blue-400"
        />
        <h1 className="text-xl font-bold">{user?.first_name} {user?.last_name || ""}</h1>
        <p className="text-gray-600">@{user?.username || "username yo‘q"}</p>
        <p className="mt-2 text-sm text-gray-500">ID: {user?.id}</p>
      </div>

      {/* Test natijalari */}
      <div className="bg-white rounded-2xl shadow-md p-4 w-full max-w-md flex-1">
        <h2 className="text-lg font-bold text-gray-800 mb-3">📊 Qatnashgan testlar</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border border-gray-200 rounded-lg">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-3 py-2 border-b">#</th>
                <th className="px-3 py-2 border-b">Test nomi</th>
                <th className="px-3 py-2 border-b text-center">Ball</th>
                <th className="px-3 py-2 border-b text-center">Darajasi</th>
              </tr>
            </thead>
            <tbody>
              {results.map((test, index) => (
                <tr key={test.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 border-b">{index + 1}</td>
                  <td className="px-3 py-2 border-b">{test.name}</td>
                  <td
                    className={`px-3 py-2 border-b text-center font-bold ${
                      test.score >= 80
                        ? "text-green-600"
                        : test.score >= 60
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {test.score}%
                    
                  </td><td className="px-3 py-2 border-b text-left w-[30px]">{test.level}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pastda tugma */}
      <button
        className="mt-6 w-full max-w-md bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold shadow-md"
      >
        WebApp ni yopish
      </button>
    </div>
    )
}
