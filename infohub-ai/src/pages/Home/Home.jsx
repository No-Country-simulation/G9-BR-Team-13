import { useState } from "react";

import AnalysisForm from "../../components/AnalysisForm/AnalysisForm";
import JsonViewer from "../../components/JsonViewer/JsonViewer";
import RelatedContent from "../../components/RelatedContent/RelatedContent";
import ResultCard from "../../components/ResultCard/ResultCard";
import StatusCards from "../../components/StatusCards/StatusCards";
import { analyzeContent } from "../../services/api";

const initialResult = {
  categoria: "Backend",
  probabilidade: 0.94,
  informacoesAdicionais: ["Java", "Spring Boot", "API REST"],
};

const initialRelatedContents = [
  {
    id: 1,
    title: "Spring Boot REST API",
    category: "Backend",
    description:
      "Exemplo de construção de API REST com Java, Spring Boot e boas práticas.",
    type: "repository",
  },
  {
    id: 2,
    title: "Persistência com Spring Data JPA",
    category: "Banco de Dados",
    description:
      "Conteúdo relacionado sobre entidades, repositórios e persistência de dados.",
    type: "database",
  },
  {
    id: 3,
    title: "Documentação de APIs com Swagger",
    category: "Documentação",
    description:
      "Material complementar para documentar e testar endpoints REST.",
    type: "documentation",
  },
];

function Home() {
  const [result, setResult] = useState(initialResult);
  const [relatedContents, setRelatedContents] = useState(
    initialRelatedContents,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleAnalyze(payload) {
    setIsLoading(true);
    setError(null);

    try {
      const response = await analyzeContent(payload);

      setResult(response);

      if (Array.isArray(response.conteudosRelacionados)) {
        setRelatedContents(response.conteudosRelacionados);
      }
    } catch (requestError) {
  console.error(requestError);

  setError(
    requestError.message ||
      "Não foi possível analisar o conteúdo."
  );

    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <StatusCards />

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <AnalysisForm
          onSubmit={handleAnalyze}
          isLoading={isLoading}
          error={error}
        />

        <ResultCard result={result} />
      </section>

      <JsonViewer data={result} />

      <RelatedContent items={relatedContents} />
    </>
  );
}

export default Home;