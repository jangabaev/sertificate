import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { Dashborad } from "./pages/home/home";
import { ExamSend } from "./pages/exam";
import Dashboard from "./pages/home";
import { Profil } from "./pages/profil";
import { Results } from "./pages/results";
import { ResultId } from "./pages/results/resultId";
import Navbar from "./components/layouts/navbar";
function App() {
  useEffect(() => {
    const tg = window?.Telegram.WebApp;
    if (tg.initDataUnsafe?.user) {
      tg.ready();
      tg.expand();
      tg.disableVerticalSwipes(true);
      tg.setHeaderColor("secondary_bg_color");
    }
  }, []);
  return (
    <>
      <Router>
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
