import { useState } from "react";
import {
  Calendar,
  Clock3,
  History as HistoryIcon,
  Tag,
} from "lucide-react";

import { getHistory } from "../../services/history";

function History() {
  const [history] = useState(() => getHistory());

  return (
    <section>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white">
          Histórico de Análises
        </h2>

        <p className="mt-2 text-slate-400">
          Consulte os conteúdos analisados anteriormente.
        </p>
      </div>

      {history.length === 0 ? (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-slate-900 p-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-400/10 text-purple-300">
            <HistoryIcon size={26} />
          </div>

          <h3 className="mt-4 text-lg font-bold text-white">
            Nenhuma análise registrada
          </h3>

          <div className="mt-2 flex items-center gap-2 text-sm text-slate-400">
            <Clock3 size={16} />
            <span>As análises realizadas serão exibidas aqui.</span>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {history.map((item) => {
            const percentage =
              item.summary.probabilidade !== null
                ? Math.round(item.summary.probabilidade * 100)
                : 0;

            const keywords =
              item.response?.informacoesAdicionais ?? [];

            return (
              <article
                key={item.id}
                className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-cyan-300">
                      {item.summary.categoria}
                    </h3>

                    <p className="mt-1 text-sm text-slate-400">
                      Categoria identificada pela IA
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Calendar size={16} />

                    <span>
                      {new Date(item.createdAt).toLocaleString("pt-BR")}
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium text-slate-300">
                      Confiança
                    </span>

                    <span className="font-bold text-cyan-300">
                      {percentage}%
                    </span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-slate-700">
                    <div
                      className="h-full rounded-full bg-cyan-400 transition-all"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <div className="mb-3 flex items-center gap-2 text-slate-300">
                    <Tag size={18} />
                    <span className="font-medium">Palavras-chave</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {keywords.length > 0 ? (
                      keywords.map((keyword) => (
                        <span
                          key={keyword}
                          className="rounded-full bg-cyan-500/10 px-3 py-1 text-sm text-cyan-300"
                        >
                          {keyword}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-slate-500">
                        Nenhuma palavra-chave encontrada.
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    className="rounded-xl border border-cyan-500 px-4 py-2 text-sm font-medium text-cyan-300 transition hover:bg-cyan-500/10"
                    disabled
                  >
                    Ver JSON
                  </button>

                  <button
                    className="rounded-xl border border-slate-600 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-700"
                    disabled
                  >
                    Copiar JSON
                  </button>

                  <button
                    className="rounded-xl border border-red-500 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
                    disabled
                  >
                    Excluir
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default History;