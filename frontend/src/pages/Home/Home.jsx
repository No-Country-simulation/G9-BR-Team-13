import { useState } from "react";
import { useOutletContext } from "react-router-dom";

import AnalysisForm from "../../components/AnalysisForm/AnalysisForm";
import JsonViewer from "../../components/JsonViewer/JsonViewer";
import RelatedContent from "../../components/RelatedContent/RelatedContent";
import ResultCard from "../../components/ResultCard/ResultCard";
import StatusCards from "../../components/StatusCards/StatusCards";
import { analyzeContent } from "../../services/api";
import {
  getRelatedAnalyses,
  saveAnalysis,
} from "../../services/history";

function Home() {
  const outletContext = useOutletContext();

  const backendStatus =
    outletContext?.backendStatus ?? "checking";

  const [result, setResult] = useState(null);
  const [relatedContents, setRelatedContents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleAnalyze(payload) {
    setIsLoading(true);
    setError(null);
    setRelatedContents([]);

    try {
      const response = await analyzeContent(payload);

      setResult(response);

      const savedAnalysis = saveAnalysis(
        response,
        payload,
      );

      const relatedAnalyses =
        getRelatedAnalyses(savedAnalysis);

      setRelatedContents(relatedAnalyses);

      return true;
    } catch (requestError) {
      console.error(requestError);

      setError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível analisar o conteúdo.",
      );

      return false;
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <StatusCards backendStatus={backendStatus} />

      <section className="grid gap-5 lg:gap-6 xl:grid-cols-[1.2fr_0.8fr]">
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