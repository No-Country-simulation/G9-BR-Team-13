/**
 * Componente de Cards de Status (StatusCards).
 * Exibe uma grade de cards informativos com as principais métricas e conectores da plataforma:
 * status da API REST, conexão OCI Object Storage, Base de dados do Histórico e Formato de saída JSON.
 *
 * @param {Object} props
 * @param {string} props.backendStatus Estado da API backend ("online", "offline" ou "checking")
 */

import {
  Cloud,
  Database,
  FileJson,
  Server,
} from "lucide-react";

/**
 * Retorna as propriedades visuais do card da API REST conforme o status atual da conexão.
 *
 * @param {string} backendStatus Status da API
 * @returns {Object} Dados formatados do card da API
 */
function getApiCard(backendStatus) {
  if (backendStatus === "online") {
    return {
      title: "API REST",
      value: "Online",
      description: "Backend conectado",
      icon: Server,
      color: "text-emerald-300",
      bg: "bg-emerald-400/10",
    };
  }

  if (backendStatus === "offline") {
    return {
      title: "API REST",
      value: "Offline",
      description: "Backend indisponível",
      icon: Server,
      color: "text-red-300",
      bg: "bg-red-400/10",
    };
  }

  return {
    title: "API REST",
    value: "Verificando",
    description: "Testando conexão",
    icon: Server,
    color: "text-amber-300",
    bg: "bg-amber-400/10",
  };
}

function StatusCards({ backendStatus }) {
  // Lista de cards informativos exibidos no topo da página
  const cards = [
    getApiCard(backendStatus),
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
            {/* Ícone com fundo colorido */}
            <div className="mb-3 flex items-center sm:mb-4">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-2xl sm:h-11 sm:w-11 ${card.bg} ${card.color}`}
              >
                <Icon size={20} />
              </div>
            </div>

            {/* Rótulo / Título do card */}
            <p className="text-xs text-slate-400 sm:text-sm">
              {card.title}
            </p>

            {/* Valor de destaque */}
            <h3
              className={`mt-1 text-lg font-bold sm:text-xl ${card.color}`}
            >
              {card.value}
            </h3>

            {/* Breve descrição */}
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