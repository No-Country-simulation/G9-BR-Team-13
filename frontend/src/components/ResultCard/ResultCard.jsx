import { Brain, Gauge, Tags, BarChart2 } from "lucide-react";

function ResultCard({ result }) {
  if (!result) {
    return (
      <section className="rounded-3xl border border-white/10 bg-slate-900 p-4 sm:p-6">
        <h3 className="text-lg font-bold text-white sm:text-xl">
          Resultado da análise
        </h3>

        <p className="mt-2 text-sm text-slate-400">
          O resultado aparecerá aqui após o processamento.
        </p>
      </section>
    );
  }

  const probability = Number(result.probabilidade);

  const formattedProbability = Number.isFinite(probability)
    ? `${Math.round(probability * 100)}%`
    : "Não informada";

  const keywords = Array.isArray(result.informacoesAdicionais)
    ? result.informacoesAdicionais
    : [];

  const explicabilidade = Array.isArray(result.explicabilidade)
    ? result.explicabilidade
    : [];

  const getPercentage = (peso) => {
    const num = Number(peso);
    if (!Number.isFinite(num)) return 0;
    return num > 1 ? num : Math.round(num * 100);
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900 p-4 shadow-2xl shadow-slate-950/40 sm:p-6">
      <div className="mb-5 flex items-center gap-3 sm:mb-6">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-purple-400/10 text-purple-300 sm:h-12 sm:w-12">
          <Brain size={22} />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold text-white sm:text-xl">
            Resultado da análise
          </h3>

          <p className="text-xs text-slate-400 sm:text-sm">
            Informações retornadas pelo modelo de classificação.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
        <div className="rounded-2xl border border-white/10 bg-slate-950 p-3 sm:p-4">
          <div className="mb-1.5 flex items-center gap-2 text-slate-400 sm:mb-2">
            <Brain size={16} />

            <span className="text-xs sm:text-sm">
              Categoria
            </span>
          </div>

          <p className="text-base font-bold text-cyan-300 sm:text-xl">
            {result.categoria || "Não informada"}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-950 p-3 sm:p-4">
          <div className="mb-1.5 flex items-center gap-2 text-slate-400 sm:mb-2">
            <Gauge size={16} />

            <span className="text-xs sm:text-sm">
              Probabilidade
            </span>
          </div>

          <p className="text-base font-bold text-emerald-300 sm:text-xl">
            {formattedProbability}
          </p>
        </div>
      </div>

      {explicabilidade.length > 0 ? (
        <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950 p-3 sm:mt-5 sm:p-4">
          <div className="mb-3 flex items-center gap-2 text-slate-400 sm:mb-4">
            <BarChart2 size={16} />
            <span className="text-xs sm:text-sm">Explicabilidade dos Termos</span>
          </div>

          <div className="space-y-2.5 sm:space-y-3">
            {explicabilidade.map((item) => {
              const percentage = getPercentage(item.peso);
              return (
                <div key={item.termo}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-xs font-medium text-cyan-300 sm:text-sm">
                      {item.termo}
                    </span>
                    <span className="text-xs font-bold text-purple-300 sm:text-sm">
                      {percentage}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950 p-3 sm:mt-5 sm:p-4">
          <div className="mb-2.5 flex items-center gap-2 text-slate-400 sm:mb-3">
            <Tags size={16} />

            <span className="text-xs sm:text-sm">
              Palavras-chave
            </span>
          </div>

          {keywords.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-full bg-cyan-400/10 px-2.5 py-1 text-xs font-medium text-cyan-300 sm:px-3 sm:text-sm"
                >
                  {keyword}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 sm:text-sm">
              Nenhuma palavra-chave foi retornada.
            </p>
          )}
        </div>
      )}
    </section>
  );
}

export default ResultCard;
