import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
// import { Dashborad } from "./pages/home/home";
import { ExamSend } from "./pages/exam";
import Dashboard from "./pages/home";
import { Profil } from "./pages/profil";
import { Results } from "./pages/results";
import { ResultId } from "./pages/results/resultId";
import Navbar from "./components/layouts/navbar";
function App() {
  const [user, setUser] = useState("11");
  useEffect(() => {
    const tg = window?.Telegram.WebApp;
    if (tg.initDataUnsafe?.user) {
      tg.ready();
      tg.expand();
      tg.disableVerticalSwipes(true);
      tg.setHeaderColor("secondary_bg_color");
      setUser(tg.initDataUnsafe?.user.id || null);
    }
  }, []);
  return (
    <>
      <Router>
        <div className="relative z-40 bg-amber-300 h-10">
          {Array(30)
            .fill(0)
            .map((_, i) => (
              <div>{user}</div>
            ))}
        </div>
        <Navbar />

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/exam/:id" element={<ExamSend />} />
          <Route path="/results" element={<Results />} />
          <Route path="/results/:id" element={<ResultId />} />
          <Route path="/profil" element={<Profil />} />
          {/* 404 sahifa */}
          <Route path="*" element={<>Not found</>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
