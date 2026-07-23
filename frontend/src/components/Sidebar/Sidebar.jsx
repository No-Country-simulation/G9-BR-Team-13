import {
  BarChart3,
  BookOpen,
  BrainCircuit,
  FileSearch,
  History,
  Settings,
  Wifi,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

function Sidebar({ isMobileOpen, onClose }) {
  const menuItems = [
    {
      label: "Dashboard",
      icon: BarChart3,
      to: "/dashboard",
    },
    {
      label: "Analisar Conteúdo",
      icon: FileSearch,
      to: "/analisar",
    },
    {
      label: "Base de Conhecimento",
      icon: BookOpen,
      to: "/base-conhecimento",
    },
    {
      label: "Histórico",
      icon: History,
      to: "/historico",
    },
    {
      label: "Configurações",
      icon: Settings,
      to: "/configuracoes",
    },
  ];

  const content = (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-5 sm:px-6">
      <div className="mb-8 flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-400 text-sm font-bold text-slate-950">
          IH
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-bold leading-tight">
            <span className="text-white">InfoHub </span>
            <span className="text-cyan-400">AI</span>
          </h1>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            Plataforma de Organização de Conteúdo Técnico
          </p>
        </div>
      </div>

      <nav className="space-y-1.5">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.to === "/dashboard"}
              onClick={onClose}
              className={({ isActive }) =>
                `flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left text-sm font-medium transition ${
                  isActive
                    ? "bg-cyan-400/10 text-cyan-300"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <Icon size={19} className="shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto pt-6">
        <div className="rounded-3xl border border-white/10 bg-slate-900 p-4 sm:p-5">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
              <BrainCircuit size={20} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white">InfoHub AI</p>
              <p className="text-xs text-slate-500">Versão 1.0.0</p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-2xl bg-slate-950 px-3 py-3">
            <Wifi size={17} className="shrink-0 text-amber-300" />

            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-500">Status do backend</p>
              <p className="text-sm font-medium text-amber-300">
                Aguardando conexão
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden min-h-screen w-72 shrink-0 flex-col border-r border-white/10 bg-slate-950 lg:flex">
        {content}
      </aside>

      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={onClose}
            aria-hidden="true"
          />

          <aside className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[calc(100vw-3rem)] flex-col bg-slate-950 shadow-2xl shadow-slate-950/80 animate-slide-in-left">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-4 sm:px-6">
              <span className="text-sm font-semibold text-slate-400">
                Menu
              </span>

              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white/10 hover:text-white"
                aria-label="Fechar menu"
              >
                <X size={22} />
              </button>
            </div>

            {content}
          </aside>
        </div>
      )}
    </>
  );
}

export default Sidebar;
