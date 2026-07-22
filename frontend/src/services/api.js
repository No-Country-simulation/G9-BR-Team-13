/**
 * Serviço de comunicação HTTP com o backend (Spring Boot API REST).
 */

// URL base da API REST obtida das variáveis de ambiente (VITE_API_URL) ou fallback para localhost
const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080";

/**
 * Extrai a mensagem de erro apropriada retornada pelo backend ou gera uma mensagem padrão.
 * 
 * @param {Object|null} errorData Objeto contendo os detalhes do erro retornados pela API
 * @returns {string} Mensagem de erro legível para ser exibida ao usuário
 */
function getErrorMessage(errorData) {
  if (!errorData || typeof errorData !== "object") {
    return "Erro ao comunicar com o servidor.";
  }

  if (typeof errorData.mensagem === "string") {
    return errorData.mensagem;
  }

  if (typeof errorData.message === "string") {
    return errorData.message;
  }

  const validationMessages = Object.values(errorData).filter(
    (value) => typeof value === "string",
  );

  if (validationMessages.length > 0) {
    return validationMessages.join(" ");
  }

  return "Não foi possível processar a solicitação.";
}

/**
 * Normaliza o formato do objeto de resposta vindo do backend.
 * Garante compatibilidade tanto com camelCase quanto com snake_case.
 * 
 * @param {Object} data Dados brutos retornados pela API
 * @returns {Object} Objeto com os campos padronizados
 */
function normalizeResponse(data) {
  return {
    categoria: data.categoria,
    probabilidade: data.probabilidade,

    // Aceita tanto o contrato em camelCase quanto o formato com underscore (informacoes_adicionais)
    informacoesAdicionais:
      data.informacoesAdicionais ??
      data.informacoes_adicionais ??
      [],
  };
}

/**
 * Envia um texto técnico para classificação na rota `POST /conteudo` do backend.
 * 
 * @param {Object} payload Objeto contendo `{ titulo, texto }`
 * @returns {Promise<Object>} Resposta da classificação com categoria, probabilidade e tags
 * @throws {Error} Lança exceção com a mensagem de erro caso o backend falhe ou esteja indisponível
 */
export async function analyzeContent(payload) {
  let response;

  try {
    response = await fetch(`${API_URL}/conteudo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(
      "Não foi possível conectar ao backend. Verifique se o servidor está em execução.",
    );
  }

  if (!response.ok) {
    let errorData = null;

    try {
      errorData = await response.json();
    } catch {
      // Mantém a mensagem padrão se o backend não retornar um JSON de erro
    }

    throw new Error(getErrorMessage(errorData));
  }

  const data = await response.json();

  return normalizeResponse(data);
}