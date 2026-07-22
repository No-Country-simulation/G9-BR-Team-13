import { Clock3, History as HistoryIcon } from "lucide-react";

/**
 * Componente da Página de Histórico.
 * Responsável por apresentar a lista de análises realizadas anteriormente no sistema.
 */
function History() {

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
      </div>
    </section>
  );
}

export default History;