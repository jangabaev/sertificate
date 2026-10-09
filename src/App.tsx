import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { Dashborad } from "./pages/home/home";
import { ExamSend } from "./pages/exam";
import Dashboard from "./pages/home";
import { Profil } from "./pages/profil";
import BalancePage from "./pages/balance";
import { Results } from "./pages/results";
import { ResultId } from "./pages/results/resultId";
import Anwers from "./pages/answers";
import Settings from "./pages/settings";
import Navbar from "./components/layouts/navbar";
import DeleteExams from "./pages/delete";
function App() {
  useEffect(() => {
    const tg = window?.Telegram.WebApp;
    if (tg.initDataUnsafe?.user) {
      tg.ready();
      tg.expand();
      tg.disableVerticalSwipes(true);
      tg.setHeaderColor("secondary_bg_color");
    }

    const telegramUser = tg?.initDataUnsafe?.user;

    const telegramUserId = telegramUser?.id?.toString();

    const getUserData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/users/${telegramUserId}`,
          {
            method: "GET",
            headers: {
              token: telegramUserId,
              "Content-Type": "application/json",
            },
          },
        );
        if (response.status === 404) {
          if (telegramUserId) {
            const response = await fetch(
              `${import.meta.env.VITE_API_BASE_URL}/users`,
              {
                method: "POST",

                headers: {
                  "Content-Type": "application/json",
                },

                body: JSON.stringify({
                  user_id: telegramUserId,
                  username: telegramUser.username || "",
                  first_name: telegramUser.first_name || "",
                  last_name: telegramUser.last_name || "",
                }),
              },
            );
            console.log(response);
          }
        }
        console.log(response);
      } catch (error) {
        console.log(error);
      } finally {
        console.log("keldi");
      }
    };

    getUserData();
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
          <Route path="/balance" element={<BalancePage />} />
          {/* 404 sahifa */}
          <Route path="*" element={<>Not found</>} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/createtest/:userId" element={<Anwers />} />
          <Route path="/createtest/:userId/:id" element={<Anwers />} />
          <Route path="/deleteExam" element={<DeleteExams />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
