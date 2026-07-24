import { Cloud, Database, FileJson, Server } from "lucide-react";

function StatusCards() {
  const cards = [
    {
      title: "API REST",
      value: "Online",
      description: "Spring Boot preparado",
      icon: Server,
      color: "text-emerald-300",
      bg: "bg-emerald-400/10",
    },
    {
      title: "OCI Object Storage",
      value: "Modelo",
      description: "Artefatos .joblib",
      icon: Cloud,
      color: "text-cyan-300",
      bg: "bg-cyan-400/10",
    },
    {
      title: "Base de dados",
      value: "Histórico",
      description: "Resultados persistidos",
      icon: Database,
      color: "text-purple-300",
      bg: "bg-purple-400/10",
    },
    {
      title: "Saída",
      value: "JSON",
      description: "Consumo por aplicações",
      icon: FileJson,
      color: "text-amber-300",
      bg: "bg-amber-400/10",
    },
  ];

  return (
    <section className="mb-5 grid gap-3 sm:mb-6 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-3xl border border-white/10 bg-slate-900 p-4 shadow-xl shadow-slate-950/30 sm:p-5"
          >
            <div className="mb-3 flex items-center sm:mb-4">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-2xl sm:h-11 sm:w-11 ${card.bg} ${card.color}`}
              >
                <Icon size={20} />
              </div>
            </div>

            <p className="text-xs text-slate-400 sm:text-sm">{card.title}</p>

            <h3 className={`mt-1 text-lg font-bold sm:text-xl ${card.color}`}>
              {card.value}
            </h3>

            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              {card.description}
            </p>
          </div>
        );
      })}
    </section>
  );
}

export default StatusCards;
