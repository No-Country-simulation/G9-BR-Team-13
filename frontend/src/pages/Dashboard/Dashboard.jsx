import {
  Activity,
  BookOpen,
  BrainCircuit,
  Clock3,
} from "lucide-react";

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
      <div className="mb-5 sm:mb-6">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">
          Dashboard
        </h2>

        <p className="mt-1.5 text-sm text-slate-400 sm:mt-2">
          Visão geral da plataforma e das análises realizadas.
        </p>
      </div>

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

      <div className="mt-5 rounded-3xl border border-white/10 bg-slate-900 p-4 sm:mt-6 sm:p-6">
        <h3 className="text-lg font-bold text-white sm:text-xl">
          Atividade recente
        </h3>

        <p className="mt-1.5 text-sm text-slate-400 sm:mt-2">
          As análises mais recentes serão exibidas aqui.
        </p>
      </div>
    </section>
  );
}

export default Dashboard;
