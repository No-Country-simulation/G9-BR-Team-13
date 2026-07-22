import {
  Activity,
  BookOpen,
  BrainCircuit,
  Clock3,
} from "lucide-react";

/**
 * Componente da Página de Dashboard.
 * Exibe uma visão geral com métricas sintetizadas da plataforma.
 */
function Dashboard() {

  const summaryCards = [
    {
      title: "Análises realizadas",
      value: "0",
      description: "Conteúdos processados",
      icon: BrainCircuit,
    },
    {
      title: "Base de conhecimento",
      value: "0",
      description: "Conteúdos armazenados",
      icon: BookOpen,
    },
    {
      title: "Última análise",
      value: "--",
      description: "Nenhuma análise registrada",
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
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white">Dashboard</h2>

        <p className="mt-2 text-slate-400">
          Visão geral da plataforma e das análises realizadas.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <article
              key={card.title}
              className="rounded-3xl border border-white/10 bg-slate-900 p-5 shadow-xl shadow-slate-950/30"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
                <Icon size={22} />
              </div>

              <p className="text-sm text-slate-400">{card.title}</p>

              <h3 className="mt-1 text-2xl font-bold text-white">
                {card.value}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {card.description}
              </p>
            </article>
          );
        })}
      </div>

      <div className="mt-6 rounded-3xl border border-white/10 bg-slate-900 p-6">
        <h3 className="text-xl font-bold text-white">
          Atividade recente
        </h3>

        <p className="mt-2 text-sm text-slate-400">
          As análises mais recentes serão exibidas aqui.
        </p>
      </div>
    </section>
  );
}

export default Dashboard;