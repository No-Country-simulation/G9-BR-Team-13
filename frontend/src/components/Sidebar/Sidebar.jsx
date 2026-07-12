import {
  BarChart3,
  BookOpen,
  BrainCircuit,
  FileSearch,
  History,
  Settings,
  Wifi,
} from "lucide-react";

function Sidebar() {
  const menuItems = [
    {
      label: "Dashboard",
      icon: BarChart3,
      active: true,
    },
    {
      label: "Analisar Conteúdo",
      icon: FileSearch,
    },
    {
      label: "Base de Conhecimento",
      icon: BookOpen,
    },
    {
      label: "Histórico",
      icon: History,
    },
    {
      label: "Configurações",
      icon: Settings,
    },
  ];

  return (
    <aside className="hidden min-h-screen w-72 flex-col border-r border-white/10 bg-slate-950 px-6 py-6 lg:flex">
      <div className="mb-10 flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-400 text-sm font-bold text-slate-950">
          IH
        </div>

        <div>
          <h1 className="text-xl font-bold text-white">InfoHub AI</h1>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            Plataforma de Organização de Conteúdo Técnico
          </p>
        </div>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              type="button"
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                item.active
                  ? "bg-cyan-400/10 text-cyan-300"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={19} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto rounded-3xl border border-white/10 bg-slate-900 p-5">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
            <BrainCircuit size={20} />
          </div>

          <div>
            <p className="text-sm font-semibold text-white">InfoHub AI</p>
            <p className="text-xs text-slate-500">Versão 1.0.0</p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-2xl bg-slate-950 px-3 py-3">
          <Wifi size={17} className="text-amber-300" />

          <div>
            <p className="text-xs text-slate-500">Status do backend</p>
            <p className="text-sm font-medium text-amber-300">
              Aguardando conexão
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;