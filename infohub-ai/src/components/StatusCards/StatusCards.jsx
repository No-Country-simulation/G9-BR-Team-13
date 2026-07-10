import { Cloud, Database, Server, FileJson } from "lucide-react";

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
    <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-3xl border border-white/10 bg-slate-900 p-5 shadow-xl shadow-slate-950/30"
          >
            <div className="mb-4 flex items-center justify-between">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-2xl ${card.bg} ${card.color}`}
              >
                <Icon size={22} />
              </div>

              <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-400">
                MVP
              </span>
            </div>

            <p className="text-sm text-slate-400">{card.title}</p>
            <h3 className={`mt-1 text-xl font-bold ${card.color}`}>
              {card.value}
            </h3>
            <p className="mt-1 text-sm text-slate-500">{card.description}</p>
          </div>
        );
      })}
    </section>
  );
}

export default StatusCards;