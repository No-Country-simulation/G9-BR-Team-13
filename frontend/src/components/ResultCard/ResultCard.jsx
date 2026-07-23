import { Brain, Gauge, Tags } from "lucide-react";

function ResultCard({ result }) {
  if (!result) {
    return (
      <section className="rounded-3xl border border-white/10 bg-slate-900 p-6">
        <h3 className="text-xl font-bold text-white">
          Resultado da análise
        </h3>

        <p className="mt-2 text-slate-400">
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

  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-slate-950/40">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-400/10 text-purple-300">
          <Brain size={24} />
        </div>

        <div>
          <h3 className="text-xl font-bold text-white">
            Resultado da análise
          </h3>

          <p className="text-sm text-slate-400">
            Informações retornadas pelo modelo de classificação.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-slate-950 p-4">
          <div className="mb-2 flex items-center gap-2 text-slate-400">
            <Brain size={18} />

            <span className="text-sm">
              Categoria
            </span>
          </div>

          <p className="text-xl font-bold text-cyan-300">
            {result.categoria || "Não informada"}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-950 p-4">
          <div className="mb-2 flex items-center gap-2 text-slate-400">
            <Gauge size={18} />

            <span className="text-sm">
              Probabilidade
            </span>
          </div>

          <p className="text-xl font-bold text-emerald-300">
            {formattedProbability}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950 p-4">
        <div className="mb-3 flex items-center gap-2 text-slate-400">
          <Tags size={18} />

          <span className="text-sm">
            Palavras-chave
          </span>
        </div>

        {keywords.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword) => (
              <span
                key={keyword}
                className="rounded-full bg-cyan-400/10 px-3 py-1 text-sm font-medium text-cyan-300"
              >
                {keyword}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">
            Nenhuma palavra-chave foi retornada.
          </p>
        )}
      </div>
    </section>
  );
}

export default ResultCard;