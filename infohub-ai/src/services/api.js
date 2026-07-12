const API_URL = "http://localhost:8080";

export async function analyzeContent(payload) {
  const response = await fetch(`${API_URL}/conteudo`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Erro ao comunicar com o servidor.");
  }

  return response.json();
}