const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080";

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

async function readErrorResponse(response) {
  let errorData = null;

  try {
    errorData = await response.json();
  } catch {
    // Mantém a mensagem padrão quando a resposta não contém JSON.
  }

  return getErrorMessage(errorData);
}

export async function checkBackendStatus() {
  const controller = new AbortController();

  const timeoutId = window.setTimeout(() => {
    controller.abort();
  }, 5000);

  try {
    const response = await fetch(
      `${API_URL}/conteudo?palavra-chave=`,
      {
        method: "GET",
        cache: "no-store",
        signal: controller.signal,
      },
    );

    return response.ok;
  } catch {
    return false;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export async function searchContents(searchTerm = "") {
  const normalizedSearchTerm =
    typeof searchTerm === "string"
      ? searchTerm.trim()
      : "";

  const searchParams = new URLSearchParams({
    "palavra-chave": normalizedSearchTerm,
  });

  let response;

  try {
    response = await fetch(
      `${API_URL}/conteudo?${searchParams.toString()}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      },
    );
  } catch {
    throw new Error(
      "Não foi possível conectar ao backend. Verifique se o servidor está em execução.",
    );
  }

  if (!response.ok) {
    const errorMessage =
      await readErrorResponse(response);

    throw new Error(errorMessage);
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    return [];
  }

  return data.map((item, index) => ({
    id: `${item?.categoria ?? "conteudo"}-${index}`,
    ...normalizeResponse(item),
  }));
}

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
    const errorMessage =
      await readErrorResponse(response);

    throw new Error(errorMessage);
  }

  const data = await response.json();

  return normalizeResponse(data);
}