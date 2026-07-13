import { Brain, CheckCircle, Gauge, Tags } from "lucide-react";

function ResultCard({ result }) {
  if (!result) {
    return (
      <section className="rounded-3xl border border-white/10 bg-slate-900 p-6">
        <h3 className="text-xl font-bold text-white">Resultado da análise</h3>

        <p className="mt-2 text-slate-400">
          O resultado aparecerá aqui após o processamento.
        </p>
      </section>
    );
  }

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
            <span className="text-sm">Categoria</span>
          </div>

          <p className="text-xl font-bold text-cyan-300">
            {result.categoria}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-950 p-4">
          <div className="mb-2 flex items-center gap-2 text-slate-400">
            <Gauge size={18} />
            <span className="text-sm">Probabilidade</span>
          </div>

          <p className="text-xl font-bold text-emerald-300">
            {Math.round(result.probabilidade * 100)}%
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950 p-4">
        <div className="mb-3 flex items-center gap-2 text-slate-400">
          <Tags size={18} />
          <span className="text-sm">Palavras-chave</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {(result.informacoes_adicionais ?? []).map((keyword) => (
            <span
              key={keyword}
              className="rounded-full bg-cyan-400/10 px-3 py-1 text-sm font-medium text-cyan-300"
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950 p-4">
        <div className="mb-2 flex items-center gap-2 text-slate-400">
          <CheckCircle size={18} />
          <span className="text-sm">Status do modelo</span>
        </div>

        <p className="font-semibold text-emerald-300">{result.status}</p>

        <p className="mt-1 text-sm text-slate-500">{result.modelo}</p>
      </div>
    </section>
  );
}

export default ResultCard;