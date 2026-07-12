import { useState } from "react";

import AnalysisForm from "../../components/AnalysisForm/AnalysisForm";
import JsonViewer from "../../components/JsonViewer/JsonViewer";
import RelatedContent from "../../components/RelatedContent/RelatedContent";
import ResultCard from "../../components/ResultCard/ResultCard";
import StatusCards from "../../components/StatusCards/StatusCards";

const initialResult = {
  categoria: "Backend",
  probabilidade: 0.94,
  palavrasChave: ["Java", "Spring Boot", "API REST"],
  modelo: "TF-IDF + Regressão Logística",
  status: "Modelo carregado",
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
  const [result] = useState(initialResult);
  const [relatedContents] = useState(initialRelatedContents);

  return (
    <>
      <StatusCards />

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <AnalysisForm />
        <ResultCard result={result} />
      </section>

      <JsonViewer data={result} />

      <RelatedContent items={relatedContents} />
    </>
  );
}

export default Home;