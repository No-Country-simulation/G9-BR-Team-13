import { useState } from "react";
import { Clock3, History as HistoryIcon } from "lucide-react";

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

      <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
        {history.length === 0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-slate-950/60 p-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-400/10 text-purple-300">
              <HistoryIcon size={26} />
            </div>

            <h3 className="mt-4 text-lg font-bold text-white">
              Nenhuma análise registrada
            </h3>

            <div className="mt-2 flex items-center gap-2 text-sm text-slate-400">
              <Clock3 size={16} />

              <span>
                As análises realizadas serão exibidas aqui.
              </span>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-400/10 text-purple-300">
                <HistoryIcon size={24} />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">
                  Histórico carregado
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  {history.length}{" "}
                  {history.length === 1
                    ? "análise registrada"
                    : "análises registradas"}
                  .
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-white/10 bg-slate-900 p-5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-cyan-300">
                        {item.summary.categoria}
                      </h4>

                      <p className="mt-1 text-sm text-slate-400">
                        Probabilidade:{" "}
                        {item.summary.probabilidade !== null
                          ? `${Math.round(
                              item.summary.probabilidade * 100,
                            )}%`
                          : "Não informada"}
                      </p>
                    </div>

                    <span className="text-xs text-slate-500">
                      {new Date(item.createdAt).toLocaleString("pt-BR")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default History;