/**
 * Componente da Página de Dashboard.
 * Apresenta uma visão geral consolidada da utilização da plataforma, exibindo cartões de métricas
 * (total de análises realizadas, tamanho da base de conhecimento, data da última análise)
 * e uma lista com as 3 análises mais recentes do histórico.
 */

import {
  Activity,
  BookOpen,
  BrainCircuit,
  Clock3,
} from "lucide-react";

import { getHistory } from "../../services/history";

/**
 * Formata uma string ou objeto de data no padrão brasileiro (dd/mm/aaaa hh:mm).
 *
 * @param {string|Date} dateValue Data a ser formatada
 * @returns {string} Data formatada ou "--" se for inválida
 */
function formatDate(dateValue) {
  if (!dateValue) {
    return "--";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "--";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

/**
 * Converte um valor numérico de probabilidade/confiança para string percentual com 1 casa decimal.
 *
 * @param {number|string} probability Probabilidade (de 0 a 1 ou de 0 a 100)
 * @returns {string} Confiança formatada (ex: "95.5%")
 */
function formatConfidence(probability) {
  const numericProbability = Number(probability);

  if (Number.isNaN(numericProbability)) {
    return "--";
  }

  const percentage =
    numericProbability <= 1
      ? numericProbability * 100
      : numericProbability;

  return `${percentage.toFixed(1)}%`;
}

function Dashboard() {
  // Busca todas as análises salvas no localStorage
  const history = getHistory();
  // Filtra apenas as 3 análises mais recentes
  const recentAnalyses = history.slice(0, 3);
  const lastAnalysis = history[0];

  // Configuração dos cartões de métricas do topo do Dashboard
  const summaryCards = [
    {
      title: "Análises realizadas",
      value: history.length.toString(),
      description:
        history.length === 1
          ? "Conteúdo processado"
          : "Conteúdos processados",
      icon: BrainCircuit,
    },
    {
      title: "Base de conhecimento",
      value: history.length.toString(),
      description: "Conteúdos armazenados",
      icon: BookOpen,
    },
    {
      title: "Última análise",
      value: lastAnalysis
        ? formatDate(lastAnalysis.createdAt)
        : "--",
      description: lastAnalysis
        ? "Análise mais recente"
        : "Nenhuma análise registrada",
      icon: Clock3,
    },
    {
      title: "Status da plataforma",
      value: "Ativa",
      description: "Frontend disponível",
      icon: Activity,
    },
  ];

  return (
    <section>
      {/* Título e descrição da página */}
      <div className="mb-5 sm:mb-6">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">
          Dashboard
        </h2>

        <p className="mt-1.5 text-sm text-slate-400 sm:mt-2">
          Visão geral da plataforma e das análises realizadas.
        </p>
      </div>

      {/* Grid com cartões de indicadores/métricas */}
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <article
              key={card.title}
              className="rounded-3xl border border-white/10 bg-slate-900 p-4 shadow-xl shadow-slate-950/30 sm:p-5"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300 sm:mb-4 sm:h-11 sm:w-11">
                <Icon size={20} />
              </div>

              <p className="text-xs text-slate-400 sm:text-sm">
                {card.title}
              </p>

              <h3 className="mt-1 text-xl font-bold text-white sm:text-2xl">
                {card.value}
              </h3>

              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                {card.description}
              </p>
            </article>
          );
        })}
      </div>

      {/* Seção de atividade recente */}
      <div className="mt-5 rounded-3xl border border-white/10 bg-slate-900 p-4 sm:mt-6 sm:p-6">
        <h3 className="text-lg font-bold text-white sm:text-xl">
          Atividade recente
        </h3>

        <p className="mt-1.5 text-sm text-slate-400 sm:mt-2">
          Acompanhe as três análises mais recentes realizadas na plataforma.
        </p>

        {recentAnalyses.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-slate-950/40 p-5 text-center sm:mt-6">
            <BrainCircuit
              className="mx-auto text-slate-600"
              size={30}
            />

            <p className="mt-3 text-sm font-medium text-slate-300">
              Nenhuma análise registrada
            </p>

            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              As análises realizadas aparecerão nesta área.
            </p>
          </div>
        ) : (
          <div className="mt-5 space-y-3 sm:mt-6">
            {recentAnalyses.map((analysis) => {
              const category =
                analysis.summary?.categoria || "Sem categoria";

              const confidence = formatConfidence(
                analysis.summary?.probabilidade,
              );

              return (
                <article
                  key={analysis.id}
                  className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-950/40 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
                      <BrainCircuit size={19} />
                    </div>

                    <div className="min-w-0">
                      <h4 className="truncate text-sm font-semibold text-white sm:text-base">
                        {category}
                      </h4>

                      <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                        {formatDate(analysis.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 sm:justify-end">
                    <span className="text-xs text-slate-500">
                      Confiança
                    </span>

                    <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                      {confidence}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default Dashboard;