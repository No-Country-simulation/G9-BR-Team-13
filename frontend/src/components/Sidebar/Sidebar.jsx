/**
 * Componente da Barra Lateral de Navegação (Sidebar).
 * Exibe o menu principal com os links para cada rota da aplicação (Analisar, Dashboard, etc.),
 * além da logo, nome do projeto e o indicador do status do servidor backend.
 * Suporta modo Desktop (fixo na tela) e modo Mobile (gaveta deslizante com backdrop).
 *
 * @param {Object} props
 * @param {boolean} props.isMobileOpen Indica se a gaveta do menu móvel está aberta
 * @param {Function} props.onClose Função callback para fechar o menu móvel
 * @param {string} props.backendStatus Estado do backend ("online", "offline" ou "checking")
 */

import {
  BarChart3,
  BookOpen,
  FileSearch,
  History,
  Settings,
  Wifi,
  WifiOff,
  X,
  LoaderCircle,
} from "lucide-react";
import { NavLink } from "react-router-dom";

/**
 * Mapeia o status do backend para rótulo legível, cor do texto e ícone correspondente.
 *
 * @param {string} backendStatus Status da conexão com o servidor
 * @returns {Object} { label, textColor, Icon }
 */
function getBackendStatusData(backendStatus) {
  switch (backendStatus) {
    case "online":
      return {
        label: "Conectado",
        textColor: "text-emerald-300",
        Icon: Wifi,
      };

    case "offline":
      return {
        label: "Desconectado",
        textColor: "text-red-300",
        Icon: WifiOff,
      };

    default:
      return {
        label: "Verificando conexão",
        textColor: "text-amber-300",
        Icon: LoaderCircle,
      };
  }
}

/**
 * Componente utilitário para renderizar o nome do projeto com estilo de cores.
 */
function ProjectName({ className = "" }) {
  return (
    <span className={className}>
      <span className="text-cyan-400">Tech</span>
      <span className="text-white">Mind</span>
    </span>
  );
}

function Sidebar({
  isMobileOpen,
  onClose,
  backendStatus,
}) {
  // Lista dos itens do menu principal da aplicação
  const menuItems = [
    {
      label: "Analisar Conteúdo",
      icon: FileSearch,
      to: "/analisar",
    },
    {
      label: "Dashboard",
      icon: BarChart3,
      to: "/dashboard",
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

  const backendStatusData =
    getBackendStatusData(backendStatus);

  const BackendStatusIcon =
    backendStatusData.Icon;

  // Conteúdo do menu que é reutilizado tanto na versão Desktop quanto na versão Mobile
  const content = (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-5 sm:px-6">
      {/* Cabeçalho da Sidebar com a Logo do Projeto */}
      <div className="mb-8 flex items-start gap-3">
        <img
          src="/logo-techmind.jpg"
          alt="Logo TechMind"
          className="h-12 w-12 shrink-0 rounded-2xl object-cover"
        />

        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-bold leading-tight">
            <ProjectName />
          </h1>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            Plataforma de Organização de Conteúdo Técnico
          </p>
        </div>
      </div>

      {/* Navegação principal */}
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
              <Icon
                size={19}
                className="shrink-0"
              />

              <span className="truncate">
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </nav>

      {/* Rodapé da Sidebar com informações da versão e status da API */}
      <div className="mt-auto pt-6">
        <div className="rounded-3xl border border-white/10 bg-slate-900 p-4 sm:p-5">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-cyan-400/10">
              <img
                src="/logo-techmind.jpg"
                alt=""
                aria-hidden="true"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">
                <ProjectName />
              </p>

              <p className="text-xs text-slate-500">
                Versão 1.0.0
              </p>
            </div>
          </div>

          {/* Widget do status da conexão com o Backend */}
          <div className="flex items-center gap-2 rounded-2xl bg-slate-950 px-3 py-3">
            <BackendStatusIcon
              size={17}
              className={`shrink-0 ${backendStatusData.textColor} ${
                backendStatus === "checking"
                  ? "animate-spin"
                  : ""
              }`}
            />

            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-500">
                Status do backend
              </p>

              <p
                className={`text-sm font-medium ${backendStatusData.textColor}`}
              >
                {backendStatusData.label}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Menu Fixo para Desktop (telas grandes >= 1024px) */}
      <aside className="hidden min-h-screen w-72 shrink-0 flex-col border-r border-white/10 bg-slate-950 lg:flex">
        {content}
      </aside>

      {/* Menu Gaveta para Mobile (telas pequenas < 1024px) */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          isMobileOpen
            ? "visible pointer-events-auto"
            : "invisible pointer-events-none"
        }`}
        aria-hidden={!isMobileOpen}
      >
        {/* Backdrop escuro com efeito de desfoque */}
        <div
          className={`fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300 ${
            isMobileOpen
              ? "opacity-100"
              : "opacity-0"
          }`}
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Conteúdo deslizante do menu móvel */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[calc(100vw-3rem)] flex-col bg-slate-950 shadow-2xl shadow-slate-950/80 transition-transform duration-300 ease-out ${
            isMobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }`}
        >
          {/* Botão de Fechar no topo do menu móvel */}
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
    </>
  );
}

export default Sidebar;