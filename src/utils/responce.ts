export const answersResponce = function (num: number) {
  if (num === 0) {
    return "A";
  }
  if (num === 1) {
    return "B";
  }
  if (num === 2) {
    return "C";
  }
  if (num === 3) {
    return "D";
  }
  if (num === 4) {
    return "E";
  }
  return "F";
};

export function getRandomName() {
  const names = [
    "Ali",
    "Vali",
    "Sardor",
    "Aziz",
    "Javohir",
    "Olim",
    "Bekzod",
    "Sherzod",
    "Jasur",
    "Baxtiyor",
    "Ulug'bek",
    "Diyor",
    "Rustam",
    "Shaxzod",
    "Elyor",
    "Murod",
    "Zafar",
    "Xurshid",
    "Javlon",
    "Siroj",
    "Anvar",
    "Botir",
    "Farruh",
    "Abdulloh",
    "Islom",
    "Kamron",
    "Nodir",
    "Otabek",
    "Ravshan",
    "Bobur",
    "Sirojiddin",
    "Dilshod",
    "Shohruh",
    "Bahrom",
    "Asadbek",
    "Temur",
    "Adham",
    "Zokir",
    "Ilhom",
    "Shahboz",
    "Muzaffar",
    "Ilyos",
    "Toxir",
    "Abbos",
    "Shodiyor",
    "Oybek",
    "Madamin",
    "Qobil",
    "Hamid",
    "Qodir",
  ];

  const randomIndex = Math.floor(Math.random() * names.length);
  return names[randomIndex];
}

console.log(getRandomName());
