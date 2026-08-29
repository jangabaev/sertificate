import { useEffect, useState } from "react";
import { GiEarthAsiaOceania } from "react-icons/gi";
import { Select } from "../../components/select";
import { useTranslation } from "react-i18next";
import { MdOutlineColorLens, MdDarkMode, MdWbSunny } from "react-icons/md";

const Settings = () => {
  const { i18n } = useTranslation();
  const { t } = useTranslation("profile");
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "uz",
  );

  const [data, userData] = useState({
    id: 0,
    first_name: "",
    last_name: "",
    username: "",
    language_code: "uz",
    photo_url: "",
  });

  const [darkligth, setDarkligth] = useState("");

  const [pendingLanguage, setPendingLanguage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLanguageChange = async (value: string) => {
    if (value === language) return;

    await i18n.changeLanguage(value);
    setPendingLanguage(value);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!pendingLanguage) return;

    setLanguage(pendingLanguage);

    localStorage.setItem("language", pendingLanguage);

    setPendingLanguage(null);
    setIsModalOpen(false);
  };

  const handleCancel = async () => {
    setPendingLanguage(null);
    setIsModalOpen(false);
    await i18n.changeLanguage(language);
  };

  const handleDarkLigthChange = (value: string) => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(value);
    setDarkligth(value);
  };

  useEffect(() => {
    const tg = window.Telegram?.WebApp;

    if (!tg) return;

    // userData(tg.initDataUnsafe?.user);

    setDarkligth(tg.colorScheme);
  }, []);

  return (
    <>
      <section className="h-[100vh] bg-[rgb(var(--background))] ">
        <div className="pt-[50px] flex items-center justify-center text-white">
          <div className="flex justify-around text-4xl items-center bg-[rgb(var(--primary))] w-[120px] h-[120px] rounded-[50%]">
            {data?.photo_url ? (
              <img
                src={data.photo_url || "https://via.placeholder.com/100"}
                alt="Profil rasmi"
                className="h-[120px] w-[120px] rounded-2xl border border-[rgb(var(--border))] object-cover"
              />
            ) : (
              <h3 className="uppercase">
                {data?.first_name.slice(0, 1) +
                  (data?.last_name.slice(0, 1) ?? data?.first_name.slice(1, 2))}
              </h3>
            )}
          </div>
        </div>
        <p className="text-[rgb(var(--text))] pt-10 text-center text-2xl font-bold">
          {data?.first_name} {data?.last_name}
        </p>

        <div className="m-[20px] bg-[rgb(var(--surface))] rounded-3xl p-4 shadow-xs">
          <p className="text-[rgb(var(--text))]">{t("settings")}</p>
          <div className="flex justify-between items-center mt-3 w-[100%]">
            <div className="flex justify-between items-center gap-4">
              <GiEarthAsiaOceania className="text-4xl text-[rgb(var(--primary))]" />
              <p className="text-[rgb(var(--text))]">{t("lang")}</p>
            </div>
            <Select
              value={language}
              onChange={handleLanguageChange}
              options={[
                {
                  label: "O'zbekcha",
                  value: "uz",
                },
                {
                  label: "English",
                  value: "en",
                },
                {
                  label: "Qaraqalpaq",
                  value: "qq",
                },
                {
                  label: "қарақалақ",
                  value: "qqKir",
                },
                {
                  label: "узбек",
                  value: "uzKir",
                },
                {
                  label: "Русский",
                  value: "ru",
                },
              ]}
            />
          </div>
          <div className="flex justify-between items-center mt-3 w-[100%]">
            <div className="flex justify-between items-center gap-4">
              <MdOutlineColorLens className="text-4xl text-[rgb(var(--primary))]" />
              <p className="text-[rgb(var(--text))]">{t("darkmode")}</p>
            </div>
            <Select
              value={darkligth}
              onChange={handleDarkLigthChange}
              options={[
                {
                  label: `${t("dark")}`,
                  value: "dark",
                  icon: <MdDarkMode />,
                },
                {
                  label: `${t("sun")}`,
                  value: "light",
                  icon: <MdWbSunny />,
                },
              ]}
            />
          </div>
        </div>
      </section>
      {isModalOpen && (
        <div
          onClick={handleCancel}
          className="
            fixed inset-0 z-[100]
            flex items-center justify-center
            bg-black/40
            px-5
            backdrop-blur-[2px]
          "
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="
              w-full max-w-[360px]
              rounded-3xl
              bg-[rgb(var(--surface))]
              p-5
              shadow-2xl
            "
          >
            <div
              className="
                mb-4
                flex h-12 w-12
                items-center justify-center
                rounded-full
                bg-[rgb(var(--primary)/0.10)]
              "
            >
              <GiEarthAsiaOceania className="text-2xl text-[rgb(var(--primary))]" />
            </div>

            <h3
              className="
                text-lg font-semibold
                text-[rgb(var(--text))]
              "
            >
              {t("changelang")}
            </h3>

            <p
              className="
                mt-2 text-sm leading-6
                text-[rgb(var(--text-muted))]
              "
            >
              {t("saveChange")}
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="
                  h-11 flex-1
                  rounded-xl
                  bg-[rgb(var(--background))]
                  text-sm font-medium
                  text-[rgb(var(--text))]
                  transition
                  hover:opacity-80
                "
              >
                {t("cancel")}
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="
                  h-11 flex-1
                  rounded-xl
                  bg-[rgb(var(--primary))]
                  text-sm font-semibold
                  text-white
                  transition
                  hover:opacity-90
                  active:scale-[0.98]
                "
              >
                {t("save")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Settings;
