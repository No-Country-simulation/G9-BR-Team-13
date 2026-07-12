const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080";

export async function analyzeContent(payload) {
  const response = await fetch(`${API_URL}/conteudo`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let message = "Erro ao comunicar com o servidor.";

    try {
      const errorData = await response.json();

      if (errorData?.message) {
        message = errorData.message;
      }
    } catch {
      // Vai manter a mensagem padrão quando a API não retornar JSON.
    }

    throw new Error(message);
  }

  return response.json();
}