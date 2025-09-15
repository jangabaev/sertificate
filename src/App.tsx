import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link  } from "react-router-dom";
import { Dashborad } from './pages/home';
function App() {
  const [active, setActive] = useState("home");
  const items = [
    { id: "/", label: "Home", icon: "" },
    { id: "/about", label: "Testlar", icon: "" },
    { id: "/about", label: "Profil", icon: "" },
  ];
const [user1, setUser] = useState(null);

console.log(user1)
  useEffect(() => {
    //@ts-ignore
    const tg = window.Telegram?.WebApp;
    if (tg) {
      const unsafe = tg.initDataUnsafe;
      if (unsafe && unsafe.user) {
        setUser(unsafe.user); // {id, first_name, last_name, username, language_code}
      }
    }
  }, []);

  //@ts-ignore
    const webapp = window.Telegram?.WebApp;

  // xavfsiz bo'lmagan oson o'qish uchun
  const initUnsafe = webapp?.initDataUnsafe; // {user: {...}, chat: {...} ...}
  console.log('initDataUnsafe:', initUnsafe);
const user = initUnsafe&&initUnsafe?.user?initUnsafe.user:{user:{id:"1",username:"1"}};
  if (initUnsafe && initUnsafe.user) {
    
    console.log('user id:', user.id);
    console.log('username:', user.username);        // agar bo'lsa
    console.log('first_name:', user.first_name);
    console.log('last_name:', user.last_name);     // agar bo'lsa
  }


  return (
    <>
      <Router>
              <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 shadow-md flex justify-around items-center h-16 z-50">
        {items.map((item) => (
          <Link
            key={item.id}
            to={item.id}
            onClick={() => setActive(item.id)}
            className={`flex flex-col items-center text-sm transition-colors ${active === item.id ? "text-blue-500" : "text-gray-500"
              }`}
          >
            {/* {item.icon} */}
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
        <Routes>
          <Route path="/" element={<Dashborad />} />
          <Route path="/about" element={<>{ user?.id?user?.id:""} <div>{user?.first_name?user?.first_name:""}</div></>} />
          {/* 404 sahifa */}
          <Route path="*" element={<>Not found</>} />
          
        </Routes>
      </Router>

    </>
  )
}

export default App
