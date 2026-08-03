/**
 * Serviço de Gerenciamento do Histórico de Análises no LocalStorage.
 * Permite salvar, recuperar, deletar e buscar análises armazenadas no próprio navegador do usuário,
 * além de calcular recomendação de conteúdos similares com base em categorias e palavras-chave.
 */

// Chave utilizada para salvar/recuperar os dados do histórico no localStorage
const HISTORY_STORAGE_KEY = "techmind-analysis-history";

/**
 * Normaliza um texto garantindo que seja uma string válida e sem espaços sobressalentes.
 *
 * @param {any} value Valor a ser validado e limpo
 * @param {string} fallback Valor padrão retornado caso a entrada seja inválida ou vazia
 * @returns {string} Texto tratado ou o valor de fallback
 */
function normalizeText(value, fallback = "") {
  return typeof value === "string" && value.trim()
    ? value.trim()
    : fallback;
}

/**
 * Cria um objeto padronizado representando um item do histórico de análises.
 *
 * @param {Object} result Resultado retornado pela API backend
 * @param {Object} payload Dados enviados no formulário ({ titulo, texto })
 * @returns {Object} Objeto estruturado do item de histórico com ID único e data de criação
 */
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

/**
 * Remove acentos, caracteres especiais e converte o texto para caixa baixa para facilitar comparações.
 *
 * @param {string} value Texto a ser normalizado
 * @returns {string} Texto sem acentos e em minúsculas
 */
function normalizeForComparison(value) {
  return normalizeText(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

/**
 * Extrai palavras relevantes (tokens) de um texto desconsiderando stopwords (palavras comuns como 'para', 'com', 'que').
 *
 * @param {string} value Texto completo a ser analisado
 * @returns {Set<string>} Conjunto de palavras únicas com 4 ou mais caracteres
 */
function getRelevantWords(value) {
  // Lista de palavras comuns em português (stopwords) que não agregam valor relevante na comparação
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

/**
 * Calcula uma pontuação de similaridade (score) entre dois itens de análise.
 * Atribui pontos para mesma categoria e para cada palavra-chave correspondente.
 *
 * @param {Object} currentItem Análise atual
 * @param {Object} historyItem Análise do histórico a ser comparada
 * @returns {number} Pontuação de similaridade
 */
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

  // Se forem da mesma categoria, adiciona pontuação alta
  if (
    currentCategory &&
    historyCategory &&
    currentCategory === historyCategory
  ) {
    score += 10;
  }

  // Soma 1 ponto para cada palavra-chave em comum
  currentWords.forEach((word) => {
    if (historyWords.has(word)) {
      score += 1;
    }
  });

  return score;
}

/**
 * Converte um item do histórico em um formato exibível para a seção de conteúdos relacionados.
 *
 * @param {Object} historyItem Item armazenado no histórico
 * @returns {Object} Objeto formatado com título, descrição resumida e categoria
 */
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

/**
 * Busca o histórico de análises armazenado no localStorage do navegador.
 *
 * @returns {Array<Object>} Lista de análises anteriores ou array vazio em caso de erro
 */
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

/**
 * Salva uma nova análise realizada no topo do histórico no localStorage.
 *
 * @param {Object} result Resultado devolvido pela API backend
 * @param {Object} payload Dados submetidos no formulário ({ titulo, texto })
 * @returns {Object} Item do histórico recém-criado
 */
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

/**
 * Retorna uma lista de análises do histórico que são similares à análise atual.
 *
 * @param {Object} currentItem Análise de referência
 * @param {number} limit Quantidade máxima de itens relacionados retornados (padrão: 3)
 * @returns {Array<Object>} Lista de conteúdos parecidos formatados para exibição
 */
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
      // Ordena primeiramente pelo score de similaridade (decrescente)
      if (secondItem.score !== firstItem.score) {
        return secondItem.score - firstItem.score;
      }

      // Em caso de empate, ordena pela data mais recente
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

/**
 * Exclui um item específico do histórico pelo seu ID.
 *
 * @param {string} id Identificador único da análise a ser excluída
 * @returns {Array<Object>} Lista atualizada do histórico após a exclusão
 */
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

/**
 * Limpa completamente o histórico armazenado no localStorage.
 */
export function clearHistory() {
  localStorage.removeItem(HISTORY_STORAGE_KEY);
}