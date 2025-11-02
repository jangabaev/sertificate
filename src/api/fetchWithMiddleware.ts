// src/api/fetchWithMiddleware.ts

export async function fetchWithMiddleware(
  url: string,
  options: RequestInit = {}
) {
  const tg = (window as any).Telegram?.WebApp;
  const telegramId = tg?.initDataUnsafe?.user?.id;

  if (!telegramId) {
    console.error("Telegram ID topilmadi!");
    throw new Error("Telegram ID topilmadi!");
  }

  const modifiedOptions: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-telegram-id": telegramId.toString(),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, modifiedOptions);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
