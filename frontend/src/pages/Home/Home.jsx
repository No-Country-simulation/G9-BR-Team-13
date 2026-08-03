/**
 * Componente da Página Principal (Home).
 * Integra o formulário de análise (AnalysisForm), exibição de resultados (ResultCard),
 * visualizador de dados brutos (JsonViewer) e sugestões de conteúdos relacionados (RelatedContent).
 */

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
  // Obtém o contexto compartilhado pelo MainLayout (contém o status do backend)
  const outletContext = useOutletContext();

  const backendStatus =
    outletContext?.backendStatus ?? "checking";

  // Estados locais para controlar o resultado da análise, carregamento e erros
  const [result, setResult] = useState(null);
  const [relatedContents, setRelatedContents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Função executada ao enviar o formulário de análise.
   * Envia os dados para a API, armazena no histórico local e busca conteúdos relacionados.
   *
   * @param {Object} payload Dados do formulário contendo { titulo, texto }
   * @returns {Promise<boolean>} Retorna true se a análise for concluída com sucesso
   */
  async function handleAnalyze(payload) {
    setIsLoading(true);
    setError(null);
    setRelatedContents([]);

    try {
      // 1. Envia o texto para a API backend classificar
      const response = await analyzeContent(payload);

      setResult(response);

      // 2. Salva o resultado no histórico local (localStorage)
      const savedAnalysis = saveAnalysis(
        response,
        payload,
      );

      // 3. Busca outras análises semelhantes armazenadas no histórico
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
      {/* Cards de métricas e status da plataforma */}
      <StatusCards backendStatus={backendStatus} />

      {/* Seção principal: Formulário de Análise e Card com o Resultado */}
      <section className="grid gap-5 lg:gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <AnalysisForm
          onSubmit={handleAnalyze}
          isLoading={isLoading}
          error={error}
        />

        <ResultCard result={result} />
      </section>

      {/* Exibe a estrutura de dados em formato JSON caso haja um resultado */}
      {result && <JsonViewer data={result} />}

      {/* Seção de conteúdos ou análises similares encontradas */}
      <RelatedContent items={relatedContents} />
    </>
  );
}

export default Home;