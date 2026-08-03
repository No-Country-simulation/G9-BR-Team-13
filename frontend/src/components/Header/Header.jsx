/**
 * Componente de Cabeçalho (Header).
 * Exibe o título principal da aplicação, uma breve descrição da plataforma,
 * um botão para abrir o menu em telas móveis e um indicador visual do status da API backend.
 *
 * @param {Object} props
 * @param {Function} props.onToggleMenu Função callback para abrir o menu em telas mobile
 * @param {string} [props.backendStatus="checking"] Estado do backend ("online", "offline" ou "checking")
 */

import {
  Menu,
  Wifi,
  WifiOff,
  LoaderCircle,
} from "lucide-react";

function Header({
  onToggleMenu,
  backendStatus = "checking",
}) {
  /**
   * Retorna as propriedades visuais (texto, cores CSS e ícone) correspondentes ao status atual da API.
   *
   * @returns {Object} { text, color, Icon }
   */
  function getStatus() {
    switch (backendStatus) {
      case "online":
        return {
          text: "API Online",
          color:
            "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
          Icon: Wifi,
        };

      case "offline":
        return {
          text: "API Offline",
          color:
            "border-red-400/30 bg-red-400/10 text-red-300",
          Icon: WifiOff,
        };

      default:
        return {
          text: "Verificando...",
          color:
            "border-amber-400/30 bg-amber-400/10 text-amber-300",
          Icon: LoaderCircle,
        };
    }
  }

  const status = getStatus();
  const StatusIcon = status.Icon;

  return (
    <header className="mb-6 flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5 lg:mb-8 lg:flex-row lg:items-center lg:justify-between lg:p-6">
      <div className="flex items-start gap-3 lg:gap-0">
        {/* Botão de abrir menu para telas pequenas (mobile/tablet) */}
        <button
          type="button"
          onClick={onToggleMenu}
          className="-ml-1.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden"
          aria-label="Abrir menu"
        >
          <Menu size={22} />
        </button>

        {/* Título e descrição do sistema */}
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-bold text-white sm:text-xl lg:text-3xl">
            Organização Inteligente de Conteúdo Técnico
          </h2>

          <p className="mt-1 text-xs leading-5 text-slate-400 sm:text-sm">
            Classifique, consulte e reutilize conhecimento usando IA, API REST
            e integração com OCI.
          </p>
        </div>
      </div>

      {/* Tag de status da conexão com a API Backend */}
      <div
        className={`flex shrink-0 items-center gap-2 rounded-2xl px-3 py-2.5 text-xs sm:px-4 sm:text-sm ${status.color}`}
      >
        <StatusIcon
          size={16}
          className={
            backendStatus === "checking"
              ? "animate-spin"
              : ""
          }
        />

        {status.text}
      </div>
    </header>
  );
}

export default Header;