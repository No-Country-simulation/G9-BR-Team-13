/**
 * Módulo de comunicação HTTP com o serviço Backend.
 * Centraliza as requisições de verificação de status e análise de conteúdo.
 */

// URL base do Backend obtida das variáveis de ambiente (Vite) com fallback local
const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080";

/**
 * Extrai e formata a mensagem de erro retornada pelo backend ou gera uma mensagem padrão.
 *
 * @param {Object|null} errorData Objeto contendo dados da resposta de erro do servidor
 * @returns {string} Mensagem amigável descrevendo o erro ocorrido
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

  // Tratamento para mensagens de validação vindas como pares chave/valor no objeto
  const validationMessages = Object.values(errorData).filter(
    (value) => typeof value === "string",
  );

  if (validationMessages.length > 0) {
    return validationMessages.join(" ");
  }

  return "Não foi possível processar a solicitação.";
}

/**
 * Normaliza os dados recebidos da API backend garantindo valores padrão
 * e estrutura consistente para o restante do sistema frontend.
 *
 * @param {Object} data Objeto retornado pela API backend
 * @returns {Object} Dados padronizados com categoria, probabilidade e informacoesAdicionais
 */
function normalizeResponse(data) {
  const additionalInformation =
    data?.informacoesAdicionais ??
    data?.informacoes_adicionais;

  return {
    categoria:
      typeof data?.categoria === "string" &&
      data.categoria.trim()
        ? data.categoria
        : "Não informada",

    probabilidade:
      typeof data?.probabilidade === "number"
        ? data.probabilidade
        : null,

    informacoesAdicionais: Array.isArray(
      additionalInformation,
    )
      ? additionalInformation
      : [],
  };
}

/**
 * Verifica o status de disponibilidade do servidor backend enviando uma requisição GET.
 * Possui um limite de tempo (timeout) de 5 segundos.
 *
 * @returns {Promise<boolean>} Retorna true se o backend respondeu, ou false caso contrário
 */
export async function checkBackendStatus() {
  const controller = new AbortController();

  // Define um tempo limite de 5 segundos para cancelar a requisição se demorar muito
  const timeoutId = window.setTimeout(() => {
    controller.abort();
  }, 5000);

  try {
    await fetch(`${API_URL}/conteudo`, {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
    });

    return true;
  } catch {
    return false;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

/**
 * Submete um conteúdo técnico (título e texto) para ser analisado e classificado pelo Backend.
 *
 * @param {Object} payload Objeto contendo { titulo, texto }
 * @returns {Promise<Object>} Dados normalizados do resultado da análise
 * @throws {Error} Lança exceção com a mensagem amigável em caso de falha
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
      // Mantém a mensagem padrão se o backend não retornar JSON.
    }

    throw new Error(getErrorMessage(errorData));
  }

  const data = await response.json();

  return normalizeResponse(data);
}