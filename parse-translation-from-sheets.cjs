const fs = require("fs");
const path = require("path");

const API_URL =
  "https://api.sheetbest.com/sheets/66cd2188-d0d9-44d9-baaa-b22b772d3ef9";

const LANGUAGES = ["en", "qq", "qqKir", "ru", "uz", "uzKir"];

const LOCALES_PATH = "./src/i18n/locales";

function setNestedValue(obj, keys, value) {
  let current = obj;

  keys.forEach((key, index) => {
    const isLast = index === keys.length - 1;

    if (isLast) {
      current[key] = value;
      return;
    }

    if (!current[key]) {
      current[key] = {};
    }

    current = current[key];
  });
}

function createFolders() {
  LANGUAGES.forEach((lang) => {
    const folderPath = path.join(LOCALES_PATH, lang);

    fs.mkdirSync(folderPath, {
      recursive: true,
    });
  });
}

async function generateTranslations() {
  try {
    console.log("Translations yuklanmoqda...");

    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(
        `API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    const result = {};

    LANGUAGES.forEach((lang) => {
      result[lang] = {};
    });

    const namespaces = new Set();

    data.forEach((item) => {
      if (!item.key) return;

      const parts = item.key.split(".");

      if (parts.length < 2) {
        console.warn(`Noto'g'ri key o'tkazib yuborildi: ${item.key}`);
        return;
      }

      const namespace = parts[0];
      const translationKeys = parts.slice(1);

      namespaces.add(namespace);

      LANGUAGES.forEach((lang) => {
        if (!result[lang][namespace]) {
          result[lang][namespace] = {};
        }

        setNestedValue(
          result[lang][namespace],
          translationKeys,
          item[lang] || ""
        );
      });
    });

    createFolders();

    let fileCount = 0;

    for (const lang of LANGUAGES) {
      for (const namespace of namespaces) {
        const filePath = path.join(
          LOCALES_PATH,
          lang,
          `${namespace}.json`
        );

        const json = JSON.stringify(
          result[lang][namespace],
          null,
          2
        );

        fs.writeFileSync(filePath, json, "utf8");

        console.log(`✓ ${filePath}`);

        fileCount++;
      }
    }

    console.log("");
    console.log("Translations muvaffaqiyatli yaratildi.");
    console.log(`Namespaces: ${namespaces.size}`);
    console.log(`Languages: ${LANGUAGES.length}`);
    console.log(`JSON files: ${fileCount}`);
  } catch (error) {
    console.error("Translation generate error:");
    console.error(error);
    process.exit(1);
  }
}

generateTranslations();