const HISTORY_STORAGE_KEY = "infohub-analysis-history";

function createHistoryItem(result) {
  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),

    summary: {
      categoria: result.categoria ?? "Não informada",
      probabilidade:
        typeof result.probabilidade === "number"
          ? result.probabilidade
          : null,
    },

    response: result,
  };
}

export function getHistory() {
  const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);

  if (!storedHistory) {
    return [];
  }

  try {
    const parsedHistory = JSON.parse(storedHistory);

    return Array.isArray(parsedHistory)
      ? parsedHistory
      : [];
  } catch {
    return [];
  }
}

export function saveAnalysis(result) {
  if (!result || typeof result !== "object") {
    return;
  }

  const history = getHistory();

  const newHistoryItem = createHistoryItem(result);

  localStorage.setItem(
    HISTORY_STORAGE_KEY,
    JSON.stringify([newHistoryItem, ...history]),
  );
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_STORAGE_KEY);
}