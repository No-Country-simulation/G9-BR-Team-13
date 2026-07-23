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
  try {
    const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);

    if (!storedHistory) {
      return [];
    }

    const parsedHistory = JSON.parse(storedHistory);

    return Array.isArray(parsedHistory) ? parsedHistory : [];
  } catch {
    return [];
  }
}

export function saveAnalysis(result) {
  const history = getHistory();
  const historyItem = createHistoryItem(result);
  const updatedHistory = [historyItem, ...history];

  localStorage.setItem(
    HISTORY_STORAGE_KEY,
    JSON.stringify(updatedHistory),
  );

  return historyItem;
}

export function deleteAnalysis(id) {
  const history = getHistory();

  const updatedHistory = history.filter(
    (historyItem) => historyItem.id !== id,
  );

  localStorage.setItem(
    HISTORY_STORAGE_KEY,
    JSON.stringify(updatedHistory),
  );

  return updatedHistory;
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_STORAGE_KEY);
}