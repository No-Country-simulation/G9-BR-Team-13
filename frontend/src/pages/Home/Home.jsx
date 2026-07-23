import { useState } from "react";

import AnalysisForm from "../../components/AnalysisForm/AnalysisForm";
import JsonViewer from "../../components/JsonViewer/JsonViewer";
import RelatedContent from "../../components/RelatedContent/RelatedContent";
import ResultCard from "../../components/ResultCard/ResultCard";
import StatusCards from "../../components/StatusCards/StatusCards";
import { analyzeContent } from "../../services/api";
import { saveAnalysis } from "../../services/history";

function Home() {
  const [result, setResult] = useState(null);
  const [relatedContents, setRelatedContents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleAnalyze(payload) {
    setIsLoading(true);
    setError(null);

    try {
      const response = await analyzeContent(payload);

      setResult(response);
      saveAnalysis(response);
      setRelatedContents([]);
    } catch (requestError) {
      console.error(requestError);

      setError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível analisar o conteúdo.",
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

      {result && <JsonViewer data={result} />}

      <RelatedContent items={relatedContents} />
    </>
  );
}

export default Home;