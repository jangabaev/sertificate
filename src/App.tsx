import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link  } from "react-router-dom";
import { Dashborad } from './pages/home';
function App() {
  const [count, setCount] = useState(0)
  const [active, setActive] = useState("home");
  const items = [
    { id: "/", label: "Home", icon: "" },
    { id: "/about", label: "Testlar", icon: "" },
    { id: "/about", label: "Profil", icon: "" },
  ];

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
          <Route path="/about" element={<>About</>} />
          {/* 404 sahifa */}
          <Route path="*" element={<>Not found</>} />
          
        </Routes>
      </Router>

    </>
  )
}

export default App
