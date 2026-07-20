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
  return {
    categoria: data.categoria,
    probabilidade: data.probabilidade,

    // Ele aceita tanto o contrato atual em camelCase quanto
    // o formato com underscore presente na documentação.
    informacoesAdicionais:
      data.informacoesAdicionais ??
      data.informacoes_adicionais ??
      [],
  };
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
    let errorData = null;

    try {
      errorData = await response.json();
    } catch {
      // Vai manter a mensagem padrão se o backend não retornar JSON.
    }

    throw new Error(getErrorMessage(errorData));
  }

  const data = await response.json();

  return normalizeResponse(data);
}