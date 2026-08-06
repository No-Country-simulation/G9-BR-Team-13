const HISTORY_STORAGE_KEY = "techmind-analysis-history";

function normalizeText(value, fallback = "") {
  return typeof value === "string" && value.trim()
    ? value.trim()
    : fallback;
}

function createHistoryItem(result, payload = {}) {
  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),

    input: {
      titulo: normalizeText(
        payload.titulo,
        "Conteúdo sem título",
      ),
      texto: normalizeText(payload.texto),
    },

    summary: {
      categoria: normalizeText(
        result?.categoria,
        "Não informada",
      ),

      probabilidade:
        typeof result?.probabilidade === "number"
          ? result.probabilidade
          : null,
    },

    response: result,
  };
}

function normalizeForComparison(value) {
  return normalizeText(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function getRelevantWords(value) {
  const ignoredWords = new Set([
    "para",
    "com",
    "uma",
    "das",
    "dos",
    "que",
    "por",
    "como",
    "mais",
    "sobre",
    "entre",
    "este",
    "esta",
    "esse",
    "essa",
    "isso",
    "ser",
    "sao",
    "seu",
    "sua",
    "seus",
    "suas",
    "tem",
    "foi",
    "nos",
    "nas",
    "aos",
    "ainda",
  ]);

  return new Set(
    normalizeForComparison(value)
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(
        (word) =>
          word.length >= 4 && !ignoredWords.has(word),
      ),
  );
}

function calculateSimilarity(currentItem, historyItem) {
  const currentCategory = normalizeForComparison(
    currentItem?.summary?.categoria ??
      currentItem?.response?.categoria,
  );

  const historyCategory = normalizeForComparison(
    historyItem?.summary?.categoria ??
      historyItem?.response?.categoria,
  );

  const currentText = [
    currentItem?.input?.titulo,
    currentItem?.input?.texto,
  ]
    .filter(Boolean)
    .join(" ");

  const historyText = [
    historyItem?.input?.titulo,
    historyItem?.input?.texto,
  ]
    .filter(Boolean)
    .join(" ");

  const currentWords = getRelevantWords(currentText);
  const historyWords = getRelevantWords(historyText);

  let score = 0;

  if (
    currentCategory &&
    historyCategory &&
    currentCategory === historyCategory
  ) {
    score += 10;
  }

  currentWords.forEach((word) => {
    if (historyWords.has(word)) {
      score += 1;
    }
  });

  return score;
}

function createRelatedContent(historyItem) {
  const title = normalizeText(
    historyItem?.input?.titulo,
    "Conteúdo analisado anteriormente",
  );

  const fullText = normalizeText(
    historyItem?.input?.texto,
    "Conteúdo classificado e armazenado no histórico da plataforma.",
  );

  const description =
    fullText.length > 160
      ? `${fullText.slice(0, 157).trim()}...`
      : fullText;

  return {
    id: historyItem.id,
    type: "documentation",
    category: normalizeText(
      historyItem?.summary?.categoria ??
        historyItem?.response?.categoria,
      "Não informada",
    ),
    title,
    description,
  };
}

function createExportFileName() {
  const now = new Date();

  const date = now.toISOString().slice(0, 10);

  const time = now
    .toTimeString()
    .slice(0, 8)
    .replaceAll(":", "-");

  return `techmind-historico-${date}-${time}.json`;
}

export function getHistory() {
  try {
    const storedHistory = localStorage.getItem(
      HISTORY_STORAGE_KEY,
    );

    if (!storedHistory) {
      return [];
    }

    const parsedHistory = JSON.parse(storedHistory);

    return Array.isArray(parsedHistory)
      ? parsedHistory
      : [];
  } catch {
    return [];
  }
}

export function saveAnalysis(result, payload = {}) {
  const history = getHistory();
  const historyItem = createHistoryItem(result, payload);

  const updatedHistory = [
    historyItem,
    ...history,
  ];

  localStorage.setItem(
    HISTORY_STORAGE_KEY,
    JSON.stringify(updatedHistory),
  );

  return historyItem;
}

export function getRelatedAnalyses(
  currentItem,
  limit = 3,
) {
  if (!currentItem) {
    return [];
  }

  return getHistory()
    .filter(
      (historyItem) =>
        historyItem.id !== currentItem.id,
    )
    .map((historyItem) => ({
      historyItem,
      score: calculateSimilarity(
        currentItem,
        historyItem,
      ),
    }))
    .filter(({ score }) => score > 0)
    .sort((firstItem, secondItem) => {
      if (secondItem.score !== firstItem.score) {
        return secondItem.score - firstItem.score;
      }

      const firstDate = new Date(
        firstItem.historyItem.createdAt ?? 0,
      ).getTime();

      const secondDate = new Date(
        secondItem.historyItem.createdAt ?? 0,
      ).getTime();

      return secondDate - firstDate;
    })
    .slice(0, limit)
    .map(({ historyItem }) =>
      createRelatedContent(historyItem),
    );
}

export function exportHistoryAsJson() {
  const history = getHistory();

  if (history.length === 0) {
    return {
      success: false,
      message: "Nenhuma análise disponível para exportação.",
    };
  }

  const exportData = {
    projeto: "TechMind",
    exportadoEm: new Date().toISOString(),
    totalDeAnalises: history.length,
    analises: history,
  };

  const jsonContent = JSON.stringify(
    exportData,
    null,
    2,
  );

  const fileBlob = new Blob(
    [jsonContent],
    {
      type: "application/json;charset=utf-8",
    },
  );

  const fileUrl = URL.createObjectURL(fileBlob);
  const downloadLink = document.createElement("a");

  downloadLink.href = fileUrl;
  downloadLink.download = createExportFileName();

  document.body.appendChild(downloadLink);
  downloadLink.click();
  downloadLink.remove();

  URL.revokeObjectURL(fileUrl);

  return {
    success: true,
    message: `${history.length} ${
      history.length === 1
        ? "análise exportada"
        : "análises exportadas"
    } com sucesso.`,
  };
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